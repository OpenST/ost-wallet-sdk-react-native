/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

import { NativeModules } from 'react-native';
const { OstRNSdkCallbackManager } = NativeModules;

import BaseSdkInteract from './BaseSdkInteract';

class OstDeviceRegistered extends BaseSdkInteract {
  constructor(workflowuuid, interactuuid) {
    super(workflowuuid, interactuuid);
  }

  deviceRegistered(apiResponse, errorCallback) {
    try {
      apiResponse = apiResponse && JSON.stringify(apiResponse) ;
    }catch (e){
      console.warn("Unexpected JSON Object apiResponse in deviceRegistered", apiResponse );
    }
    OstRNSdkCallbackManager.deviceRegistered(this.interactuuid, apiResponse, function( error ){
      BaseSdkInteract.errorCallbackInvoker( error , errorCallback );
    });
  }
}

export default OstDeviceRegistered;
