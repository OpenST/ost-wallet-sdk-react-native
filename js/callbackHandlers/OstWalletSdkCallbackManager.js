import callbackIntercept from './OstWalletWorkflowCallbackIntercept';

const instanceMap = {};

function setInstance(instance) {
    instanceMap[instance.uuid] = instance;
}

function getInstance(uuid) {
    return instanceMap[uuid];
}

function clearInstance(uuid) {
    instanceMap[uuid] = null;
    delete instanceMap[uuid];
}

function callbackInvoker(params) {
    if (typeof params == 'string') {
        try {
          params = JSON.parse(params);
        } catch (e) {
          console.error("Unexpected JSON string", params ); 
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
}

export { setInstance, getInstance, clearInstance, callbackInvoker };
