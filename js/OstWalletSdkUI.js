/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

import { NativeModules } from 'react-native';
const { OstWalletSdkUI } = NativeModules;
import OstWalletUIWorkflowCallback from './OstWalletUIWorkflowCallback';
import OstWalletUICoreCallback from './OstWalletUICoreCallback';
import * as OstWalletSdkUICallbackManager from './callbackHandlers/OstWalletSdkUICallbackManager';

class OstWalletRNSdkUI {

  /**
   * Set theme config
   * @param {object} config - Config for theme
   */
  setThemeConfig(config) {
    OstWalletSdkUI.setThemeConfig(config);
  }

  getThemeConfig(callback) {
    OstWalletSdkUI.getThemeConfig((config) => {
      if (callback && typeof callback === 'function') {
        callback(config);
      }
    })
  }

  /**
   * Set content config
   * @param {object} config - Config for content
   */
  setContentConfig(config) {
    OstWalletSdkUI.setContentConfig(config)
  }
  /**
   * Active user
   * @param {String} userId - Ost User id
   * @param {String} expiresAfterInSecs - session key expiry time.
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  activateUser(userId, expiresAfterInSecs, spendingLimit, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.activateUser(userId, String(expiresAfterInSecs), String(spendingLimit), coreUiCallback.uuid);
    return coreUiCallback.uuid;
  }

  /**
   * Initiate device recovery 
   * @param {String} userId - Ost User id
   * @param {String} deviceAddressToRecover - Device address which wants to recover
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication 
   * @public
   */
  initiateDeviceRecovery(userId, deviceAddressToRecover, uiCallback ) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.initiateDeviceRecovery( userId, deviceAddressToRecover, coreUiCallback.uuid ); 
    return coreUiCallback.uuid;
  }

  /**
   * Abort device recovery 
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication 
   * @public
   */
  abortDeviceRecovery( userId, uiCallback ) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.abortDeviceRecovery( userId, coreUiCallback.uuid); 
    return coreUiCallback.uuid;
  }

  /* Begin: Reserved space for other workflow methods. */

  /**
   * Add user session
   * @param {String} userId - Ost User id
   * @param {String} expiresAfterInSecs - session key expiry time.
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  addSession(userId, expiresAfterInSecs, spendingLimit, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.addSession(userId.toString(), String(expiresAfterInSecs), String(spendingLimit), coreUiCallback.uuid);
    return coreUiCallback.uuid;
  }

  /**
   * Revoke device
   * @param {String} userId - Ost User id
   * @param {String} deviceAddressToRecover - Device address which wants to recover
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  revokeDevice(userId, deviceAddressToRevoke, uiCallback ) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.revokeDevice( userId, deviceAddressToRevoke, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }

  /**
   * Get device mnemonics
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  getDeviceMnemonics(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.getDeviceMnemonics( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }

  /**
   * Update biometric prederence
   * @param {String} userId - Ost User id
   * @param {boolean} enable - to enable biometric prefernce
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  updateBiometricPreference( userId , enable , uiCallback ){
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    enable =  !!enable;
    OstWalletSdkUI.updateBiometricPreference( userId,  enable,  coreUiCallback.uuid  );
    return coreUiCallback.uuid;
  }

  /**
   * Authorize user device with mnemonics
   * @param {String} userId - Ost User id
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication
   * @public
   */
  authorizeCurrentDeviceWithMnemonics(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.authorizeCurrentDeviceWithMnemonics(userId, coreUiCallback.uuid);

    return coreUiCallback.uuid;
  }

  /**
   * Reset pin
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  resetPin(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.resetPin( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }

  /**
   * Get add device QR code
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  getAddDeviceQRCode(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.getAddDeviceQRCode( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }

  /**
   * Authorize device via QR code
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  scanQRCodeToAuthorizeDevice(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.scanQRCodeToAuthorizeDevice( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }

  /**
   * Execute transaction via QR code
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  scanQRCodeToExecuteTransaction(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.scanQRCodeToExecuteTransaction( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }

  /**
   * Show device component sheet
   */
  showComponentSheet() {
    OstWalletSdkUI.showComponentSheet()
  }

  /* End: Reserved space for other workflow methods. */
  /* region: Event emitter. */

  get EVENTS() {
    return OstWalletUICoreCallback.EVENTS;
  }

  /**
   * Subscribes to specified event of UI Workflow.
   * @param {String} workflowId - Id of the workflow as returned by methods of OstWalletSdkUI
   * @param {String} eventName - Name of the event to subscribe to.
   * @param {Function} listener - The listener function.
   * @param {*} context - The context to invoke the listener with.
   * @returns {Boolean} - false if failed to subscribe.
   * @public
   */
  subscribe(workflowId, eventName, listener, context) {
    if ( !this._isEventNameValid( eventName ) ) { return false; }

    let coreCallback = OstWalletSdkUICallbackManager.getInstance( workflowId );
    if ( !coreCallback ) { return false; }

    let emitter = coreCallback.getEventEmitter();
    emitter.on(eventName, listener, context);
    return true;
  }

  /**
   * Subscribes once to specified event of UI Workflow.
   * @param {String} workflowId - Id of the workflow as returned by methods of OstWalletSdkUI
   * @param {String} eventName - Name of the event to subscribe to.
   * @param {Function} listener - The listener function.
   * @param {*} context - The context to invoke the listener with.
   * @returns {Boolean} - false if failed to subscribe.
   * @public
   */
  subscribeOnce(workflowId, eventName, listener, context) {
    if ( !this._isEventNameValid( eventName ) ) { return false; }

    let coreCallback = OstWalletSdkUICallbackManager.getInstance( workflowId );
    if ( !coreCallback ) { return false; }

    let emitter = coreCallback.getEventEmitter();
    emitter.once(eventName, listener, context);
    return true;
  }

  /**
   * Unsubscribes the listner from the specified event of UI Workflow.
   * @param {String} workflowId - Id of the workflow as returned by methods of OstWalletSdkUI
   * @param {String} eventName - Name of the event to subscribe to.
   * @param {Function} listener - The listener function.
   * @param {*} context - The context to invoke the listener with.
   * @returns {Boolean} - false if failed to subscribe.
   * @public
   */
  unsubscribe(workflowId, eventName, listener, context) {
    if ( !this._isEventNameValid( eventName ) ) { return false; }

    let coreCallback = OstWalletSdkUICallbackManager.getInstance( workflowId );
    if ( !coreCallback ) { return false; }

    let emitter = coreCallback.getEventEmitter();
    emitter.removeListener(eventName, listener, context);
    return true;
  }
  /* endregion: Event emitter. */

  _isEventNameValid( eventName ) {
    const eventNames = OstWalletUICoreCallback.EVENTS;
    return eventNames.hasOwnProperty( eventName );
  }

  _getCoreUiCallback(uiCallback) {
    if ( !uiCallback || !(uiCallback instanceof OstWalletUIWorkflowCallback) ) {
      let err = new Error('Invalid uiCallback. The argument \'uiCallback\' must be an instanceof OstWalletUIWorkflowCallback');
    }    
    return new OstWalletUICoreCallback(uiCallback);
  }
}

export default new OstWalletRNSdkUI();