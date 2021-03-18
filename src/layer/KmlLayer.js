/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-15 14:30:35
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-18 11:14:21
 */
import { Cesium } from "../namespace"
import State from '../state/State'
import Layer from './Layer'

class KmlLayer extends Layer {
    constructor(id, url, options = {}) {
        if (!url) {
            throw new Error('KmlLayer: the url is empty')
        }
        super(id)
        this._delegate = Cesium.KmlDataSource.load(url, options)
        this.type = Layer.getLayerType('kml')
        this._state = State.INITIALIZED
    }

    set show(show) {
        this._show = show
        this._delegate &&
            this._delegate.then(dataSource => {
                dataSource.show = this._show
            })
    }

    get show() {
        return this._show
    }

    eachOverlay(method, context) {
        if (this._delegate) {
            this._delegate.then(dataSource => {
                let entities = dataSource.entities.values
                entities.forEach(item => {
                    method.call(context, item)
                })
            })
            return this
        }
    }
}

Layer.registerType('kml')

export default KmlLayer
