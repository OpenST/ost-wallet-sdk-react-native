/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ost.walletsdk.ecKeyInteracts.UserPassphrase;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ostwalletrnsdk.sdkIntracts.BaseSdkInteract;
import com.ostwalletrnsdk.sdkIntracts.OstPinAcceptWrap;
import com.ostwalletrnsdk.sdkIntracts.OstVerifyDataWrap;

import org.json.JSONObject;

public class OstRNSdkCallbackManager extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public OstRNSdkCallbackManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "OstRNSdkCallbackManager";
    }

    @ReactMethod
    public void cancelFlow(
            String uuid
    ) {
        BaseSdkInteract baseSdkInteract = BaseSdkInteract.map.get(uuid);
        if (null != baseSdkInteract) {
            baseSdkInteract.messageReceived("cancelFlow"  , new JSONObject().toString());
        }

    }

    @ReactMethod
    public void deviceRegistered(
            String uuid,
            String jsonString,
            Callback errorCallback
    ) {
        try {
            BaseSdkInteract baseSdkInteract = BaseSdkInteract.map.get(uuid);
            baseSdkInteract.messageReceived("deviceRegistered", jsonString );
        } catch (Throwable e) {
            errorCallback.invoke( Utils.getError( e ,  "rn_si_ornscm_dr_1") );
        }
    }

    @ReactMethod
    public void pinEntered(
          String uuid, String userId, String pin, String passphrasePrefix, Callback errorCallback
    ) {
        UserPassphrase userPassPhrase = null;
        try{
            userPassPhrase = new UserPassphrase(userId, pin, passphrasePrefix) ;
        } catch(Throwable e){
            errorCallback.invoke( Utils.getError( e ,  "rn_si_ornscm_pe_1") );
            return;
        }

        try {
            OstPinAcceptWrap baseSdkInteract = (OstPinAcceptWrap) BaseSdkInteract.map.get(uuid);
            baseSdkInteract.messageReceived("pinEntered", userPassPhrase );
        } catch (Throwable e) {
            Utils.cleanPassPhrase( userPassPhrase );
            errorCallback.invoke( Utils.getError( e ,  "rn_si_ornscm_pe_2") );
        }
    }

    @ReactMethod
    public void dataVerified( String uuid , Callback errorCallback ){
        try {
            OstVerifyDataWrap baseSdkInteract = (OstVerifyDataWrap) BaseSdkInteract.map.get(uuid);
            baseSdkInteract.messageReceived("dataVerified" );
        }catch ( Throwable e){
            errorCallback.invoke( Utils.getError( e ,  "rn_si_ornscm_dv_1") );
        }
    }

    @ReactMethod
    public void setPassphrase( String uuid , String userPassphrase, Callback errorCallback ){
        try {
            OstVerifyDataWrap baseSdkInteract = (OstVerifyDataWrap) BaseSdkInteract.map.get(uuid);
            baseSdkInteract.messageReceived("setPassphrase", userPassphrase );
        }catch ( Throwable e){
            errorCallback.invoke( Utils.getError( e ,  "rn_si_ornscm_sp_1") );
        }
    }
}
