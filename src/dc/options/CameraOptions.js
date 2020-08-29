/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 16:39:04
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 16:39:48
 */

import Cesium from "cesium";
class CameraOptions {
  constructor(viewer) {
    this._viewer = viewer;
    this._mouseMode = 0;
  }

  /**
   *
   * @param {*} min
   * @param {*} max
   */
  setPitchRange(min, max) {
    let handler = new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);
    if (this._viewer.scene.mode === Cesium.SceneMode.SCENE3D) {
      handler.setInputAction(
        (movement) => {
          handler.setInputAction((movement) => {
            let enableTilt = true;
            let isUp = movement.endPosition.y < movement.startPosition.y;
            if (
              isUp &&
              this._viewer.camera.pitch > Cesium.Math.toRadians(max)
            ) {
              enableTilt = false;
            } else if (
              !isUp &&
              this._viewer.camera.pitch < Cesium.Math.toRadians(min)
            ) {
              enableTilt = false;
            } else {
              enableTilt = true;
            }
            this._viewer.scene.screenSpaceCameraController.enableTilt = enableTilt;
          }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },
        this._mouseMode === 0
          ? Cesium.ScreenSpaceEventType.MIDDLE_DOWN
          : Cesium.ScreenSpaceEventType.RIGHT_DOWN
      );
      handler.setInputAction(
        (movement) => {
          this._viewer.scene.screenSpaceCameraController.enableTilt = true;
          handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        },
        this._mouseMode === 0
          ? Cesium.ScreenSpaceEventType.MIDDLE_UP
          : Cesium.ScreenSpaceEventType.RIGHT_UP
      );
    }
  }

  limitCameraToGround() {
    this._viewer.camera.changed.addEventListener((framestate) => {
      if (
        this._viewer.camera._suspendTerrainAdjustment &&
        this._viewer.scene.mode === Cesium.SceneMode.SCENE3D
      ) {
        this._viewer.camera._suspendTerrainAdjustment = false;
        this._viewer.camera._adjustOrthographicFrustum(true);
      }
    });
  }

  /**
   *
   * @param {*} west
   * @param {*} south
   * @param {*} east
   * @param {*} north
   */
  setBounds(west, south, east, north) {}

  /**
   *
   * @param {*} mouseMode
   */
  changeMouseMode(mouseMode) {
    this._mouseMode = mouseMode || 0;
    if (mouseMode === 0) {
      this._viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.MIDDLE_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
        {
          eventType: Cesium.CameraEventType.RIGHT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
      ];
      this._viewer.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ];
    } else if (mouseMode === 1) {
      this._viewer.scene.screenSpaceCameraController.tiltEventTypes = [
        Cesium.CameraEventType.RIGHT_DRAG,
        Cesium.CameraEventType.PINCH,
        {
          eventType: Cesium.CameraEventType.LEFT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
        {
          eventType: Cesium.CameraEventType.RIGHT_DRAG,
          modifier: Cesium.KeyboardEventModifier.CTRL,
        },
      ];
      this._viewer.scene.screenSpaceCameraController.zoomEventTypes = [
        Cesium.CameraEventType.WHEEL,
        Cesium.CameraEventType.PINCH,
      ];
    }
  }
}

export default CameraOptions;
