
# OST Wallet SDK React Native

## Getting started

`$ npm install ost-wallet-sdk-react-native`

### Android

#### Mostly automatic installation

Run this command in the root directory of your project

```bash
$ react-native link ost-wallet-sdk-react-native
```

In this case, you can **skip steps 1 to 3** mentioned below and **only do step 4 and 5**.

#### Manual installation

1. Open up `./android/app/src/main/java/[...]/MainApplication.java`. 
   - Add `import com.ostwalletrnsdk.OstWalletRnSdkPackage;` to the imports at the top of the file. 
   - Add `new OstWalletRnSdkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `./android/settings.gradle`:
  	```
  	include ':ost-wallet-sdk-react-native'
  	project(':ost-wallet-sdk-react-native').projectDir = new File(rootProject.projectDir, 	'../node_modules/ost-wallet-sdk-react-native/android')
  	```
3. Insert the following lines inside the dependencies block in `./android/app/build.gradle`:
    ```
    compile project(':ost-wallet-sdk-react-native')
    ```
4. Change the `minSdkVersion` to 22 in `android/build.gradle`	    
5. Create file `./android/app/src/main/assets/ost-mobilesdk.json` with application specific configurations using  the json below as an example

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
### OST SDK APIs

To use the apis you first need to import the `OstWalletSdk` from 'ost-wallet-sdk-react-native' as below-

```javascript
import {OstWalletSdkEvents, OstWalletSdk} from 'ost-wallet-sdk-react-native';
```
You must pass a new instance of the workflow callback implementation for each of the below methods. Refer `WorkFlow Callbacks` for how to create an implementation of the `OstWalletWorkFlowCallback` interface in a class.

Below are the apis available-

### Set up the device
This workflow needs userId and tokenId so setupDevice may be called after the user logs in to the application. Using a mapping between userId in OST Platform and the app user, you have access to userId and tokenId.

If the user is logged in, then setupDevice should be called every time the app launches, this ensures that the current device is registered before communicating with OST Platform server.

#### Parameters
  parameter userId: Ost User id<br/>
  parameter tokenId: Id assigned by Ost to token<br/>
  parameter workFlowCallback: callback implementation object for application communication<br/>
  
```OstWalletSdk.setupDevice(userId, tokenId, new OstWalletWorkflowCallback());```

### Activate the user
User activation refers to the deployment of smart-contracts that form the user's Brand Token wallet. An activated user can engage with a Brand Token economy. 

#### Parameters
  parameter userId: user Id<br/>
  parameter pin: user pin<br/>
  parameter passphrasePrefix: passphrasePrefix<br/>
  parameter expiresAfterInSecs: session key expiry time<br/>
  parameter spendingLimit: spending limit once in a transaction of session<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.activateUser(userId,pin,passphrasePrefix,expiresAfterInSecs,spendingLimit, new ActivateUserCallback());```

### Authorize a session
A session is a period of time during which a sessionKey is authorized to sign transactions under a pre-set limit on behalf of the user. The device manager, which controls the tokens, authorizes sessions. 

#### Parameters
  parameter userId: Ost User id<br/>
  parameter expiresAfterInSecs: sessions key expiry time<br/>
  parameter spendingLimit: spending limit once in a transaction of session in wei<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.addSession(userId, expiresAfterInSecs, spendingLimit, new OstWalletWorkflowCallback());```

### Execute a transaction
A transaction where Brand Tokens are transferred from a user to another actor within the Brand Token economy are signed using sessionKey if there is an active session. In the absence of an active session, a new session is authorized.

#### Parameters
  parameter userId: Ost User id<br/>
  parameter tokenHolderAddresses: Token holder addresses of amount receiver<br/>
  parameter amounts: Amounts corresponding to tokenHolderAddresses to be transfered<br/>
  parameter ruleName: Rule name to be executed<br/>
  parameter meta: Object with meta info of type of transaction<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.executeTransaction(userId, tokenHolderAddresses, amounts, ruleName, meta, new OstWalletWorkflowCallback()); ```

### Get Mnemonic Phrase
The mnemonic phrase represents a human-readable way to authorize a new device. This phrase is 12 words long. 

#### Parameters
  parameter userId: Ost User id<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.getDeviceMnemonics(userId, new DeviceMnemonicsCallbackImplementation());```

### Add a device using mnemonics
A user that has stored their mnemonic phrase can enter it into an appropriate user interface on a new mobile device and authorize that device to be able to control their Brand Tokens.

#### Parameters
  parameter userId: Ost User id<br/>
  parameter passphrase: byte array of paper wallet<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.authorizeCurrentDeviceWithMnemonics(userId, passphrase, new OstWalletWorkflowCallback());```

### Generate a QR Code
A developer can use this method to generate a QR code that displays the information pertinent to the mobile device it is generated on. Scanning this QR code with an authorized mobile device will result in the new device being authorized.

#### Parameters
   parameter userId: Ost User id<br/>
   parameter successCallback: Receives the qr data as response<br/>
   
```OstWalletSdk.getAddDeviceQRCode(userId, successCallback);```

### Perform QR action
QR codes can be used to encode transaction data for authorizing devices, making purchases via webstores, etc.This method can be used to process the information scanned off a QR code and act on it.

#### Parameters
  parameter userId: Ost User id<br/>
  parameter data: JSON object string scanned from QR code<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.performQRAction(userId, data, new OstWalletWorkflowCallback());```

### Reset a User's PIN
The user's PIN is set when activating the user. This method supports re-setting a PIN and re-creating the recoveryOwner. 

#### Parameters
  parameter userId: Ost User id<br/>
  parameter appSalt: Salt provided by app<br/>
  parameter currentPin: current pin to be change<br/>
  parameter newPin: new pin to be updated<br/>
  parameter workFlowCallback: callback implementation object for application communication <br/>
  
```OstWalletSdk.resetPin(userId, appSalt, currentPin, newPin, new OstWalletWorkflowCallback());```

### Initialize Device Recovery
A user can control their Brand Tokens using their authorized devices. If they lose their authorized device, they can recover access to their BrandTokens by authorizing a new device via the recovery process .

#### Parameters
  parameter userId: user id of recovery user<br/>
  parameter pin: user pin<br/>
  parameter salt: app salt<br/>
  parameter deviceAddress: address of device to recover<br/>
  parameter workFlowCallback: Work flow interact<br/>
  
```OstWalletSdk.initiateDeviceRecovery( userId, pin, salt, deviceAddress, new OstWalletWorkflowCallback());```

### Abort Device Recovery
To abort initiated device recovery.

#### Parameters
  parameter userId userId of recovery user<br/>
  parameter pin: user pin<br/>
  parameter salt: app salt<br/>
  parameter workFlowCallback Workflow callback Interact <br/>
  
``` OstWalletSdk.abortDeviceRecovery( userId, pin, salt, new OstWalletWorkflowCallback());```

### Log out all sessions
It will revoke all the sessions associated with provided userId

#### Parameters
  parameter userId user Id whose sessions to revoke<br/>
  parameter workFlowCallback Workflow callback interact<br/>
  
```OstWalletSdk.logoutAllSessions(userId, new OstWalletWorkflowCallback());```


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
