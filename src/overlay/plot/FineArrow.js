/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-18 09:55:14
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 09:55:38
 */

import * as Cesium from "cesium"
import State from '../../state/State'
import Parse from '../../parse/Parse'
import { Util, PlotUtil } from '../../util/index'
import Transform from '../../transform/Transform'
import Overlay from '../Overlay'

const HALF_PI = Math.PI / 2

class FineArrow extends Overlay {
    constructor(positions) {
        super()
        this._positions = Parse.parsePositions(positions)
        this._delegate = new Cesium.Entity({ polygon: {} })
        this.tailWidthFactor = 0.15
        this.neckWidthFactor = 0.2
        this.headWidthFactor = 0.25
        this.headAngle = Math.PI / 8.5
        this.neckAngle = Math.PI / 13
        this.type = Overlay.getOverlayType('fine_arrow')
        this._state = State.INITIALIZED
    }

    set positions(positions) {
        this._positions = Parse.parsePositions(positions)
        this._delegate.polygon.hierarchy = this._getHierarchy()
        return this
    }

    get positions() {
        return this._positions
    }

    _getHierarchy() {
        let pnts = Parse.parsePolygonCoordToArray(this._positions)[0]
        let pnt1 = pnts[0]
        let pnt2 = pnts[1]
        let len = PlotUtil.getBaseLength(pnts)
        let tailWidth = len * this.tailWidthFactor
        let neckWidth = len * this.neckWidthFactor
        let headWidth = len * this.headWidthFactor
        let tailLeft = PlotUtil.getThirdPoint(pnt2, pnt1, HALF_PI, tailWidth, true)
        let tailRight = PlotUtil.getThirdPoint(
            pnt2,
            pnt1,
            HALF_PI,
            tailWidth,
            false
        )
        let headLeft = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.headAngle,
            headWidth,
            false
        )
        let headRight = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.headAngle,
            headWidth,
            true
        )
        let neckLeft = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.neckAngle,
            neckWidth,
            false
        )
        let neckRight = PlotUtil.getThirdPoint(
            pnt1,
            pnt2,
            this.neckAngle,
            neckWidth,
            true
        )
        return new Cesium.PolygonHierarchy(
            Transform.transformWGS84ArrayToCartesianArray(
                Parse.parsePositions([
                    tailLeft,
                    neckLeft,
                    headLeft,
                    pnt2,
                    headRight,
                    neckRight,
                    tailRight
                ])
            )
        )
    }

    _mountedHook() {
        /**
         *  set the location
         */
        this.positions = this._positions
    }

    /**
     *
     * @param text
     * @param textStyle
     * @returns {FineArrow}
     */
    setLabel(text, textStyle) {
        return this
    }

    /**
     * Sets Style
     * @param style
     * @returns {FineArrow}
     */
    setStyle(style) {
        if (Object.keys(style).length === 0) {
            return this
        }
        delete style['positions']
        this._style = style
        Util.merge(this._delegate.polygon, this._style)
        return this
    }
}

Overlay.registerType('fine_arrow')

export default FineArrow