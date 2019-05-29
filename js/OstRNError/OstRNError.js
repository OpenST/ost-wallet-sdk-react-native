class OstRNError {

    constructor( error ){
        this.error = error || {}; 
    }
  
    getErrorCode(){
       return this.error.error_code ;
    }
  
    getInternalErrorCode(){
      return this.error.internal_error_code ;
    }
    
    getErrorMessage(){
        return this.error.error_message;
    }
    
    getErrorInfo(){
        return this.error.error_info;
    }
    
    isApiError(){
        return this.error.is_api_error ;
    }
}

export default OstRNError ; 