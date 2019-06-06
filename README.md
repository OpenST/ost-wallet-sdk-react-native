
# OST Wallet SDK React Native


## Introduction

OST React Native Wallet SDK is official OST Wallet SDK for react-native platform. OST React Native Wallet SDK is a mobile application development SDK that enables developers to integrate the functionality of a non-custodial crypto-wallet into consumer applications. 



The OST React Native Wallet SDK:

* Safely generates and stores keys on the user's mobile device
* Signs ethereum transactions and data as defined by contracts using EIP-1077
* Enables users to recover access to their Brand Tokens in case the user loses their authorized device




## Installing React-native SDK

1. Install React native and create a react native project

Follow this [official react-native getting started guide](https://facebook.github.io/react-native/docs/0.59/getting-started) to install react native and create a react-native project

2. Install the OST React Native SDK in your project
Run following command in your react-native project root

` npm install @ostdotcom/ost-wallet-sdk-react-native`

3. Linking the OST React native SDk with your project

`react-native link @ostdotcom/ost-wallet-sdk-react-native`


4. [Android setup for OST React Native SDK](android_setup.md)

5. [iOS setup for OST React Native SDK](ios_setup.md)

## SDK Usage

1. Subscribe to events
2. Implement `OstWalletWorkFlowCallback` for a workflow
3. Execute workflow


### 1.  Subscribe to `OstWalletSdkEvents` in your top most level component

In the most top level component (mostly `App.js`) import like this:
```javascript
import {OstWalletSdkEvents, OstWalletSdk} from 'ost-wallet-sdk-react-native';
```

In `componentDidMount()` subscribe to OstWalletSdkEvents and in `componentWillUnmount()` unsubscribe to OstWalletSdkEvents. Also initiate the SDK in using BASE_URL (OST Platform endpoint) `constructor()`:

```javascript
class App extends Component {
    
  constructor() {
    super();
    OstWalletSdk.initialize(BASE_URL, (error, success) => {
      if(error) {
        console.warn(error);
      }
      else {
        console.warn(success);
      }

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

### 2. Implement `OstWalletWorkFlowCallback` for a workflow

For communication between OST React Native SDK and your application, you need to implement callbacks. A base callback class `OstWalletWorkFlowCallback` is given as a part of the SDK. The base callback class gives only declaration of callback functions. A detail overview of callback functions is available in later part of this readme.



**Developers are expected to implement a new class for each workflow.**

#### An example of callback implementation

```javascript

import {OstWalletWorkFlowCallback} from 'ost-wallet-sdk-react-native';

class OstWalletSdkCallbackImplementation extends OstWalletWorkFlowCallback {
    constructor() {
        super();
    }

    flowComplete(ostWorkflowContext , ostContextEntity) {
        console.log('flowComplete ostWorkflowContext', ostWorkflowContext,  "ostContextEntity- ", ostContextEntity);
          if(Actions.currentScene !== "HomePage"){
            Actions.popTo("HomePage");
          }
        if(ostWorkflowContext){
            let wfType = ostWorkflowContext.WORKFLOW_TYPE;
            if( wfType !== "SETUP_DEVICE") {
                Alert.alert(`${wfType} Complete!`);
            }
        }
        store.dispatch(setLoading(false));
    }

    flowInterrupt(ostWorkflowContext , ostError) {
        console.log('flowInterrupt ostWorkflowContext', ostWorkflowContext , "ostError" , ostError );
        if (ostError) {
              let displayError = ostError.getErrorMessage(),
              apiError, errorData;
            if(ostError.isApiError()){
                apiError = ostError.getApiErrorMessage();
                if(apiError && apiError.includes('err.error_data')){
                  apiError = '';
                }
                errorData = ostError.getApiErrorData();
                if(errorData && errorData.length > 0){
                  for(let i=0; i<errorData.length;i++){
                    apiError = apiError + errorData[i].msg;
                  }
                }
                displayError = displayError+apiError;
            }
            Alert.alert('Error!', displayError);
        }
          if(Actions.currentScene !== "HomePage"){
            Actions.popTo("HomePage");
          }
        store.dispatch(setLoading(false));
      if(ostError.isApiError()) {
        console.log("getApiError", ostError.getApiError());
        console.log("getApiInternalId", ostError.getApiInternalId());
        console.log("getApiErrorCode", ostError.getApiErrorCode());
        console.log("getApiErrorData", ostError.getApiErrorData());
        console.log("getApiErrorMessage", ostError.getApiErrorMessage());
        console.log("isBadRequest", ostError.isBadRequest());
        console.log("isNotFound", ostError.isNotFound());
        console.log("isDeviceTimeOutOfSync", ostError.isDeviceTimeOutOfSync());
        console.log("isApiSignerUnauthorized", ostError.isApiSignerUnauthorized());
        console.log("isErrorParameterKey", ostError.isErrorParameterKey("new_recovery_owner_address"));
      }
      console.log("getErrorCode",ostError.getErrorCode());
      console.log("getInternalErrorCode",ostError.getInternalErrorCode());
      console.log("getErrorMessage",ostError.getErrorMessage());
      console.log("getErrorInfo",ostError.getErrorInfo());
      console.log("isApiError",ostError.isApiError());
    }

    requestAcknowledged(ostWorkflowContext, ostContextEntity) {
        console.log('requestAcknowledged ostWorkflowContext', ostWorkflowContext , "ostContextEntity- ", ostContextEntity );
    }

}

export default OstWalletSdkCallbackImplementation;

```

### 3. Execute a workflow

To execute a workflow, we need to pass an instance of `OstWalletSdkCallbackImplementation` class. The callback implementation will be different for each workflow available in this SDK.

```javascript

import OstWalletWorkflowCallback from './OstWalletSdkCallbackImplementation';

onLogoutAllSessions() {
    AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);
        OstWalletSdk.logoutAllSessions(user.user_details.user_id, new OstWalletWorkflowCallback(), console.warn);
    });
}

