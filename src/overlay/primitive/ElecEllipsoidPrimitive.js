import * as Cesium from 'cesium'
import { Overlay, OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
class ElecEllipsoidPrimitive extends Overlay {
    constructor (position, radius) {
        super()
        this._position = Parse.parsePosition(position)
        this._radius = radius || { x: 10, y: 10, z: 10 }
        this._delegate = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: {}
            })
        })
        this.type = OverlayType.ELEC_ELLIPSOID_PRIMITIVE
        this._state = State.INITIALIZED
    }

    set position (position) {
        this._position = Parse.parsePosition(position)
        this._delegate.geometryInstances.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
            Transform.transformWGS84ToCartesian(this._position)
        )
        return this
    }

    get position () {
        return this._position
    }

    set radius (radius) {
        this._radius = radius
        this._delegate.geometryInstances.geometry = new Cesium.EllipsoidGeometry({
            radii: this._radius,
            maximumCone: Cesium.Math.PI_OVER_TWO
        })
        return this
    }

    get radius () {
        return this._radius
    }

    /**
     *
     * @private
     */
    _setAppearance () {
        if (!this._style) {
            return
        }
        this._delegate.appearance = new Cesium.MaterialAppearance({
            material: Cesium.Material.fromType('EllipsoidElectric', {
                color: this._style.color || Cesium.Color.GREEN,
                speed: this._style.speed || 5
            })
        })
    }

    _mountedHook () {
        /**
         *  set the radius
         */
        this.radius = this._radius

        /**
         *  set the position
         */
        this.position = this._position

        /**
         * set the appearance
         */
        !this._delegate.appearance && this._setAppearance()
    }

    /**
     * Sets Style
     * @param style
     * @returns {ElecEllipsoidPrimitive}
     */
    setStyle (style = {}) {
        if (Object.keys(style).length === 0) {
            return this
        }
        this._style = style
        this._setAppearance()
        return this
    }
}

export default ElecEllipsoidPrimitive
