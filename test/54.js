/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.style2Entity = style2Entity;
exports.getPositions = getPositions;
exports.getCoordinates = getCoordinates;
exports.toGeoJSON = toGeoJSON;

var _cesium = __webpack_require__(0);

var Cesium = _interopRequireWildcard(_cesium);

var _util = __webpack_require__(1);

var _pointconvert = __webpack_require__(4);

var pointconvert = _interopRequireWildcard(_pointconvert);

var _globe = __webpack_require__(18);

var globe = _interopRequireWildcard(_globe);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

//属性赋值到entity
function style2Entity(style, entityattr) {
    style = style || {};

    if (entityattr == null) {
        //默认值
        entityattr = {
            fill: true
        };
    }

    //贴地时，剔除高度相关属性
    if (style.clampToGround) {
        if (style.hasOwnProperty('height')) delete style.height;
        if (style.hasOwnProperty('extrudedHeight')) delete style.extrudedHeight;
    }

    //Style赋值值Entity
    for (var key in style) {
        var value = style[key];
        switch (key) {
            default:
                //直接赋值
                entityattr[key] = value;
                break;
            case "opacity": //跳过扩展其他属性的参数
            case "outlineOpacity":
            case "distanceDisplayCondition_far":
            case "distanceDisplayCondition_near":
                break;
            case "outlineColor":
                //边框颜色
                entityattr.outlineColor = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(style.outlineOpacity || style.opacity || 1.0);
                break;
            case "color":
                //填充颜色
                entityattr.material = Cesium.Color.fromCssColorString(value || "#FFFF00").withAlpha(Number(style.opacity || 1.0));
                break;
            case "cornerType":
                switch (value) {
                    case "BEVELED":
                        entityattr.cornerType = Cesium.CornerType.BEVELED;
                        break;
                    case "MITERED":
                        entityattr.cornerType = Cesium.CornerType.MITERED;
                        break;
                    case "ROUNDED":
                        entityattr.cornerType = Cesium.CornerType.ROUNDED;
                        break;
                    default:
                        entityattr.cornerType = value;
                        break;
                }
                break;
            case "distanceDisplayCondition":
                //是否按视距显示
                if (value) {
                    if (value instanceof Cesium.DistanceDisplayCondition) {
                        entityattr.distanceDisplayCondition = value;
                    } else {
                        entityattr.distanceDisplayCondition = new Cesium.DistanceDisplayCondition(Number(Cesium.defaultValue(style.distanceDisplayCondition_near, 0)), Number(Cesium.defaultValue(style.distanceDisplayCondition_far, 100000)) + 6378137);
                    }
                } else {
                    entityattr.distanceDisplayCondition = undefined;
                }
                break;
            case "hasShadows":
                //阴影
                if (value) entityattr.shadows = Cesium.ShadowMode.ENABLED; //对象投射并接收阴影。
                else entityattr.shadows = Cesium.ShadowMode.DISABLED; //该对象不会投射或接收阴影
                break;

        }
    }

    //设置填充材质
    globe.setFillMaterial(entityattr, style);

    return entityattr;
}

//获取entity的坐标
function getPositions(entity) {
    return entity.corridor.positions.getValue((0, _util.currentTime)());
}

//获取entity的坐标（geojson规范的格式）
function getCoordinates(entity) {
    var positions = getPositions(entity);
    var coordinates = pointconvert.cartesians2lonlats(positions);
    return coordinates;
}

//entity转geojson
function toGeoJSON(entity) {
    var coordinates = getCoordinates(entity);
    return {
        type: "Feature",
        properties: entity.attribute || {},
        geometry: {
            type: "LineString",
            coordinates: coordinates
        }
    };
}

/***/ }),