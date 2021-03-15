/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-12 11:56:05
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-12 11:56:34
 */
import MaterialProperty from '../../MaterialProperty'

import * as Cesium from "cesium"

const IMG = require('../../../images/lighting.png')

class PolylineLightingMaterialProperty extends MaterialProperty {
    constructor(options = {}) {
        super(options)
        this._image = undefined
        this._imageSubscription = undefined
        this.image = IMG
    }

    getType(time) {
        return Cesium.Material.PolylineLightingType
    }

    getValue(time, result) {
        if (!result) {
            result = {}
        }
        result.color = Cesium.Property.getValueOrUndefined(this._color, time)
        result.image = Cesium.Property.getValueOrUndefined(this._image, time)
        return result
    }

    equals(other) {
        return (
            this === other ||
            (other instanceof PolylineLightingMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._image, other._image))
        )
    }
}

Object.defineProperties(PolylineLightingMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    image: Cesium.createPropertyDescriptor('image')
})

export default PolylineLightingMaterialProperty