import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

import BaseSdkInteract from './BaseSdkInteract';

class OstDeviceRegistered extends BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        super(workflowuuid, interactuuid);
    }

    deviceRegistered(apiResponse, errorCallback) {
        try {
          apiResponse = apiResponse && JSON.stringify(apiResponse) ;
        }catch (e){
          console.warn("Unexpected JSON Object apiResponse in deviceRegistered", apiResponse );
        }
        OstRNSdkCallbackManager.deviceRegistered(this.interactuuid, apiResponse, function( error ){
            BaseSdkInteract.errorCallbackInvoker( error , errorCallback );
        });
    }
}

export default OstDeviceRegistered;
