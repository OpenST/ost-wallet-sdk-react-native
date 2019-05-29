import OstRNError from "./OstRNError";

const ApiErrorCodes = {
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
  }
  
  
  getInternalId(){
    return this.error.internal_id; 
  }
  
  isBadRequest(){
  
  }
  
  isNotFound(){
  
  }
  
  isDeviceTimeOutOfSync(){
  
  }
  
  isApiSignerUnauthorized(){
  
  }
  
}

export default OstRNApiError ;