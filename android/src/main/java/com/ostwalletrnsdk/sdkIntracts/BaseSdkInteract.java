package com.ostwalletrnsdk.sdkIntracts;

import com.ost.walletsdk.workflows.errors.OstErrors;
import com.ost.walletsdk.workflows.interfaces.*;
import com.ostwalletrnsdk.OstWorkFlowCallbackImpl;

import java.util.HashMap;
import java.util.UUID;

public class BaseSdkInteract {

    public static HashMap<String, BaseSdkInteract> map = new HashMap<>();

    OstBaseInterface sdkCallback;

    public String getUUID() {
        return uuid;
    }

    private String uuid;

    public String getWorkflowCallbackId() {
        return workflowCallbackId;
    }

    private String workflowCallbackId;

    BaseSdkInteract(OstBaseInterface sdkCallback, String workflowCallbackId) {
        this.uuid = UUID.randomUUID().toString();
        this.workflowCallbackId = workflowCallbackId;
        this.sdkCallback = sdkCallback;
        map.put(this.uuid, this);
    }

    public void cancelFlow() {
        getSdkCallbackForAction().cancelFlow();
    }

    protected OstBaseInterface getSdkCallbackForAction() {
        OstBaseInterface instance = this.sdkCallback;
        this.cleanUp();
        return instance;
    }

    protected void errorEncountered(String internalErrorCode, OstErrors.ErrorCode errorCode) {
        getSdkCallbackForAction();
        OstWorkFlowCallbackImpl ostWorkFlowCallback = OstWorkFlowCallbackImpl.getInstance( this.workflowCallbackId );
        ostWorkFlowCallback.errorEncountered( internalErrorCode , errorCode );
    }

    public boolean messageReceived(String methodName, String jsonParams) {
        if ( methodName.compareToIgnoreCase("cancelFlow") == 0 ) {
            //cancelFlow called.
            this.cancelFlow();
            return true;
        }
        return false;
    }

    public void cleanUp() {
        this.sdkCallback = null;
        map.remove(this.uuid);
    }
}
