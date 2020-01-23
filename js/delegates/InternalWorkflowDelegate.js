import OstWalletSdkHelper from "../helpers/OstWalletSdkHelper";
import OstWalletUIWorkflowCallback from '../OstWalletUIWorkflowCallback';

class InternalWorkflowDelegate extends OstWalletUIWorkflowCallback {
  constructor(userId, externalDelegate) {
    super();
    this.userId = userId;
    this.externalDelegate = externalDelegate;
    if ( !externalDelegate || !(externalDelegate instanceof OstWalletUIWorkflowCallback) ) {
      let err = new Error("Delegate must be an instanceof OstWalletUIWorkflowCallback");
      throw err;
    }
  }

  isUserIdValid() {
    if ( typeof externalDelegate.getCurrentUserOstId === 'function') {
       return this.userId === externalDelegate.getCurrentUserOstId();
    }
    return true;
  }

  getPassphrase(userId, ostWorkflowContext, passphrasePrefixAccept) {
    let externalDelegate = this.externalDelegate;
    return externalDelegate.getPassphrase(userId, ostWorkflowContext, passphrasePrefixAccept);
  }

  flowInterrupt(ostWorkflowContext , ostError)  {
    let externalDelegate = this.externalDelegate;
    // Check if device is unauthorized.
    if (OstWalletSdkHelper.isDeviceUnauthorizedError(ostError)) {
      this.onUnauthorized(ostWorkflowContext, ostError );
      if ( typeof externalDelegate.onUnauthorized === 'function') {
        return externalDelegate.onUnauthorized(ostWorkflowContext, ostError);
      }
      return externalDelegate.flowInterrupt(ostWorkflowContext, ostError);
    }

    //TODO: Check if device's clock is out of sync.
    else if (OstWalletSdkHelper.isDeviceTimeOutOfSync(ostError)) {
      this.deviceTimeOutOfSync(ostWorkflowContext, ostError );
      if ( typeof externalDelegate.deviceTimeOutOfSync === 'function') {
        return externalDelegate.deviceTimeOutOfSync(ostWorkflowContext, ostError);
      }
      return externalDelegate.flowInterrupt(ostWorkflowContext, ostError);
    }

    // Check if workflow has been cancelled by user.
    else if (OstWalletSdkHelper.isUserCancelled(ostError)) {
      this.userCancelled(ostWorkflowContext, ostError );
      if ( typeof externalDelegate.userCancelled === 'function') {
        return externalDelegate.userCancelled(ostWorkflowContext, ostError);
      }
      // Others should override this method and show the error.
      return externalDelegate.flowInterrupt(ostWorkflowContext, ostError);
    }

    // Trigger generic error handler.
    else  {
      this.workflowFailed(ostWorkflowContext, ostError);
      if ( typeof externalDelegate.workflowFailed === 'function') {
        return externalDelegate.workflowFailed(ostWorkflowContext, ostError);
      }
      // Others should override this method and show the error.
      return externalDelegate.flowInterrupt(ostWorkflowContext, ostError);
    }
  }

  onUnauthorized(ostWorkflowContext, ostError) {
    // Others should override this method and show the error.
    // 
  }

  deviceTimeOutOfSync(ostWorkflowContext, ostError) {
    // Others should override this method and show the error.
    // 
  }

  saltFetchFailed( response ) {
    // Others should override this method and show the error.
    // 
  }

  userCancelled(ostWorkflowContext, ostError) {
    // Others should override this method and show the error.
    // 
  }

  workflowFailed(ostWorkflowContext , ostError) {
    // Others should override this method and show the error.
    // 
  }

};

export default InternalWorkflowDelegate;