```



# SDK Methods

To use the APIs you will first need to import the `OstWalletSdk` from 'ost-wallet-sdk-react-native' as below:

```javascript
import {OstWalletSdk} from 'ost-wallet-sdk-react-native';
```

You would need to pass a new instance of the workflow callback implementation for each of the below methods. 



### initialize
You must initialize the SDK before start using it. 

```javascript
/**
   * Initialize wallet sdk
   * @param {String} endpoint - OST Platform endpoint
   * @param {function} Callback function with error and success status.
   * @public
   */
initialize( endpoint , 
            (error, success) => {})
```


### setupDevice
This workflow needs userId and tokenId so setupDevice may be called after the user logs in to the application. Using a mapping between userId in OST Platform and the app user, you have access to userId and tokenId.

If the user is logged in, then setupDevice should be called every time the app launches, this ensures that the current device is registered before communicating with OST Platform server.

```javascript
 /**
   * Setup user device 
   * @param {String} userId - Ost User id
   * @param {String} tokenId - Id assigned by Ost to token
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
 setupDevice(userId, tokenId, workflow)
```




### activateUser
User activation refers to the deployment of smart-contracts that form the user's Brand Token wallet. An activated user can engage with a Brand Token economy. 

```javascript
/**
   * Add user session
   * @param {String} userId - Ost User id
   * @param {String} expiresAfterInSecs - session key expiry time. 
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
activateUser( userId, 
              pin, 
              passphrasePrefix, 
              expiresAfterInSecs, 
              spendingLimit, 
              workflow)

```


### addSession
A session is a period of time during which a sessionKey is authorized to sign transactions under a pre-set limit on behalf of the user. The device manager, which controls the tokens, authorizes sessions.

```javascript
/**
     * Add user session
     * @param {String} userId - Ost User id
     * @param {String} expiresAfterInSecs - session key expiry time. 
     * @param {String} spendingLimit - spending limit once in a transaction of session
     * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
     * @public
     */
addSession( userId, 
            expireAfterInSecs, 
            spendingLimit, 
            workflow)
```


### executeTransaction
A transaction where Brand Tokens are transferred from a user to another actor within the Brand Token economy are signed using sessionKey if there is an active session. In the absence of an active session, a new session is authorized.

```javascript

/**
   * Execute user transactions
   * @param {string} userId - Ost User id
   * @param {Array<String>} tokenHolderAddresses - Token holder addresses of amount receiver. 
   * @param {Array<String>} amounts -Amounts corresponding to tokenHolderAddresses to be transfered
   * @param {String} ruleName - Rule name to be executed.
   * @param {object} meta - additional data.
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */

executeTransaction( userId, 
                    tokenHolderAddresses, 
                    amounts, 
                    ruleName, 
                    meta, 
                    workflow)

