package com.ost.ostwalletsdk.ostwalletrnsdk.sdkIntracts;
import com.ost.walletsdk.ecKeyInteracts.UserPassphrase;
import com.ost.walletsdk.workflows.interfaces.OstPinAcceptInterface;

public class OstPinAcceptWrap  extends  BaseSdkInteract{

    public OstPinAcceptWrap(OstPinAcceptInterface ostPinAcceptInterface, String workflowCallbackId){
        super(ostPinAcceptInterface,workflowCallbackId);
    }

    public static OstPinAcceptWrap getInstance(String uuid ){
        return (OstPinAcceptWrap) map.get( uuid );
    }

    void pinEntered( UserPassphrase passphrase ){
        ((OstPinAcceptInterface)getSdkCallbackForAction()).pinEntered( passphrase );
    }


    public boolean messageReceived(String methodName, UserPassphrase passphrase ) {
        if ( super.messageReceived(methodName, null) ) {
            return true;
        }

        this.pinEntered(passphrase);
        return true;
    }


}
