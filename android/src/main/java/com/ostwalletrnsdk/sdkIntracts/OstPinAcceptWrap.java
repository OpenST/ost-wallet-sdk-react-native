/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk.sdkIntracts;
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
