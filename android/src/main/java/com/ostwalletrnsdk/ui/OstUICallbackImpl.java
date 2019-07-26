package com.ostwalletrnsdk.ui;


import android.text.TextUtils;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.ost.walletsdk.OstSdk;
import com.ost.walletsdk.models.entities.OstBaseEntity;
import com.ost.walletsdk.workflows.OstContextEntity;
import com.ost.walletsdk.workflows.OstWorkflowContext;
import com.ost.walletsdk.workflows.errors.OstError;
import com.ost.walletsdk.workflows.errors.OstErrors;
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
    OstWorkflowContext pseudoContext;

    OstUICallbackImpl(String uuid, ReactApplicationContext reactContext, OstWorkflowContext ostWorkflowContext) {
        this.uuid = uuid;
        this.reactContext = reactContext;
        this.pseudoContext = ostWorkflowContext;
        map.put(this.uuid, this);
    }

    @Override
    public void getPassphrase(String userId, OstWorkflowContext ostWorkflowContext, OstPassphraseAcceptor ostPassphraseAcceptor) {
        OstPassphraseAcceptWrap ostPinAcceptWrap = new OstPassphraseAcceptWrap(ostPassphraseAcceptor, this.uuid);
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("userId", userId);
            params.put("ostWorkflowId", this.uuid);
        } catch (Throwable e) {
            errorEncountered("rn_owfcb_pv_1", null, OstErrors.ErrorCode.INVALID_JSON_STRING);
            ostPinAcceptWrap.cancelFlow();
            return;
        }
        invokeCallback("getPassphrase", params, "OstPassphraseAcceptor", ostPinAcceptWrap.getUUID());
    }


    @Override
    public void flowComplete(String workflowId, OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostContextEntity", convert(ostContextEntity));
            params.put("ostWorkflowId", this.uuid);
        } catch (Throwable e) {
            Log.e(LOG_TAG, "Unexpected error in flowComplete");
        }
        invokeCallback("flowComplete", params, null, null);
        cleanUp();
    }

    @Override
    public void flowInterrupt(String workflowId, OstWorkflowContext ostWorkflowContext, OstError ostError) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostError", ostError.toJSONObject() );
            params.put("ostWorkflowId", this.uuid);
        } catch (Throwable e) {
            Log.w(LOG_TAG, "Unexpected error in flowInterrupt");
        }
        invokeCallback("flowInterrupt", params, null, null);
        cleanUp();
    }

    @Override
    public void requestAcknowledged(String workflowId, OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostContextEntity", convert(ostContextEntity));
            params.put("ostWorkflowId", this.uuid);
        } catch (Throwable e) {
            errorEncountered("rn_ouici_ra_1", workflowId ,OstErrors.ErrorCode.INVALID_JSON_STRING);
        }
        invokeCallback("requestAcknowledged", params, null, null);
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

    public void errorEncountered(String internalErrorCode, String workflowId ,OstErrors.ErrorCode errorCode) {
        OstError error = new OstError( internalErrorCode , errorCode );
        Log.e(LOG_TAG, String.format("Internal error code: %s Error code: %s", error.getInternalErrorCode(), errorCode.toString()));
        this.flowInterrupt(workflowId, pseudoContext, error);
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

    private JSONObject convert(OstContextEntity contextEntity) {
        JSONObject obj = new JSONObject();

        if (null == contextEntity) {
            Log.e(LOG_TAG, "Unexpected OstContextEntity null");
            return obj;
        }

        Object objEntity = contextEntity.getEntity();
        String entityType = contextEntity.getEntityType();
        String message = contextEntity.getMessage();

        Object entity = objEntity;
        if (OstSdk.MNEMONICS.equalsIgnoreCase(entityType)){
            entity = new String((byte[])objEntity);
        } else if (objEntity instanceof OstBaseEntity) {
            entity = ((OstBaseEntity) objEntity).getData();
        }

        try {
            obj.put("entityType", entityType);
            obj.put("message", message);
            obj.put("entity", entity);
        } catch (Throwable e) {
            Log.e(LOG_TAG, "Unexpected OstContextEntity");
        }


        return obj;
    }

    private void cleanUp() {
        map.remove(this.uuid);
    }
}