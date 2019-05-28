import uuidv4 from 'uuid/v4';
import { setInstance } from './callbackHandlers/OstWalletSdkCallbackManager';

class OstWalletWorkFlowCallback {
    constructor() {
        this.uuid = uuidv4();
        setInstance(this);
    }

    registerDevice( response , ostDeviceRegistered) {  /*overwrite*/ }
       
    verifyData( response, ostVerifyData ) {  /*overwrite*/ }

    getPin(response, ostPinAcceptInterface) {  /*overwrite*/ }

    invalidPin(response, ostPinAcceptInterface)  {  /*overwrite*/ }

    pinValidated(response) {  /*overwrite*/ }

    requestAcknowledged(response) {  /*overwrite*/ }

    flowComplete(response) {  /*overwrite*/ }

    flowInterrupt(response)  {  /*overwrite*/ }
}

export default OstWalletWorkFlowCallback;
