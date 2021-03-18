/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2021-03-16 10:50:08
 * @LastEditors: sueRimn
 * @LastEditTime: 2021-03-16 13:47:26
 */
import { DomUtil } from '../util/index'
import State from '../state/State'
import Widget from './Widget'
import Icon from '../icon/index'

class Attribution extends Widget {
    constructor() {
        super()
        this._wrapper = DomUtil.create('div', 'dc-attribution')
        this._wrapper.style.cssText = `
      position: absolute;
      left: 2px;
      bottom: 2px;
      font-size: 14px;
      color: #a7a7a7;
      padding: 2px 5px;
      border-radius: 2px;
      user-select: none;
      display:flex;
    `
        this._config = undefined
        this.type = Widget.getWidgetType('attribution')
        this._state = State.INSTALLED
    }

    _installHook() {
        let logo = DomUtil.create('img', '', this._wrapper)
        logo.src = Icon.logo
        let a = DomUtil.create('a', '', this._wrapper)
        a.innerHTML = '数字视觉'
        a.href = 'javascript:void(0)'
        a.onclick = () => {
            window.open('https://www.dvgis.cn')
        }
        a.style.cssText = `color:#a7a7a7;font-size:14px`
        this.enable = true
    }
}

Widget.registerType('attribution')

export default Attribution
