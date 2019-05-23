import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

import BaseSdkInteract from './BaseSdkInteract';

class OstPinAccept extends BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        super(workflowuuid, interactuuid);
    }

    pinEntered(userId, pin, passphrasePrefix, errorCallback) {
        OstRNSdkCallbackManager.pinEntered(this.interactuuid, userId, pin, passphrasePrefix, errorCallback);
    }
}

export default OstPinAccept;
