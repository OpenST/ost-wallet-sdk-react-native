/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

import uuidv4 from 'uuid/v4';
import { setInstance } from './callbackHandlers/OstWalletSdkUICallbackManager';

/**
 * OstWalletUIWorkFlowCallback
 * All callback workflow implementations class should be derived from OstWalletUIWorkFlowCallback
 */

class OstWalletUIWorkFlowCallback {

  /**
   * @constructor: Should be called from derived class constructor always.
   * super();
   */
  constructor() {
    this.uuid = uuidv4();
    setInstance(this);
  }

  /** Get server defined passphrase from user.
   *
   * @param {String} userId - Id of user whose passphrase is required.
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param {OstPassphrasePrefixAccept} setPassphrase - Set passhrase which received from server
   */
  getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) { }
  /**
   * Request acknowledged
   * @param {String} workflowId - Workflow id
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param ostContextEntity - info about entity
   * @override
   */
  requestAcknowledged(workflowId, ostWorkflowContext , ostContextEntity ) {  }

  /**
   * Flow complete
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(workflowId, ostWorkflowContext , ostContextEntity ) {   }

  /**
   * Flow interrupt
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext workflow type
   * @param ostError reason of interruption
   * @override
   */
  flowInterrupt(workflowId, ostWorkflowContext , ostError)  {   }
}

export default OstWalletUIWorkFlowCallback;
