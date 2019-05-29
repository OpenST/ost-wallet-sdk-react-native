import OstRNError from "./OstRNError";

const ErrorCodes = {
  "BAD_REQUEST" : "BAD_REQUEST" ,
  "AUTHENTICATION_ERROR" : "AUTHENTICATION_ERROR",
  "NOT_FOUND" : "NOT_FOUND" ,
  "INSUFFICIENT_FUNDS" : "INSUFFICIENT_FUNDS" ,
  "UNPROCESSABLE_ENTITY" : "UNPROCESSABLE_ENTITY",
  "INTERNAL_SERVER_ERROR" : "INTERNAL_SERVER_ERROR",
  "AUTHORIZATION_ERROR" : "AUTHORIZATION_ERROR",
  "REQUEST_TIMEOUT" : "REQUEST_TIMEOUT",
  "UNSUPPORTED_VERSION" : "UNSUPPORTED_VERSION",
  "TOO_MANY_REQUESTS" : "TOO_MANY_REQUESTS",
  "ALREADY_EXISTS" : "ALREADY_EXISTS"
};


class OstRNApiError extends  OstRNError{
  
  constructor( error ){
    super(error);
    this.apiError = error && error.api_error || {}
  }
  
  static get ApiErrorCodes() {
    return ErrorCodes;
  }
  
  getApiError(){
    return this.apiError ;
  }
  
  getApiInternalId(){
    return this.apiError.internal_id;
  }
  
  getApiErrorCode(){
    return this.apiError.code;
  }
  
  getApiErrorData(){
    return this.apiError.error_data;
  }
  
  getApiErrorMessage(){
    return this.apiError.msg;
  }
  
  isBadRequest(){
    return this.getApiErrorCode() == ErrorCodes['BAD_REQUEST'];
  }
  
  isNotFound(){
    return this.getApiErrorCode() == ErrorCodes['NOT_FOUND'];
  }
  
  isDeviceTimeOutOfSync(){
    return this.isErrorParameterKey( "api_request_timestamp" );
  }
  
  isApiSignerUnauthorized(){
    return this.isErrorParameterKey( "api_key" );
  }
  
   isErrorParameterKey( key ){
      if(!key) return false ;
      let errorData = this.getApiErrorData() || [];
      for(let cnt =0 ; cnt < errorData.length ; cnt++){
        let parameter =  errorData[cnt]['parameter'];
        if( parameter && parameter.toLowerCase() ==  key.toLowerCase() ){
         return true ;
        }
      }
      return false ;
  }
  
}

export default OstRNApiError ;