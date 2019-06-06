/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk.sdkIntracts;
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
