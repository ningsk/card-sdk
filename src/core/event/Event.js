/*
 * @Description:
 * @version:
 * @Author: 宁四凯
 * @Date: 2020-08-28 15:32:50
 * @LastEditors: 宁四凯
 * @LastEditTime: 2020-08-28 16:16:45
 */
class Event {
  constructor() {
    this._cache = {};
    this._registerEvent();
  }

  /**
   * Event registration
   * Subclasses need to override
   */
  _registerEvent() {}

  /**
   *
   * @param {*} type
   * @param {*} callback
   * @param {*} context
   */
  _on(type, callback, context) {
    let event = this.getEvent(type);
    let removeCallback = undefined;
    if (event && callback) {
      removeCallback = event.addEventListener(callback, context || this);
    }
    return removeCallback;
  }

  /**
   *
   * @param {*} type
   * @param {*} callback
   * @param {*} context
   */
  _off(type, callback, context) {
    let event = this.getEvent(type);
    let removed = false;
    if (event && callback) {
      removed = event.removeEventListener(callback, context || this);
    }
    return removed;
  }

  /**
   *
   * @param {*} type
   * @param {*} params
   */
  _fire(type, params) {
    let event = this.getEvent(type);
    if (event) {
      event.raiseEvent(params);
    }
  }

  /**
   *
   * @param {*} type
   * @param {*} callback
   * @param {*} context
   */
  on(type, callback, context) {
    return this._on(type, callback, context);
  }

  /**
   *
   * @param {*} type
   * @param {*} callback
   * @param {*} context
   */
  once(type, callback, context) {
    let removeCallback = this._on(type, callback, context);
    removeCallback && removeCallback();
  }

  /**
   *
   * @param {*} type
   * @param {*} callback
   * @param {*} context
   */
  off(type, callback, context) {
    return this._off(type, callback, context);
  }

  /**
   *
   * @param {*} type
   * @param {*} params
   */
  fire(type, params) {
    this._fire(type, params);
  }

  getEvent(type) {
    return this._cache[type] || undefined;
  }
}

export default Event;
