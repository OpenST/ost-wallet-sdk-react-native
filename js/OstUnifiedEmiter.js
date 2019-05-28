import {
    NativeModules,
    Platform,
    NativeEventEmitter,
    DeviceEventEmitter,
} from 'react-native';
  
export default Platform.select({
    ios: (function () {
      console.log("Creating new NativeEventEmitter");
      return new NativeEventEmitter(NativeModules.OstMessageBus);
    })(),
    android: DeviceEventEmitter
});