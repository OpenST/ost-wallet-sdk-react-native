import { NativeModules } from 'react-native';
import { instantiateOstError } from "../callbackHandlers/OstWalletSdkCallbackManager"
const { OstRNSdkCallbackManager } = NativeModules;

class BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        this.workflowuuid = workflowuuid;
        this.interactuuid = interactuuid;
    }

    cancelFlow( erroCallback ) {
        OstRNSdkCallbackManager.cancelFlow( this.interactuuid , erroCallback );
    }

    static errorCallbackInvoker( error , callback ){
        if (typeof error == 'string') {
            try{
                error = JSON.parse(error); 
            }catch(e){
                console.warn("Unexpected JSON string", params );
            }
        }
    
        if( typeof callback == "function" ){
            let ostError = instantiateOstError( error );
            callback( error );
        }
    }
}

export default BaseSdkInteract;
