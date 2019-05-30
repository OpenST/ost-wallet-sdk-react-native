package com.ostwalletrnsdk;

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
import com.ost.walletsdk.workflows.interfaces.OstDeviceRegisteredInterface;
import com.ost.walletsdk.workflows.interfaces.OstPinAcceptInterface;
import com.ost.walletsdk.workflows.interfaces.OstVerifyDataInterface;
import com.ost.walletsdk.workflows.interfaces.OstWorkFlowCallback;
import com.ostwalletrnsdk.sdkIntracts.OstDeviceRegisteredWrap;
import com.ostwalletrnsdk.sdkIntracts.OstPinAcceptWrap;
import com.ostwalletrnsdk.sdkIntracts.OstVerifyDataWrap;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

import javax.annotation.Nullable;

public class OstWorkFlowCallbackImpl implements OstWorkFlowCallback {

    private static final String LOG_TAG = "OstWorkFlowCallbackImpl";
    static private HashMap<String, OstWorkFlowCallbackImpl> map = new HashMap<>();

    public static OstWorkFlowCallbackImpl getInstance(String uuid) {
        return map.get(uuid);
    }

    String uuid;


    OstWorkflowContext pseudoContext;
    ReactApplicationContext reactContext;

    OstWorkFlowCallbackImpl(String uuid, ReactApplicationContext reactContext, OstWorkflowContext workflowContext) {
        this.uuid = uuid;
        this.reactContext = reactContext;
        this.pseudoContext = workflowContext ;
        map.put(this.uuid, this);
    }


    @Override
    public void registerDevice(JSONObject apiParams, OstDeviceRegisteredInterface ostDeviceRegisteredInterface) {
        OstDeviceRegisteredWrap ostDeviceRegisteredWrap = new OstDeviceRegisteredWrap(ostDeviceRegisteredInterface, this.uuid);

        //Create params.
        JSONObject params = new JSONObject();
        try {
            params.put("apiParams", apiParams);
        } catch (Throwable e) {
            ostDeviceRegisteredWrap.cleanUp();
            errorEncountered("rn_owfcb_rd_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
            return;
        }
        invokeCallback("registerDevice", params, "OstDeviceRegisteredInterface", ostDeviceRegisteredWrap.getUUID());
    }

    @Override
    public void getPin(OstWorkflowContext ostWorkflowContext, String userId, OstPinAcceptInterface ostPinAcceptInterface) {
        OstPinAcceptWrap ostPinAcceptWrap = new OstPinAcceptWrap(ostPinAcceptInterface, this.uuid);
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("userId", userId);
        } catch (Throwable e) {
            ostPinAcceptWrap.cleanUp();
            errorEncountered("rn_owfcb_gp_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
            return;
        }
        invokeCallback("getPin", params, "OstPinAcceptInterface", ostPinAcceptWrap.getUUID());
    }

    @Override
    public void invalidPin(OstWorkflowContext ostWorkflowContext, String userId, OstPinAcceptInterface ostPinAcceptInterface) {
        OstPinAcceptWrap ostPinAcceptWrap = new OstPinAcceptWrap(ostPinAcceptInterface, this.uuid);
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("userId", userId);
        } catch (Throwable e) {
            ostPinAcceptWrap.cleanUp();
            errorEncountered("rn_owfcb_ip_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
            return;
        }
        invokeCallback("invalidPin", params, "OstPinAcceptInterface", ostPinAcceptWrap.getUUID());
    }

    @Override
    public void pinValidated(OstWorkflowContext ostWorkflowContext, String userId) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("userId", userId);
        } catch (Throwable e) {
            errorEncountered("rn_owfcb_pv_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
            return;
        }
        invokeCallback("pinValidated", params, null, null);
    }

    @Override
    public void flowComplete(OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostContextEntity", convert(ostContextEntity));
        } catch (Throwable e) {
            Log.e(LOG_TAG, "Unexpected error in flowComplete");
        }
        invokeCallback("flowComplete", params, null, null);
        cleanUp();
    }

    @Override
    public void flowInterrupt(OstWorkflowContext ostWorkflowContext, OstError ostError) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostError", ostError.toJSONObject() );
        } catch (Throwable e) {
            Log.w(LOG_TAG, "Unexpected error in flowInterrupt");
        }
        invokeCallback("flowInterrupt", params, null, null);
        cleanUp();
    }

    @Override
    public void requestAcknowledged(OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity) {
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostContextEntity", convert(ostContextEntity));
        } catch (Throwable e) {
            errorEncountered("rn_owfcb_ra_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
        }
        invokeCallback("requestAcknowledged", params, null, null);
    }

    @Override
    public void verifyData(OstWorkflowContext ostWorkflowContext, OstContextEntity ostContextEntity, OstVerifyDataInterface ostVerifyDataInterface) {
        OstVerifyDataWrap ostVerifyDataWrap = new OstVerifyDataWrap(ostVerifyDataInterface, this.uuid);
        JSONObject params = new JSONObject();
        try {
            params.put("ostWorkflowContext", convert(ostWorkflowContext));
            params.put("ostContextEntity", convert(ostContextEntity));
        } catch (Throwable e) {
            ostVerifyDataWrap.cleanUp();
            errorEncountered("rn_owfcb_vd_1", OstErrors.ErrorCode.INVALID_JSON_STRING);
            return;
        }
        invokeCallback("verifyData", params, "OstVerifyDataInterface", ostVerifyDataWrap.getUUID());
    }

    private void cleanUp() {
        map.remove(this.uuid);
    }

    public void errorEncountered(String internalErrorCode, OstErrors.ErrorCode errorCode) {
        OstError error = new OstError( internalErrorCode , errorCode );
        Log.e(LOG_TAG, String.format("Internal error code: %s Error code: %s", error.getInternalErrorCode(), errorCode.toString()));
        this.flowInterrupt(pseudoContext, error);
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

        sendEvent(this.reactContext, "onOstWalletSdkEvents", obj);
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

}
