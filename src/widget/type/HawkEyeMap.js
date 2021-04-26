import { DomUtil, Util } from '@/dc/util'
import Widget from '@/dc/widget/Widget'
import State from '@/dc/const/State'
import * as Cesium from 'cesium'
import { SceneEventType } from '@/dc/event'

const DEF_OPTS = {
  animation: false,
  baseLayerPicker: false,
  imageryProvider: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  infoBox: false,
  sceneModePicker: false,
  selectionIndicator: false,
  timeline: false,
  navigationHelpButton: false,
  navigationInstructionsInitiallyVisible: false,
  creditContainer: undefined
}

class HawkEyeMap extends Widget {
  constructor () {
    super()
    this._wrapper = DomUtil.create('div', 'dc-hawk-eye-map', null)
    this._wrapper.setAttribute('id', Util.uuid())
    this._baseLayers = []
    this._map = undefined
    this.type = Widget.getWidgetType('hawk_eye_map')
    this._state = State.INITIALIZED
  }

  get baseLayers () {
    return this._baseLayers
  }

  /**
   *
   * @private
   */
  _mountContent () {
    const map = new Cesium.Viewer(this._wrapper, {
      ...DEF_OPTS,
      sceneMode: Cesium.SceneMode.SCENE2D
    })
    map.imageryLayers.removeAll()
    map.cesiumWidget.creditContainer.style.display = 'none'
    map.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    map.scene.backgroundColor = Cesium.Color.TRANSPARENT
    Util.merge(map.scene.screenSpaceCameraController, {
      enableRotate: false,
      enableTranslate: false,
      enableZoom: false,
      enableTilt: false,
      enableLook: false,
      maximumZoomDistance: 40489014.0
    })
    this._map = map

    this._ready = true
  }

  /**
   *
   * @private
   */
  _bindEvent () {
    this._map.on(SceneEventType.CAMERA_CHANGED, this._syncMap, this)
  }

  /**
   *
   * @private
   */
  _unbindEvent () {
    this._map.off(SceneEventType.CAMERA_CHANGED, this._syncMap, this)
  }

  /**
   *
   * @private
   */
  _installHook () {
    Object.defineProperty(this._map, 'hawkEyeMap', {
      value: this,
      writable: false
    })
    this._map.camera.percentageChanged = 0.01
  }

  /**
   *
   * @returns {boolean}
   * @private
   */
  _syncMap () {
    const viewCenter = new Cesium.Cartesian2(
      Math.floor(this._map.canvas.clientWidth / 2),
      Math.floor(this._map.canvas.clientHeight / 2)
    )
    const worldPosition = this._map.scene.camera.pickEllipsoid(viewCenter)
    if (!worldPosition) {
      return false
    }
    const distance = Cesium.Cartesian3.distance(
      worldPosition,
      this._map.scene.camera.positionWC
    )
    this._map.scene.camera.lookAt(
      worldPosition,
      new Cesium.Cartesian3(0.0, 0.0, distance)
    )
  }

  /**
   *
   * @param baseLayer
   * @returns {HawkEyeMap}
   */
  addBaseLayer (baseLayer) {
    if (!this._map || !this._enable) {
      return this
    }
    if (baseLayer) {
      if (this._baseLayers && this._baseLayers.length) {
        this._map.imageryLayers.removeAll()
      }
      if (!Array.isArray(baseLayer)) {
        baseLayer = [baseLayer]
      }
      baseLayer.forEach(item => {
        this._baseLayers.push(this._map.imageryLayers.addImageryProvider(item))
      })
    }
    return this
  }
}
export default HawkEyeMap
