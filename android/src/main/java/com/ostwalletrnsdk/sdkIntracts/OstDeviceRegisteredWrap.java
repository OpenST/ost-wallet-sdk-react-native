/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk.sdkIntracts;
import com.ost.walletsdk.workflows.errors.OstErrors;
import com.ost.walletsdk.workflows.interfaces.OstDeviceRegisteredInterface;

import org.json.JSONException;
import org.json.JSONObject;

public class OstDeviceRegisteredWrap extends BaseSdkInteract {

    public OstDeviceRegisteredWrap(OstDeviceRegisteredInterface ostDeviceRegisteredInterface, String workflowCallbackId){
        super(ostDeviceRegisteredInterface,workflowCallbackId);
    }

    public static OstDeviceRegisteredWrap getInstance(String uuid ){
        return (OstDeviceRegisteredWrap) map.get( uuid );
    }

    void deviceRegistered(JSONObject jsonMethodParams) {
        ((OstDeviceRegisteredInterface)getSdkCallbackForAction()).deviceRegistered( jsonMethodParams );
    }

    @Override
    public boolean messageReceived(String methodName, String jsonParams) {
        if ( super.messageReceived(methodName, jsonParams) ) {
            return true;
        }

        JSONObject jsonMethodParams;
        try {
            jsonMethodParams = new JSONObject( jsonParams );
        } catch (Throwable e) {
            errorEncountered("rn_si_odrw_mr_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
            return false;
        }

        this.deviceRegistered(jsonMethodParams);
        return true;
    }
}
