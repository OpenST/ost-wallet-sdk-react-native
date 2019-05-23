
# ost-wallet-sdk-react-native

## Getting started

`$ npm install ost-wallet-sdk-react-native`

### Mostly automatic installation

`$ react-native link ost-wallet-sdk-react-native`

### Manual installation

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.ostwalletrnsdk.OstWalletRnSdkPackage;` to the imports at the top of the file
  - Add `new OstWalletRnSdkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':ost-wallet-sdk-react-native'
  	project(':ost-wallet-sdk-react-native').projectDir = new File(rootProject.projectDir, 	'../node_modules/ost-wallet-sdk-react-native/android')
  	```
3. Change the `minSdkVersion` to 22 in `android/build.gradle`	
4. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
    compile project(':ost-wallet-sdk-react-native')
5. Create file `android\app\src\main\assets\ost-mobilesdk.json` with application specific configurations using  the json below as an example

 ```json
{
	"BLOCK_GENERATION_TIME": 3,
	"PIN_MAX_RETRY_COUNT": 3,
	"REQUEST_TIMEOUT_DURATION": 60,
	"SESSION_BUFFER_TIME": 3600,
	"PRICE_POINT_TOKEN_SYMBOL": "OST",
	"PRICE_POINT_CURRENCY_SYMBOL": "USD",
	"USE_SEED_PASSWORD": false
}
 ```
 NOTE: These configurations are MANDATORY for successful operation. Failing to set them will significantly impact usage.

#### iOS

1. Go to `node_modules/ost-wallet-sdk-react-native/ios` and run this command: `carthage update --platform iOS` 
2. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
3. Go to `node_modules/ost-wallet-sdk-react-native/ios` and add `OstWalletSdk.xcodeproj`
4. In XCode, in the project navigator, select your project. Add `libOstWalletSdk.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
5. Run your project (`Cmd+R`)

## Usage in React Native

In the most top level component (mostly `App.js`) import like this:
```javascript
import {OstWalletSdkEvents, OstWalletSdk} from 'ost-wallet-sdk-react-native';
```

In `componentDidMount()` subscribe to OstWalletSdkEvents and in `componentWillUnmount()` unsubscribe to OstWalletSdkEvents. Also initiate the SDK in using BASE_URL (OST Platform endpoint) `constructor()`:

```javascript
class App extends Component {
    
  constructor() {
    super();
    OstWalletSdk.initialize(BASE_URL, err => {
      console.warn(err);
    });
  }

  componentDidMount() {
    OstWalletSdkEvents.subscribeEvent();
  }

  componentWillUnmount() {
    OstWalletSdkEvents.unsubscribeEvent();
  }

}
```

Implement the `OstWalletWorkFlowCallback` interface in a class:

```javascript
import { OstWalletWorkFlowCallback } from 'ost-wallet-sdk-react-native';

class OstWalletSdkCallbackImplementation extends OstWalletWorkFlowCallback {
    constructor() {
        super();
    }

    registerDevice(apiParams, ostDeviceRegistered) {}

    getPin(res, ostPinAcceptInterface) {}

    invalidPin(res, ostPinAcceptInterface) {}

    pinValidated(res) {}

    flowComplete(res) {}

    flowInterrupt(res) {}

    requestAcknowledged(ostWorkflowContext, ostContextEntity) {}

    verifyData(ostWorkflowContext, ostContextEntity, ostVerifyDataInterface) {}
}

export default OstWalletSdkCallbackImplementation;
```
