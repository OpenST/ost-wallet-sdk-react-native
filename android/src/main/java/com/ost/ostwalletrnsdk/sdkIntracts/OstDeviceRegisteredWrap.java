package com.ostwalletrnsdk.sdkIntracts;
import com.ost.walletsdk.workflows.interfaces.OstDeviceRegisteredInterface;
import com.ostwalletrnsdk.errors.OstRNErrors;

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
        } catch (JSONException e) {
            errorEncountered("rn_si_odrw_mr_1", OstRNErrors.ErrorCode.INVALID_JSON_STRING);
            return false;
        }

        this.deviceRegistered(jsonMethodParams);
        return true;
    }
}
