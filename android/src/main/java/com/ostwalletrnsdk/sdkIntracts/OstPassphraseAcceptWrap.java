package com.ostwalletrnsdk.sdkIntracts;

import com.ost.walletsdk.workflows.interfaces.OstBaseInterface;

import ost.com.ostsdkui.OstPassphraseAcceptor;

public class OstPassphraseAcceptWrap extends BaseSdkInteract {

    public OstPassphraseAcceptWrap(OstBaseInterface sdkCallback, String workflowCallbackId) {
        super(sdkCallback, workflowCallbackId);
    }

    public static OstPassphraseAcceptor getInstance(String uuid ){
        return (OstPassphraseAcceptor) map.get( uuid );
    }

    void setPassphrase( String passphrase ){
        ((OstPassphraseAcceptor)getSdkCallbackForAction()).setPassphrase( passphrase );
    }

    public boolean messageReceived(String methodName, String passphrase ) {
        if ( super.messageReceived(methodName, null) ) {
            return true;
        }
        this.setPassphrase(passphrase);
        return true;
    }
}
