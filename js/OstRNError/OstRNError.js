class OstRNError {

    constructor( error ){
        this.error = error || {}; 
    }
    
    getErrorCode(){
        return this.error.error_code;
    }

    getErrorMessage(){
        return this.error.error_message; 
    }

    getInternalErrorCode(){
        return this.error.internal_error_code; 
    }

    isApiError(){
        return this.error.is_api_error; 
    }

    getApiError(){
        return this.error.api_error;
    }

    getErrorInfo(){
        return this.error.error_info; 
    }

    getApiInternalId(){
        return this.error.internal_id; 
    }

}

export default OstRNError ; 