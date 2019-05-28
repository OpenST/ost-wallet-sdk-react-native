package com.ostwalletrnsdk;

import com.ost.walletsdk.ecKeyInteracts.UserPassphrase;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ost.walletsdk.workflows.errors.OstErrors;

import org.json.JSONException;
import org.json.JSONObject;

public class Utils {


    /*
    * getError should only used for errorCallbacks directly invoked.
    * Don't user for workflow callback.
    */

    public static String getError(Object error, String internalErrorCode ){
        String jsonError = null ;
        if( error instanceof OstError){
            return  ((OstError) error).toJSONObject().toString();
        }
        JSONObject err = new JSONObject();

        try {
            err.putOpt(OstError.OstJSONErrorKeys.ERROR_MESSAGE, ((Throwable)error).getMessage());
        } catch (JSONException e) {
            //Ignore.
        }

        try {
            err.putOpt(OstError.OstJSONErrorKeys.INTERNAL_ERROR_CODE, internalErrorCode);
        } catch (JSONException e) {
            //Ignore.
        }

        try {
            err.putOpt(OstError.OstJSONErrorKeys.ERROR_CODE, OstErrors.ErrorCode.UNCAUGHT_EXCEPTION_HANDELED);
        } catch (JSONException e) {
            //Ignore.
        }

        try {
            err.putOpt(OstError.OstJSONErrorKeys.IS_API_ERROR, 0);
        } catch (JSONException e) {
            //Ignore.
        }

        return err.toString();
    }


    public static void cleanPassPhrase( UserPassphrase passphrase ){
        if( null != passphrase ){
            passphrase.wipe();
        }
    }
}
