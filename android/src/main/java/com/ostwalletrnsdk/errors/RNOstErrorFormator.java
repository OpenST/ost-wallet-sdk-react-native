package com.ostwalletrnsdk.errors;

import android.support.annotation.NonNull;

import com.ost.walletsdk.workflows.errors.OstError;

import org.json.JSONException;
import org.json.JSONObject;

public class RNOstErrorFormator {
    private static final String INTERNAL_ERROR_CODE = "internal_error_code";
    private static final String ERROR_CODE = "error_code";
    private static final String ERROR_MESSAGE = "error_msg";
    private final OstError mOstError;

    public RNOstErrorFormator(OstError ostError) {
        mOstError = ostError;
    }



    @NonNull
    @Override
    public String toString() {
        JSONObject jsonObject = toJSONObject();
        return jsonObject.toString();
    }

    public OstError getOstError() {
        return mOstError;
    }

    protected JSONObject toJSONObject() {
        JSONObject jsonObject = new JSONObject();
        try {
            jsonObject.put(INTERNAL_ERROR_CODE, getOstError().getInternalErrorCode());
            jsonObject.put(ERROR_CODE, getOstError().getErrorCode().toString());
            jsonObject.put(ERROR_MESSAGE, getOstError().getMessage());
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }
}
