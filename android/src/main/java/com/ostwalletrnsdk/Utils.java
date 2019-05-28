package com.ostwalletrnsdk;

import com.ost.walletsdk.ecKeyInteracts.UserPassphrase;
import com.ost.walletsdk.network.OstApiError;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ostwalletrnsdk.errors.RNOstApiErrorFormator;
import com.ostwalletrnsdk.errors.RNOstErrorFormator;

public class Utils {

    public static String getError(Object error ){
        String jsonError = null ;
        if( error instanceof OstApiError){
            OstApiError ostApiError = ( OstApiError ) error ;
            jsonError = new RNOstApiErrorFormator( ostApiError ).toString();
        }else if( error instanceof OstError){
            OstError ostError = ( OstError ) error ;
            jsonError = new RNOstErrorFormator( ostError ).toString();
        }else if( error instanceof Throwable ){
            jsonError =  ((Throwable)error).getMessage() ;
        }

        return  jsonError ;
    }

    public static void cleanPassPhrase( UserPassphrase passphrase ){
        if( null != passphrase ){
            passphrase.wipe();
        }
    }
}
