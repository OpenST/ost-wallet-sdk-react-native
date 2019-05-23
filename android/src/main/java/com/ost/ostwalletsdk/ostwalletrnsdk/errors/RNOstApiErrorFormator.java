package com.ost.ostwalletsdk.ostwalletrnsdk.errors;
import com.ost.walletsdk.network.OstApiError;

import org.json.JSONException;
import org.json.JSONObject;

public class RNOstApiErrorFormator extends RNOstErrorFormator {


    private static final String API_INTERNAL_ID = "api_internal_id";
    private static final String API_ERROR_CODE = "api_error_code";
    private static final String API_ERROR_MSG = "api_error_msg";

    public RNOstApiErrorFormator(OstApiError ostApiError) {
        super( ostApiError );
    }

    @Override
    protected JSONObject toJSONObject() {
        JSONObject jsonObject =  super.toJSONObject();
        try {
            jsonObject.put(API_INTERNAL_ID ,  ((OstApiError)getOstError()).getApiInternalId());
            jsonObject.put(API_ERROR_CODE ,  ((OstApiError)getOstError()).getErrCode());
            jsonObject.put(API_ERROR_MSG ,  ((OstApiError)getOstError()).getErrMsg());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return  jsonObject ;
    }
}
