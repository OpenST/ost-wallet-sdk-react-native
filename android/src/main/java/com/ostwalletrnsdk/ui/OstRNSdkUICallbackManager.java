/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk.ui;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ostwalletrnsdk.Utils;
import com.ostwalletrnsdk.sdkIntracts.BaseSdkInteract;
import com.ostwalletrnsdk.sdkIntracts.OstPassphraseAcceptWrap;

import org.json.JSONObject;

public class OstRNSdkUICallbackManager extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public OstRNSdkUICallbackManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "OstRNSdkUICallbackManager";
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
    public void setPassphrase( String uuid , String userId ,String userPassphrase, Callback errorCallback ){
        try {
            OstPassphraseAcceptWrap baseSdkInteract = (OstPassphraseAcceptWrap) BaseSdkInteract.map.get(uuid);
            baseSdkInteract.messageReceived("setPassphrase", userPassphrase );
        }catch ( Throwable e){
            errorCallback.invoke( Utils.getError( e ,  "rn_si_ornscm_sp_1") );
        }
    }
}