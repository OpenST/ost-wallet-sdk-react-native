/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

let instantiateOstError;
import('../callbackHandlers/OstWalletSdkCallbackManager').then((imports) => {
    instantiateOstError = imports.instantiateOstError;
});


class BaseSdkInteract {
    constructor(workflowuuid, interactuuid) {
        this.workflowuuid = workflowuuid;
        this.interactuuid = interactuuid;
    }

    cancelFlow(  ) {
        OstRNSdkCallbackManager.cancelFlow( this.interactuuid );
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
