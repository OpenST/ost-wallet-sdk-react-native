import { NativeModules } from 'react-native';
const { OstRNSdkUICallbackManager } = NativeModules;

import BaseUISdkInteract from './BaseUISdkInteract';

class OstPassphrasePrefixAccept extends BaseUISdkInteract {
  constructor(workflowuuid, interactuuid) {
    super(workflowuuid, interactuuid);
  }

  setPassphrase(passphrasePrefixString, ostUserId, errorCallback) {

    OstRNSdkUICallbackManager.setPassphrase(this.interactuuid, ostUserId, passphrasePrefixString, function( error ){
      BaseSdkInteract.errorCallbackInvoker( error , errorCallback );
    });
  }
}

export default OstPassphrasePrefixAccept;
