import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

class BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        this.workflowuuid = workflowuuid;
        this.interactuuid = interactuuid;
    }

    cancelFlow( erroCallback ) {
        OstRNSdkCallbackManager.cancelFlow( this.interactuuid , erroCallback );
    }
}

export default BaseSdkInteract;
