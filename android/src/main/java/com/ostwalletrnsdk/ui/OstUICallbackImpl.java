package com.ostwalletrnsdk.ui;


import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ost.walletsdk.workflows.OstContextEntity;
import com.ost.walletsdk.workflows.OstWorkflowContext;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ostwalletrnsdk.sdkIntracts.OstPassphraseAcceptWrap;

import org.json.JSONObject;

import java.util.HashMap;

import javax.annotation.Nullable;

import ost.com.ostsdkui.OstPassphraseAcceptor;
import ost.com.ostsdkui.OstUserPassphraseCallback;
import ost.com.ostsdkui.sdkInteract.SdkInteract;

public class OstUICallbackImpl implements OstUserPassphraseCallback,
        SdkInteract.RequestAcknowledged,
        SdkInteract.FlowInterrupt,
        SdkInteract.FlowComplete {

    private static final String LOG_TAG = "OstUserPassphraseCBImpl";
    static private HashMap<String, OstUserPassphraseCallback> map = new HashMap<>();

    public static OstUserPassphraseCallback getInstance(String uuid) {
        return map.get(uuid);
    }

    String uuid;

    ReactApplicationContext reactContext;

    OstUICallbackImpl(String uuid, ReactApplicationContext reactContext) {
        this.uuid = uuid;
        this.reactContext = reactContext;
        map.put(this.uuid, this);
    }

    @Override
    public void getPassphrase(String userId, OstWorkflowContext ostWorkflowContext, OstPassphraseAcceptor ostPassphraseAcceptor) {
        OstPassphraseAcceptWrap ostPinAcceptWrap = new OstPassphraseAcceptWrap(ostPassphraseAcceptor, this.uuid);
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("userId", userId);
        } catch (Throwable e) {
            ostPinAcceptWrap.cancelFlow();
            return;
        }
        invokeCallback("getPassphrase", params, "OstPassphraseAcceptor", ostPinAcceptWrap.getUUID());
    }

    private JSONObject convert(OstWorkflowContext context) {
        JSONObject obj = new JSONObject();

        try {
            if (null != context) {
                obj.put("WORKFLOW_TYPE", context.getWorkflow_type().name());
            }
        } catch (Throwable e) {
            Log.w(LOG_TAG, "Unexpected OstWorkflowContext");
        }
        return obj;
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable JSONObject params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params.toString());
    }

    private void invokeCallback(String methodName, JSONObject params, String interactName, String interactId) {
        JSONObject obj = new JSONObject();

        try {
            obj.put("uuid", this.uuid);
            obj.put("functionName", methodName);

            if (null != params) {
                obj.put("params", params);
            }

            if (!TextUtils.isEmpty(interactName)) {
                obj.put("interactName", interactName);
            }

            if (!TextUtils.isEmpty(interactId)) {
                obj.put("interactuuid", interactId);
            }

        } catch (Throwable error) {
            Log.e(LOG_TAG, "Unexpected error in  invokeCallback");
        }

        sendEvent(this.reactContext, "onOstWalletSdkUIEvents", obj);
    }

    @Override
    public void flowComplete(String workflowId, OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity) {

    }

    @Override
    public void flowInterrupt(String workflowId, OstWorkflowContext ostWorkflowContext, OstError ostError) {

    }

    @Override
    public void requestAcknowledged(String workflowId, OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity) {

    }
}