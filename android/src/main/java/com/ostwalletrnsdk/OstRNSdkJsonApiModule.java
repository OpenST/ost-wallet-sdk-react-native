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
import com.facebook.react.bridge.ReadableMap;
import com.ost.walletsdk.network.OstJsonApi;
import com.ost.walletsdk.network.OstJsonApiCallback;
import com.ost.walletsdk.workflows.errors.OstError;

import org.json.JSONException;
import org.json.JSONObject;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

public class OstRNSdkJsonApiModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;

    public OstRNSdkJsonApiModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "OstJsonApi";
    }

    @ReactMethod
    public void getBalanceForUserId(
            String userId,
            Callback successCallback,
            Callback errorCallback
    ) {
        try {
            OstJsonApi.getBalance(userId, new OstJsonApiCallbackImpl(successCallback, errorCallback));
        } catch (Throwable e) {
            errorCallback.invoke(Utils.getError(e, "rn_orsjam_gbfui_1"));
            return;
        }
    }

    @ReactMethod
    public void getBalanceWithPricePointForUserId(
            String userId,
            Callback successCallback,
            Callback errorCallback
    ) {
        try {
            OstJsonApi.getBalanceWithPricePoints(userId, new OstJsonApiCallbackImpl(successCallback, errorCallback));
        } catch (Throwable e) {
            errorCallback.invoke(Utils.getError(e, "rn_orsjam_gbwppui_1"));
            return;
        }
    }

    @ReactMethod
    public void getPricePointForUserId(
            String userId,
            Callback successCallback,
            Callback errorCallback
    ) {
        try {
            OstJsonApi.getPricePoints(userId, new OstJsonApiCallbackImpl(successCallback, errorCallback));
        } catch (Throwable e) {
            errorCallback.invoke(Utils.getError(e, "rn_orsjam_gppui_1"));
            return;
        }
    }

    @ReactMethod
    public void getTransactionsForUserId(
            String userId,
            ReadableMap requestMap,
            Callback successCallback,
            Callback errorCallback
    ) {
        try {
            OstJsonApi.getTransactions(userId, requestMap.toHashMap(), new OstJsonApiCallbackImpl(successCallback, errorCallback));
        } catch (Throwable e) {
            errorCallback.invoke(Utils.getError(e, "rn_orsjam_gppui_1"));
            return;
        }
    }


    private static class OstJsonApiCallbackImpl implements OstJsonApiCallback {

        private final Callback successCallback;
        private final Callback errorCallback;

        OstJsonApiCallbackImpl(Callback success, Callback error) {
            this.successCallback = success;
            this.errorCallback = error;
        }

        @Override
        public void onOstJsonApiSuccess(@Nullable JSONObject data) {
            try {
                if (null == data) data = new JSONObject();

                successCallback.invoke(Utils.convertJsonToMap(data));
            } catch (JSONException e) {
                errorCallback.invoke(Utils.getError(e, "rn_ojaci_ojas_1"));
            }
        }

        @Override
        public void onOstJsonApiError(@Nonnull OstError err, @Nullable JSONObject data) {
            try {
                if (null == data) data = new JSONObject();

                errorCallback.invoke(Utils.convertJsonToMap(err.toJSONObject()), Utils.convertJsonToMap(data));
            } catch (JSONException e) {
                errorCallback.invoke(Utils.getError(e, "rn_ojaci_ojas_2"));
            }
        }
    }
}