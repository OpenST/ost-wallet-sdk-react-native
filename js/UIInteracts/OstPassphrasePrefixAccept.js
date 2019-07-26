import { NativeModules } from 'react-native';
const { OstRNSdkUICallbackManager } = NativeModules;

import BaseUISdkInteract from '../interacts/BaseSdkInteract';

class OstPassphrasePrefixAccept extends BaseUISdkInteract {
  constructor(workflowuuid, interactuuid) {
    super(workflowuuid, interactuuid);
  }

  setPassphrasePrefix(passphrasePrefixString, ostUserId, errorCallback) {
    try {
      apiResponse = apiResponse && JSON.stringify(apiResponse) ;
    }catch (e){
      console.warn("Unexpected JSON Object apiResponse in deviceRegistered", apiResponse );
    }

    OstRNSdkUICallbackManager.setPassphrasePrefix(passphrasePrefixString, ostUserId, this.interactuuid, function( error ){
      BaseSdkInteract.errorCallbackInvoker( error , errorCallback );
    });
  }
}

export default OstDeviceRegistered;
