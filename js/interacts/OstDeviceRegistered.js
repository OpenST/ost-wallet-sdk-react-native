import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

import BaseSdkInteract from './BaseSdkInteract';

class OstDeviceRegistered extends BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        super(workflowuuid, interactuuid);
    }

    deviceRegistered(apiResponse, errorCallback) {
        apiResponse = apiResponse && JSON.stringify(apiResponse);
        OstRNSdkCallbackManager.deviceRegistered(this.interactuuid, apiResponse, errorCallback);
    }
}

export default OstDeviceRegistered;
