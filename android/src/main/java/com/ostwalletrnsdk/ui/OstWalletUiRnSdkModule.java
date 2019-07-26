/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

package com.ostwalletrnsdk.ui;

import android.app.Activity;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.ostwalletrnsdk.Utils;

import org.json.JSONObject;

import ost.com.ostsdkui.OstWalletUI;
import ost.com.ostsdkui.sdkInteract.SdkInteract;

public class OstWalletUiRnSdkModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public OstWalletUiRnSdkModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "OstWalletSdkUI";
    }

    @ReactMethod
    public void initialize(
            String BASE_URL,
            Callback callback
    ) {
        try{
            OstWalletUI.initialize(getReactApplicationContext(), BASE_URL);
        } catch(Throwable e){
            callback.invoke( Utils.getError( e , "rn_owunsm_i_1")  );
            return;
        }
        callback.invoke();
    }


    @ReactMethod
    public void activateUser(String userId, String expiresAfterInSecs, String spendingLimit, String uuid ){

        Activity currentActivity = getCurrentActivity();
        OstUICallbackImpl ostUICallback = new OstUICallbackImpl( uuid, this.reactContext);
        String workflowId = OstWalletUI.activateUser(currentActivity,
                userId,
                Long.parseLong(expiresAfterInSecs),
                spendingLimit,
                ostUICallback);
        SdkInteract.getInstance().subscribe(workflowId, ostUICallback);
    }

    @ReactMethod
    public void initiateDeviceRecovery(String userId, String deviceAddress, String uuid ){

        Activity currentActivity = getCurrentActivity();
        OstUICallbackImpl userPassphraseCallback = new OstUICallbackImpl( uuid, this.reactContext);
        String workflowId = OstWalletUI.initiateDeviceRecovery(currentActivity,
                userId,
                deviceAddress,
                userPassphraseCallback);
    }

    @ReactMethod
    public void abortDeviceRecovery(String userId, String uuid ){

        Activity currentActivity = getCurrentActivity();
        OstUICallbackImpl userPassphraseCallback = new OstUICallbackImpl( uuid, this.reactContext);
        String workflowId = OstWalletUI.abortDeviceRecovery(currentActivity,
                userId,
                userPassphraseCallback);
    }

    @ReactMethod
    public void setThemeConfig(JSONObject themeConfig){

        OstWalletUI.setThemeConfig(getReactApplicationContext(), themeConfig);
    }

    @ReactMethod
    public void setContentConfig(JSONObject contentConfig){

        OstWalletUI.setContentConfig(getReactApplicationContext(), contentConfig);
    }
}
