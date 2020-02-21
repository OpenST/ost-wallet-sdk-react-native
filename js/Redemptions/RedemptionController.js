import InternalWorkflowDelegate from "../delegates/InternalWorkflowDelegate";

class RedemptionController {

    constructor(ostUserId , internalDelegate , externalDelegate){
        this.ostUserId = ostUserId ;
        this.internalDelegate = internalDelegate;
        this.externalDelegate = externalDelegate;
    }

    _excequteInternalWorkflow(workflowName ,  fnArguments){
        if(this.internalDelegate  && this.internalDelegate[workflowName] ){
            this.internalDelegate[workflowName].apply(this.internalDelegate , fnArguments );
        }
    }

    _excequteExternalWorkFlow(workflowName ,  fnArguments){
        if(this.externalDelegate  && this.externalDelegate[workflowName] ){
            this.externalDelegate[workflowName].apply(this.externalDelegate , fnArguments );
        }
    }

    getWorkflowDelegate() {
        let delegate = new InternalWorkflowDelegate( this.ostUserId, this.externalDelegate); 
        
        delegate.requestAcknowledged = (...args) => { 
            this._excequteInternalWorkflow("requestAcknowledged", args);
            this._excequteExternalWorkFlow("requestAcknowledged", args);
        };
    
        delegate.flowComplete = (...args) => {
          this._excequteInternalWorkflow("flowComplete", args);
          this._excequteExternalWorkFlow("flowComplete", args);
        };
    
        delegate.onUnauthorized = (...args) => {
          this._excequteInternalWorkflow("onUnauthorized", args);
          this._excequteExternalWorkFlow("onUnauthorized", args);
        };
    
        delegate.saltFetchFailed = (...args) => {
          this._excequteInternalWorkflow("saltFetchFailed", args);
          this._excequteExternalWorkFlow("saltFetchFailed", args);
        };
    
        delegate.userCancelled = (...args) => {
          this._excequteInternalWorkflow("userCancelled", args);
          this._excequteExternalWorkFlow("userCancelled", args);
        };
    
        delegate.deviceTimeOutOfSync = (...args) => {
          this._excequteInternalWorkflow("deviceTimeOutOfSync", args);
          this._excequteExternalWorkFlow("deviceTimeOutOfSync", args);
        };
    
        delegate.workflowFailed = (...args) => {
          this._excequteInternalWorkflow("workflowFailed", args);
          this._excequteExternalWorkFlow("workflowFailed", args);
        };
        
    
        return delegate;
      }


}

export default RedemptionController;