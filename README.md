
# OST Wallet SDK React Native

## Getting started

`$ npm install ost-wallet-sdk-react-native`

### Android

#### Mostly automatic installation

Run this command in the root directory of your project

```bash
$ react-native link ost-wallet-sdk-react-native
```

In this case, you can skip steps 1 to 3 mentioned below and only do step 4 and 5.

#### Manual installation

1. Open up `android/app/src/main/java/[...]/MainApplication.java`. 
   - Add `import com.ostwalletrnsdk.OstWalletRnSdkPackage;` to the imports at the top of the file. 
   - Add `new OstWalletRnSdkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':ost-wallet-sdk-react-native'
  	project(':ost-wallet-sdk-react-native').projectDir = new File(rootProject.projectDir, 	'../node_modules/ost-wallet-sdk-react-native/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```
    compile project(':ost-wallet-sdk-react-native')
    ```
4. Change the `minSdkVersion` to 22 in `android/build.gradle`	    
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

### iOS

1. Resolve dependencies using [Carthage](https://github.com/Carthage/Carthage).
   - Get [Carthage](https://github.com/Carthage/Carthage) by running `brew install carthage` or choose [another installation method](https://github.com/Carthage/Carthage/#installing-carthage)
   - Create a [Cartfile](https://github.com/Carthage/Carthage/blob/master/Documentation/Artifacts.md#cartfile) in `./ios` (the same directory where your `.xcodeproj` or `.xcworkspace` is)
   - Specify OstWalletSdk in [Cartfile](https://github.com/Carthage/Carthage/blob/master/Documentation/Artifacts.md#cartfile)

    ```
    github "ostdotcom/ost-wallet-sdk-ios" == 2.0.4
    ```
    - Run `carthage update --platform iOS`
    - A `Cartfile.resolved` file and a `Carthage` directory will appear in `./ios` (the same directory where your `.xcodeproj` or `.xcworkspace` is)
2. Open application target, under `General` tab, drag the built `OstWalletSdk.framework` binary from `./ios/Carthage/Build/iOS` into `Linked Frameworks and Libraries` section.
3. On the application targets’ `Build Phases` settings tab, click the _+_ icon and choose `New Run Script Phase`. Add the following command:
   ```sh
   /usr/local/bin/carthage copy-frameworks
   ```
   - Click the + under `Input Files` and add an entry for each framework:
   ```
   $(SRCROOT)/Carthage/Build/iOS/Alamofire.framework
   $(SRCROOT)/Carthage/Build/iOS/BigInt.framework
   $(SRCROOT)/Carthage/Build/iOS/CryptoEthereumSwift.framework
   $(SRCROOT)/Carthage/Build/iOS/CryptoSwift.framework
   $(SRCROOT)/Carthage/Build/iOS/EthereumKit.framework
   $(SRCROOT)/Carthage/Build/iOS/FMDB.framework
   $(SRCROOT)/Carthage/Build/iOS/SipHash.framework
   $(SRCROOT)/Carthage/Build/iOS/OstWalletSdk.framework
   ```   
4. Click on your project, select `File > Add Files to "<Your Project>"`, browse to `./node_modules/ost-wallet-sdk-react-native/ios` and add the folder `ostwalletrnsdk` with these settings:
   - Destination: (uncheck) Copy items if needed 
   - Added folders: (select) Create groups
   - Click `Add`
5. On the application targets’ `Build Settings` tab, enable `Always Embed Swift Standard Libraries` under `Build Options`
6. Create file `OstWalletSdk.plist` with application specific configurations using  the json below as an example
    ```
    <?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
        <dict>
            <key>BlockGenerationTime</key>
            <integer>3</integer>
            <key>PricePointTokenSymbol</key>
            <string>OST</string>
            <key>PricePointCurrencySymbol</key>
            <string>USD</string>
            <key>RequestTimeoutDuration</key>
            <integer>30</integer>
            <key>PinMaxRetryCount</key>
            <integer>3</integer>
            <key>SessionBufferTime</key>
            <integer>3600</integer>
            <key>UseSeedPassword</key>
            <false/>
        </dict>
    </plist>
    ```
NOTE: These configurations are MANDATORY for successful operation. Failing to set them will significantly impact usage.

## Usage in React Native

#### Subscribe to `OstWalletSdkEvents` in your top most level component

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
#### OST SDK APIs
This section to be populated...

#### WorkFlow Callbacks

Implement the `OstWalletWorkFlowCallback` interface in a class before calling any of the above WorkFlows.

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
