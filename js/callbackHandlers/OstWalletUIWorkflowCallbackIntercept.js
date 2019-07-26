/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

// import { clearInstance , instantiateOstError } from './OstWalletSdkCallbackManager';
import OstPassphrasePrefixAccept from '../UIInteracts/OstPassphrasePrefixAccept';

const ostWorkflowContextKey = "ostWorkflowContext",
  ostContextEntityKey   = "ostContextEntity",
  ostErrorKey           = "ostError",
  userIdKey             = "userId",
  workflowIdKey         = "workflowId"
;

let clearInstance, instantiateOstError;
import('./OstWalletSdkCallbackManager').then((imports) => {
  clearInstance = imports.clearInstance;
  instantiateOstError = imports.instantiateOstError;
});


class OstWalletUIWorkFlowCallbackIntercepts {


  registerDevice( instance, method, data, interactuuid ) {
    let interactInstance = new OstPassphrasePrefixAccept(instance.uuid, interactuuid),
      apiParams = data['apiParams'],
      args = [apiParams, interactInstance];
    instance && method.apply(instance, args);
  }

  getPassphrase(instance, method, data, interactuuid) {
    let interactInstance = new OstPassphrasePrefixAccept(instance.uuid, interactuuid)
      , ostWorkflowContext = data[ostWorkflowContextKey]
      , workflowId = data[workflowIdKey]
    args = [workflowId, ostWorkflowContext, interactInstance];
    instance && method.apply(instance, args);
  }

  requestAcknowledged( instance, method, data , interactuuid ) {
    let ostWorkflowContext = data[ostWorkflowContextKey],
      ostContextEntity = data[ostContextEntityKey],
      workflowId = data[workflowIdKey]
      args = [workflowId, ostWorkflowContext , ostContextEntity];
    instance && method.apply(instance, args);
  }

  flowComplete( instance, method, data , interactuuid ) {
    let ostWorkflowContext = data[ostWorkflowContextKey],
      ostContextEntity = data[ostContextEntityKey],
      workflowId = data[workflowIdKey],
      args = [workflowId, ostWorkflowContext , ostContextEntity ];
    clearInstance(instance.uuid);
    instance && method.apply(instance, args);
  }

  flowInterrupt( instance, method, data , interactuuid ) {
    let ostWorkflowContext = data[ostWorkflowContextKey],
      ostError = instantiateOstError ( data[ostErrorKey] ) ,
      workflowId = data[workflowIdKey],
      args = [workflowId, ostWorkflowContext, ostError ];
    clearInstance(instance.uuid);
    instance && method.apply(instance, args);
  }
}

export default new OstWalletUIWorkFlowCallbackIntercepts();