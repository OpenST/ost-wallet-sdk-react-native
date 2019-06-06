/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

import callbackIntercept from './OstWalletWorkflowCallbackIntercept';
import OstRNError from "../OstRNError/OstRNError";
import OstRNApiError from "../OstRNError/OstRNApiError";

const instanceMap = {};

const setInstance = instance => {
  instanceMap[instance.uuid] = instance;
};

const getInstance = uuid => {
  return instanceMap[uuid];
};

const clearInstance = uuid => {
    instanceMap[uuid] = null;
    delete instanceMap[uuid];
};

const callbackInvoker = params =>  {
    if (typeof params == 'string') {
        try {
          params = JSON.parse(params);
        } catch (e) {
          console.warn("Unexpected JSON string", params );
          return;
        }
    }
    let workflowuuid = params['uuid'],
        instance = getInstance( workflowuuid  ),
        functionName = params['functionName'],
        method = instance[ functionName ], 
        data = params['params'],
        interactuuid = params['interactuuid']
    ;
    callbackIntercept[functionName].apply( callbackIntercept, [
        instance,
        method,
        data,
        interactuuid
    ]);
};

const instantiateOstError = error => {
  let isApiError =  error['is_api_error'];
  if( !!isApiError ){
      return new OstRNApiError( error );
  }
  return new OstRNError( error );
};

export { setInstance, getInstance, clearInstance, instantiateOstError , callbackInvoker };
