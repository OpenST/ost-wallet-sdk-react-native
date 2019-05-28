package com.ostwalletrnsdk.errors;

import com.ost.walletsdk.workflows.errors.OstError;

public class OstRNError extends OstError {

    public String getWorkflowCallbackId() {
        return workflowCallbackId;
    }

    String workflowCallbackId;
    public OstRNError(String internalErrorCode, OstRNErrors.ErrorCode errorCode, String workflowCallbackId) {
        super(internalErrorCode, errorCode, OstRNErrors.getMessage( errorCode ));
        this.workflowCallbackId = workflowCallbackId;
    }
}
