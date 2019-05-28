import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

import BaseSdkInteract from './BaseSdkInteract';

class OstVerifyData extends BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        super(workflowuuid, interactuuid);
    }

    dataVerified( errorCallback ) {
        OstRNSdkCallbackManager.dataVerified(this.interactuuid, function( error ) {
            BaseSdkInteract.errorCallbackInvoker( error , errorCallback );
        } );
    }
}

export default OstVerifyData;