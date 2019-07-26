import { NativeModules } from 'react-native';
const { OstRNSdkUICallbackManager } = NativeModules;

import BaseUISdkInteract from './BaseUISdkInteract';

class OstPassphrasePrefixAccept extends BaseUISdkInteract {
  constructor(workflowuuid, interactuuid) {
    super(workflowuuid, interactuuid);
  }

  setPassphrase(passphrasePrefixString, ostUserId, errorCallback) {

    OstRNSdkUICallbackManager.setPassphrase(passphrasePrefixString, ostUserId, this.interactuuid, function( error ){
      BaseSdkInteract.errorCallbackInvoker( error , errorCallback );
    });
  }
}

export default OstPassphrasePrefixAccept;
