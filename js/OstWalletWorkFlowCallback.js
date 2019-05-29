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
     * @param {Object} apiParams - Register Device API parameters
     * @param {OstDeviceRegistered} ostDeviceRegistered - With callback to pass response
     * @override
     */
    registerDevice( apiParams , ostDeviceRegistered ) { }
       
     /**
     * Verify Data
     * @param {Object} ostWorkflowContext - info about workflow type with data ostWorkflowContext, ostContextEntity
     * @param {Object} ostContextEntity - info about entity
     * @param {OstVerifyData} ostVerifyData - to acknowledge workflow to proceed
     * @override
     */
    verifyData( ostWorkflowContext , ostContextEntity ,  ostVerifyData ) {   }

     /**
     * Get pin
     * @param {Object} ostWorkflowContext - holds work flow type
     * @param {String} userId - Id of user whose password and pin are needed
     * @param {OstVerifyData} ostPinAcceptInterface - To pass pin
     * @override
     */
    getPin(ostWorkflowContext, userId , ostPinAcceptInterface) {  }

     /**
     * Invalid Pin
     * @param {Object} ostWorkflowContext - holds work flow type
     * @param {String} userId - Id of user whose password and pin are needed.
     * @param {OstVerifyData} ostPinAcceptInterface - to pass another pin
     * @override
     */
    invalidPin(ostWorkflowContext, userId ,  ostPinAcceptInterface)  {  }

     /**
     * Pin validated
     * @param {Object} ostWorkflowContext - holds work flow type
     * @param {String} userId - Id of user whose password and pin are needed.
     * @override
     */
    pinValidated(ostWorkflowContext , userId) {  }

     /**
     * Request acknowledged
     * @param {Object} ostWorkflowContext - info about workflow type
     * @param ostContextEntity - info about entity
     * @override
     */
    requestAcknowledged(ostWorkflowContext , ostContextEntity ) {  }

     /**
     * Flow complete
     * @param ostWorkflowContext - workflow type
     * @param ostContextEntity -  status of the flow
     * @override
     */
    flowComplete(ostWorkflowContext , ostContextEntity ) {   }

    /**
     * Flow interrupt
     * @param ostWorkflowContext workflow type
     * @param ostError reason of interruption
     * @override
     */
    flowInterrupt(ostWorkflowContext , ostError)  {   }
}

export default OstWalletWorkFlowCallback;
