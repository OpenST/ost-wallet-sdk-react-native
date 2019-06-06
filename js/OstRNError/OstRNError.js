/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */
 
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
        return !!this.error.is_api_error ;
    }
}

export default OstRNError ; 