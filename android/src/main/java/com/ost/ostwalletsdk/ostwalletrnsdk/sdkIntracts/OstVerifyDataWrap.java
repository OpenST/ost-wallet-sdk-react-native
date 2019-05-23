package com.ost.ostwalletsdk.ostwalletrnsdk.sdkIntracts;
import com.ost.walletsdk.workflows.interfaces.OstVerifyDataInterface;


public class OstVerifyDataWrap extends BaseSdkInteract {

    public  OstVerifyDataWrap(OstVerifyDataInterface ostVerifyDataInterface, String workflowCallbackId ){
        super(ostVerifyDataInterface,workflowCallbackId);
    }

    public static OstVerifyDataWrap getInstance(String uuid ){
        return (OstVerifyDataWrap) map.get( uuid );
    }

    void dataVerified( ) {
        ((OstVerifyDataInterface)getSdkCallbackForAction()).dataVerified( );
    }

    public boolean messageReceived(String methodName ) {
        if ( super.messageReceived(methodName, null) ) {
            return true;
        }

        this.dataVerified( );
        return true;
    }


}
