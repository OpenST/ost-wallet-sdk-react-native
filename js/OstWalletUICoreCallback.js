/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

import uuidv4 from 'uuid/v4';
import { setInstance } from './callbackHandlers/OstWalletSdkUICallbackManager';
import EventEmitter from 'eventemitter3';

/**
 * OstWalletUIWorkFlowCallback
 * All callback workflow implementations class should be derived from OstWalletUIWorkFlowCallback
 */

 const EventNames = {
    "requestAcknowledged": "requestAcknowledged",
    "flowComplete": "flowComplete",
    "flowInterrupt": "flowInterrupt"
 };

class OstWalletUIWorkFlowCallback {

  static get EVENTS() {
    return EventNames;
  };

  /**
   * @constructor: Should be called from derived class constructor always.
   * super();
   */
  constructor( appCallback ) {
    this.uuid = uuidv4();
    this.appCallback = appCallback;
    this.ee = new EventEmitter(); 
    setInstance(this);
  }

  /** Get server defined passphrase from user.
   *
   * @param {String} userId - Id of user whose passphrase is required.
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param {OstPassphrasePrefixAccept} setPassphrase - Set passhrase which received from server
   */
  getPassphrase( userId, ostWorkflowContext, OstPassphrasePrefixAccept) { 
    this.appCallback.getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept);
  }
  /**
   * Request acknowledged
   * @param {String} workflowId - Workflow id
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param ostContextEntity - info about entity
   * @override
   */
  requestAcknowledged( workflowId, ostWorkflowContext , ostContextEntity ) {
    let eName = EventNames.requestAcknowledged;
    this.ee.emit(eName, this.uuid, ostWorkflowContext , ostContextEntity);
    this.appCallback.requestAcknowledged && this.appCallback.requestAcknowledged(this.uuid, ostWorkflowContext , ostContextEntity);
  }

  /**
   * Flow complete
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete( workflowId, ostWorkflowContext , ostContextEntity ) {
    let eName = EventNames.flowComplete;
    this.ee.emit(eName, this.uuid, ostWorkflowContext , ostContextEntity);
    this.appCallback.flowComplete && this.appCallback.flowComplete(this.uuid, ostWorkflowContext , ostContextEntity);
  }

  /**
   * Flow interrupt
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext workflow type
   * @param ostError reason of interruption
   * @override
   */
  flowInterrupt( workflowId, ostWorkflowContext , ostError)  {
    let eName = EventNames.flowInterrupt;
    this.ee.emit(eName, this.uuid, ostWorkflowContext , ostError);
    this.appCallback.flowInterrupt && this.appCallback.flowInterrupt(this.uuid, ostWorkflowContext , ostError);
  }

  getEventEmitter() {
    return this.ee;
  }

}

export default OstWalletUIWorkFlowCallback;
