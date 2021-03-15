/*
 * @Description: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:10:15
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-15 14:10:51
 */
import { Util } from '../../utils'
import State from '../../state/State'
import Transform from '../../transform/Transform'
import Parse from '../../parse/Parse'
import Overlay from '../Overlay'
import Cesium from "cesium"

class Label extends Overlay {
    constructor(position, text) {
        super()
        this._delegate = new Cesium.Entity({ label: {} })
        this._position = Parse.parsePosition(position)
        this._text = text
        this.type = Overlay.getOverlayType('label')
        this._state = State.INITIALIZED
    }

    set position(position) {
        this._position = Parse.parsePosition(position)
        this._delegate.position = Transform.transformWGS84ToCartesian(
            this._position
        )
        return this
    }

    get position() {
        return this._position
    }

    set text(text) {
        this._text = text
        this._delegate.label.text = this._text
        return this
    }

    get text() {
        return this._text
    }

    _mountedHook() {
        /**
         * set the location
         */
        this.position = this._position

        /**
         *  initialize the Overlay parameter
         */
        this.text = this._text
    }

    /**
     *
     * @param {*} text
     * @param {*} textStyle
     */
    setLabel(text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {Label}
     */
    setStyle(style) {
        if (!style || Object.keys(style).length === 0) {
            return this
        }
        delete style['text']
        this._style = style
        Util.merge(this._delegate.label, this._style)
        return this
    }

    /**
     * Parse from entity
     * @param entity
     * @returns {any}
     */
    static fromEntity(entity) {
        let now = Cesium.JulianDate.now()
        let position = Transform.transformCartesianToWGS84(
            entity.position.getValue(now)
        )
        let label = undefined
        if (entity.billboard) {
            label = new Label(position, entity.name)
            label.attr = {
                ...entity?.properties?.getValue(now)
            }
        }
        return label
    }
}

Overlay.registerType('label')

export default Label