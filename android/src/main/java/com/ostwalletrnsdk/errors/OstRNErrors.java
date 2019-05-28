package com.ostwalletrnsdk.errors;

import com.ost.walletsdk.workflows.errors.OstErrors;

public class OstRNErrors {
    public enum ErrorCode implements OstErrors.OstErrorCode {
        INVALID_JSON_STRING,
        INVALID_JSON_ARRAY,
        UNKNOWN;
    }

    public static String getMessage(ErrorCode code) {
        switch ( code ) {
            case INVALID_JSON_STRING: return "The provided json string is invalid.";
            case INVALID_JSON_ARRAY: return "The provided json array string is invalid.";


            //Note for PMS: Only change the message.
            case UNKNOWN:
            default:
                return "Unknown error occurred";
        }
    }
}