```



### getDeviceMnemonics
The mnemonic phrase represents a human-readable way to authorize a new device. This phrase is 12 words long. 

```javascript
/**
   * Get Device mnemonics 
   * @param {String} userId - Ost User id
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
getDeviceMnemonics( userId, 
                    workflow)

```

### authorizeCurrentDeviceWithMnemonics
A user that has stored their mnemonic phrase can enter it into an appropriate user interface on a new mobile device and authorize that device to be able to control their Brand Tokens.

```javascript
 /**
     * Authorize user device with mnemonics
     * @param {String} userId - Ost User id
     * @param {String} mnemonics - string of mnemonics
     * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
     * @public
     */

authorizeCurrentDeviceWithMnemonics(userId, 
                                    mnemonics, 
                                    workflow) 

```


### getAddDeviceQRCode
A developer can use this method to generate a QR code that displays the information pertinent to the mobile device it is generated on. Scanning this QR code with an authorized mobile device will result in the new device being authorized.


```javascript
/**
   * Get device QR code
   * @param {String} userId - Ost User id
   * @param {function} successCallback - returns string.
   * @param {function} errorCallback.
   * @public
   */
getAddDeviceQRCode( userId , 
                    successCallback , 
                    errorCallback )
```


### performQRAction
QR codes can be used to encode transaction data for authorizing devices, making purchases via webstores, etc.This method can be used to process the information scanned off a QR code and act on it.

```javascript
/**
   * Perform QR action 
   * @param {String} userId - Ost User id
   * @param {String} data - Json string of payload is scanned by QR-Code.
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
performQRAction(userId, 
                data, 
                workflow) 
```

### resetPin
The user's PIN is set when activating the user. This method supports re-setting a PIN and re-creating the recoveryOwner. 

```javascript
/**
   * Reset user pin 
   * @param {String} userId - Ost User id
   * @param {String} appSalt - Passphrase prefix provided by application server
   * @param {String} currentPin - user current pin
   * @param {String} newPin - user new pin 
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
resetPin( userId, 
          appSalt, 
          currentPin, 
          newPin, 
          workflow )
```

### initiateDeviceRecovery
A user can control their Brand Tokens using their authorized devices. If they lose their authorized device, they can recover access to their BrandTokens by authorizing a new device via the recovery process .

```javascript
/**
   * Initiate device recovery 
   * @param {String} userId - Ost User id
   * @param {String} pin - user current pin
   * @param {String} appSalt - Passphrase prefix provided by application server
   * @param {String} deviceAddressToRecover - Device address which wants to recover
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
initiateDeviceRecovery( userId, 
                        pin, 
                        appSalt,  
                        deviceAddressToRecover, 
                        workflow ) 
```

### abortDeviceRecovery
To abort initiated device recovery.

```javascript
/**
   * Abort device recovery 
   * @param {String} userId - Ost User id
   * @param {String} pin - user current pin
   * @param {String} appSalt - Passphrase prefix provided by application server
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
abortDeviceRecovery(userId,  
                    pin ,  
                    appSalt , 
                    workflow ) 
```

### logoutAllSessions
It will revoke all the sessions associated with provided userId

```javascript
/**
   * Logout user all sessions  
   * @param {String} userId - Ost User id
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
logoutAllSessions(userId, 
                  workflow )
```


### revokeDevice
This will unauthorize the current device.

```javascript
/**
   * revokeDevice
   * @param {String} userId - Ost User id
   * @param {String} deviceAddress - device address 
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
revokeDevice( userId , 
              deviceAddress , 
              workflow)

```


# SDK WorkFlow Callbacks

Implement the `OstWalletWorkFlowCallback` class before calling any of the above WorkFlows.

```javascript
import { OstWalletWorkFlowCallback } from 'ost-wallet-sdk-react-native';

class OstWalletSdkCallbackImplementation extends OstWalletWorkFlowCallback {
    constructor() {
        super();
    }

    registerDevice(apiParams, ostDeviceRegistered) {}

    getPin(ostWorkflowContext, ostContextEntity, ostPinAccept) {}

    invalidPin(ostWorkflowContext, ostContextEntity, ostPinAccept) {}


    pinValidated(ostWorkflowContext, ostContextEntity) {}

    flowComplete( ostWorkflowContext, ostContextEntity ) {}

    flowInterrupt(ostWorkflowContext, ostError ) {}

    requestAcknowledged(ostWorkflowContext, ostContextEntity) {}

    verifyData(ostWorkflowContext, ostContextEntity, ostVerifyData) {}
}

export default OstWalletSdkCallbackImplementation;
```

The callback functions provided by the interface are as follows-

### flowComplete

This function will be called by wallet SDK when a workflow is completed. The details of workflow and the entity that was updated during the workflow will be available in arguments.

```
flowComplete( ostWorkflowContext, ostContextEntity)
```

| Argument | Description |
|---|---|
| **OstWorkflowContext**	|	Information about the workflow	|
| **OstContextEntity**	| Information about the entity |



<br>




### flowInterrupt
This function will be called by wallet SDK when a workflow is cancelled. The workflow details and error details will be available in arguments.

```
flowInterrupt( ostWorkflowContext, ostError)
```

| Argument | Description |
|---|---|
| **OstWorkflowContext**	| Information about the workflow |
| **OstError**	| ostError object will have details about the error that interrupted the flow |



<br>




### requestAcknowledged
This function will be called by wallet SDK when the core API request was successful which happens during the execution of workflows. At this stage the workflow is not completed but it shows that the main communication between the wallet SDK and OST Platform server is complete. <br>Once the workflow is complete the `app` will receive the details in `flowComplete` (described below) function. 

```
requestAcknowledged( ostWorkflowContext, ostContextEntity)
```

| Argument | Description |
|---|---|
|  **OstWorkflowContext**	| Information about the workflow	|
|  **OstContextEntity**	| Information about the entity |

<br>




### getPin
This function will be called by wallet SDK when it needs to get the PIN from the `app` user to authenticate any authorised action.
<br>**Expected Function Definition:** Developers of client company are expected to launch their user interface to get the PIN from the user and pass back this PIN to SDK by calling **ostPinAccept.pinEntered()** 

```
getPin( userId, ostPinAccept)
```

| Argument | Description |
|---|---|
| **userId**	| Unique identifier of the user |
| **OstPinAccept**	| **ostPinAccept.pinEntered()** should be called to pass the PIN back to SDK. <br> For some reason if the developer wants to cancel the current workflow they can do it by calling **ostPinAccept.cancelFlow()** |


<br>




### pinValidated
This function will be called by wallet SDK when the last entered PIN is validated. 

```
pinValidated(userId)
```

| Argument | Description |
|---|---|
| **userId**	| Unique identifier of the user |




<br>



### invalidPin
This function will be called by wallet SDK when the last entered PIN was wrong and `app` user has to provide the PIN again. Developers are expected to repeat the `getPin` method here and pass back the PIN again back to the SDK by calling  **ostPinAccept.pinEntered()** .

```
invalidPin( userId, ostPinAccept)
```

| Argument | Description |
|---|---|
| **userId**	|	Unique identifier of the user	|
| **OstPinAccept**	| **ostPinAccept.pinEntered()** should be called to again pass the PIN back to SDK. <br> For some reason if the developer wants to cancel the current workflow they can do it by calling **ostPinAccept.cancelFlow()**  |


<br>


### registerDevice
This function will be called by wallet SDK to register the device.<br>**Expected Function Definition:** Developers of client company are expected to register the device by communicating with client company's server. On client company's server they can use `Server SDK` to register this device in OST Platform. Once the device is registered on OST Platform client company's server will receive the newly created `device` entity. This device entity should be passed back to the `app`.<br>
Finally they should pass back this newly created device entity back to the wallet SDK by calling **OstDeviceRegistered.deviceRegistered( newDeviceEntity )**.

```
registerDevice( apiParams, ostDeviceRegistered)
```

| Argument | Description |
|---|---|
| **apiParams**	|	Device information for registration	|
| **OstDeviceRegistered**	| **OstDeviceRegistered.deviceRegistered( newDeviceEntity )** should be called to pass the newly created device entity back to SDK. <br>In case data is not verified the current workflow should be canceled by developer by calling **OstDeviceRegistered.cancelFlow()**  |



<br>

### verifyData
This function will be called by wallet SDK to verify data during `performQRAction` workflow.


```
verifyData( ostWorkflowContext, ostContextEntity, ostVerifyData)
```


| Argument | Description |
|---|---|
| **OstWorkflowContext**	| Information about the current workflow during which this callback will be called	|
| **OstContextEntity**	| Information about the entity |
| **OstVerifyData**	| **ostVerifyData.dataVerified()** should be called if the data is verified successfully. <br>In case data is not verified the current workflow should be canceled by developer by calling **ostVerifyData.cancelFlow()** |
