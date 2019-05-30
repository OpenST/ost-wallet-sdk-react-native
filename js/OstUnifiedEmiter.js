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