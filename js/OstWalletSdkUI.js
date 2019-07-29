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