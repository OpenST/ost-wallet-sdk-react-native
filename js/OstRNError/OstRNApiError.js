/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

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
  }

  static get ApiErrorCodes() {
    return ErrorCodes;
  }

  getApiError(){
      return this.error && (this.error.apiError || this.error.api_error) || {};
  }

  getApiInternalId(){
    return this.getApiError().internal_id;
  }

  getApiErrorCode(){
    return this.getApiError().code;
  }

  getApiErrorData(){
    return this.getApiError().error_data;
  }

  getApiErrorMessage(){
    return this.getApiError().msg;
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
