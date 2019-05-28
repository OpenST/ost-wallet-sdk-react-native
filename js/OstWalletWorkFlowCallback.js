import uuidv4 from 'uuid/v4';
import { setInstance } from './callbackHandlers/OstWalletSdkCallbackManager';

 /**
 * OstWalletWorkFlowCallback 
 * All callback workflow implementations class should be derived from OstWalletWorkFlowCallback
 */

class OstWalletWorkFlowCallback {
    
    /**
     * @constructor: Should be called from derived class constructor always.  
     * super();
     */
    constructor() {
        this.uuid = uuidv4();
        setInstance(this);
    }

     /**
     * Register Device  
     * @param {Object} response - with day apiParams 
     * @param {OstDeviceRegistered} ostDeviceRegistered - With callback to pass response, deviceRegistered 
     * @override
     */
    registerDevice( response , ostDeviceRegistered) { }
       
     /**
     * Verify Data
     * @param {Object} response - with data ostWorkflowContext, ostContextEntity
     * @param {OstVerifyData} ostVerifyData - With callback dataVerified , cancelFlow
     * @override
     */
    verifyData( response, ostVerifyData ) {   }

     /**
     * Get pin
     * @param {Object} response - with data ostWorkflowContext, userId
     * @param {OstVerifyData} ostPinAcceptInterface - With callback pinEntered , cancelFlow
     * @override
     */
    getPin(response, ostPinAcceptInterface) {  }

     /**
     * Invalid Pin
     * @param {Object} response - with data ostWorkflowContext, userId
     * @param {OstVerifyData} ostPinAcceptInterface - With callback pinEntered , cancelFlow
     * @override
     */
    invalidPin(response, ostPinAcceptInterface)  {  }

     /**
     * Pin validated
     * @param {Object} response - with data ostWorkflowContext, userId
     * @override
     */
    pinValidated(response) {  }

     /**
     * Request acknowledged
     * @param {Object} response - with data ostWorkflowContext, ostContextEntity
     * @override
     */
    requestAcknowledged(response) {  }

     /**
     * Flow complete
     * @param {Object} response - with data ostWorkflowContext, ostContextEntity
     * @override
     */
    flowComplete(response) {   }

    /**
     * Flow interrupt
     * @param {Object} response - with data ostWorkflowContext, ostError
     * @override
     */
    flowInterrupt(response)  {   }
}

export default OstWalletWorkFlowCallback;
