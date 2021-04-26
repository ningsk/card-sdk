import * as Cesium from 'cesium'
import Overlay from '@/dc/overlay/Overlay'
import { OverlayType } from '@/dc/overlay'
import State from '@/dc/const/State'
import Parse from '@/dc/parse/Parse'
import { Transform } from '@/dc/transform'
import { Util } from '@/dc/util'
class PolylineVolume extends Overlay {
    constructor (positions, shape) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._shape = shape || []
        this._delegate = new Cesium.Entity({ polylineVolume: {} })
        this.type = OverlayType.POLYLINE_VOLUME
        this._state = State.INITIALIZED
    }

    set positions (positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.polylineVolume.positions = Transform.transformWGS84ArrayToCartesianArray(
            this._positions
        )
        return this
    }

    get positions () {
        return this._positions
    }

    set shape (shape) {
        this._shape = shape || []
        this._delegate.polylineVolume.shape = this._shape
        return this
    }

    get shape () {
        return this._shape
    }

    _mountedHook () {
        /**
         * set the location
         */
        this.positions = this._positions

        /**
         *  initialize the Overlay parameter
         */
        this.shape = this._shape
    }

    /**
     * @param text
     * @param textStyle
     * @returns {PolylineVolume}
     */
    setLabel (text, textStyle) {
        return this
    }

    /**
     * Sets style
     * @param style
     * @returns {PolylineVolume}
     */
    setStyle (style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['positions'] && delete style['shape']
        this._style = style
        Util.merge(this._delegate.polylineVolume, this._style)
        return this
    }

    /**
     * Parses from entity
     * @param entity
     * @param shape
     * @returns {PolylineVolume|any}
     */
    static fromEntity (entity, shape) {
        let polylineVolume
        const now = Cesium.JulianDate.now()
        if (entity.polyline) {
            const positions = Transform.transformCartesianArrayToWGS84Array(
                entity.polyline.positions.getValue(now)
            )
            polylineVolume = new PolylineVolume(positions, shape)
            polylineVolume.attr = {
                ...entity.properties.getValue(now)
            }
        }
        return polylineVolume
    }
}
export default PolylineVolume
