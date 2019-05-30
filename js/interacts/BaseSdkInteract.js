import { NativeModules } from 'react-native';
import { instantiateOstError } from "../callbackHandlers/OstWalletSdkCallbackManager"
const { OstRNSdkCallbackManager } = NativeModules;

class BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        this.workflowuuid = workflowuuid;
        this.interactuuid = interactuuid;
    }

    cancelFlow( errorCallback ) {
        OstRNSdkCallbackManager.cancelFlow( this.interactuuid , errorCallback );
    }

    static errorCallbackInvoker( error , callback ){
        if (typeof error == 'string') {
            try{
                error = JSON.parse(error); 
            }catch(e){
                console.warn("Unexpected JSON string", error );
            }
        }
    
        if( typeof callback == "function" ){
            let ostError = instantiateOstError( error );
            callback( error );
        }
    }
}

export default BaseSdkInteract;
