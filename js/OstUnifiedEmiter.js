/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */
 
import {
    NativeModules,
    Platform,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
  
export default Platform.select({
    ios: (function () {
      return new NativeEventEmitter(NativeModules.OstMessageBus);
    })(),
    android: DeviceEventEmitter
});