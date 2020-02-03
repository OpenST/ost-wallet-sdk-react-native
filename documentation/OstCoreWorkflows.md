# Ost Core Workflow APIs
Ost core workflows api do not use any UI components, thereby giving complete control to the developers. The [`OstWalletSdkUI`](./OstWalletUI.md) also uses Ost Core Workflows.

## Table of Contents

- [Import the OstWalletSdk](#import-the-ostwalletsdk)
- [Create Workflow Callback](#create-workflow-callback)
  - [OstWalletWorkFlowCallback Interface](#ostwalletworkflowcallback-interface)
  - [An example of callback implementation](#an-example-of-callback-implementation)
  - [Callback methods](#callback-methods)
    - [flowComplete](#flowcomplete)
    - [flowInterrupt](#flowinterrupt)
    - [requestAcknowledged](#requestacknowledged)
    - [getPin](#getpin)
    - [pinValidated](#pinvalidated)
    - [invalidPin](#invalidpin)
    - [registerDevice](#registerdevice)
    - [verifyData](#verifydata)
- [Execute Core Workflow APIs](#execute-core-workflow-apis)
  - [Core Workflow Methods](#core-workflow-methods)
    - [setupDevice](#setupdevice)
    - [activateUser](#activateuser)
    - [addSession](#addsession)
    - [executeTransaction](#executetransaction)
    - [getDeviceMnemonics](#getdevicemnemonics)
    - [authorizeCurrentDeviceWithMnemonics](#authorizecurrentdevicewithmnemonics)
    - [performQRAction](#performqraction)
    - [resetPin](#resetpin)
    - [initiateDeviceRecovery](#initiatedevicerecovery)
    - [abortDeviceRecovery](#abortdevicerecovery)
    - [logoutAllSessions](#logoutallsessions)
    - [revokeDevice](#revokedevice)
    - [updateBiometricPreference](#updatebiometricpreference)
  - [Execute a workflow](#execute-a-workflow)



## Import the OstWalletSdk
To use the core workflow APIs, import the `OstWalletSdk` from '@ostdotcom/ost-wallet-sdk-react-native'.
```javascript
import {OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
```

## Create Workflow Callback
The core workflows communicates with the application using callbacks. A base callback class `OstWalletWorkFlowCallback` is given as a part of the SDK. The base callback class gives only declaration of callback functions. A detailed overview of callback functions is available in the later part of this readme.

### OstWalletWorkFlowCallback Interface 

```javascript
import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';

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

**Developers are expected to implement a new class for each workflow.**

### An example of callback implementation

```javascript

import {OstWalletWorkFlowCallback} from '@ostdotcom/ost-wallet-sdk-react-native';

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

### Callback methods

#### flowComplete
This function will be called by SDK when a workflow is completed. The details of workflow and the entity that was updated during the workflow will be available in the arguments.

```
flowComplete( ostWorkflowContext, ostContextEntity)
```

| Argument | Description |
|---|---|
| **OstWorkflowContext**  | Information about the workflow  |
| **OstContextEntity**  | Information about the entity |

<br>

#### flowInterrupt
This function will be called by SDK when a workflow is cancelled. The workflow details and error details will be available in the arguments.

```
flowInterrupt( ostWorkflowContext, ostError)
```

| Argument | Description |
|---|---|
| **OstWorkflowContext**  | Information about the workflow |
| **OstError**  | ostError object will have details about the error that interrupted the flow |

<br>

#### requestAcknowledged
This function will be called by SDK when the core API request was successful which happens during the execution of workflows. At this stage the workflow is not completed but it shows that the main communication between the wallet SDK and Ost Platform server is complete. <br>Once the workflow is complete the `app` will receive the details in `flowComplete` (described below) function. 

```
requestAcknowledged( ostWorkflowContext, ostContextEntity)
```

| Argument | Description |
|---|---|
|  **OstWorkflowContext** | Information about the workflow  |
|  **OstContextEntity** | Information about the entity |

<br>


#### getPin
This function will be called by SDK when it needs to get the PIN from the `app` user to authenticate any authorised action.
<br>**Expected Function Definition:** Developers of client company are expected to launch their user interface to get the PIN from the user and pass this PIN back to SDK by calling **ostPinAccept.pinEntered()** 

```
getPin( userId, ostPinAccept)
```

| Argument | Description |
|---|---|
| **userId**  | Unique identifier of the user |
| **OstPinAccept**  | **ostPinAccept.pinEntered()** should be called to pass the PIN back to SDK. <br> For some reason if the developer wants to cancel the current workflow they can do it by calling **ostPinAccept.cancelFlow()** |

<br>

#### pinValidated
This function will be called by SDK when the last entered PIN is validated. 

```
pinValidated(userId)
```

| Argument | Description |
|---|---|
| **userId**  | Unique identifier of the user |

<br>

#### invalidPin
This function will be called by SDK when the last entered PIN was incorrect and `app` user has to provide the PIN again. Developers are expected to repeat the `getPin` method here and pass back the PIN again to the SDK by calling  **ostPinAccept.pinEntered()** .

```
invalidPin( userId, ostPinAccept)
```

| Argument | Description |
|---|---|
| **userId**  | Unique identifier of the user |
| **OstPinAccept**  | **ostPinAccept.pinEntered()** should be called to again pass the PIN back to SDK. <br>If, for some reason, the developer wants to cancel the current workflow they can do it by calling **ostPinAccept.cancelFlow()**  |

<br>

#### registerDevice
This function will be called by SDK to register the device. <br>**Expected Function Definition:** Developers of client company are expected to register the device by communicating with client company's server. On client company's server they can use `Server SDK` to register the device in Ost Platform. Once the device is registered on Ost Platform client company's server will receive the newly created `device` entity. This device entity should be passed back to the `app`.<br>
Finally developers should pass back the newly created device entity to the Wallet SDK by calling **OstDeviceRegistered.deviceRegistered( newDeviceEntity )**.

```
registerDevice( apiParams, ostDeviceRegistered)
```

| Argument | Description |
|---|---|
| **apiParams** | Device information for registration |
| **OstDeviceRegistered** | **OstDeviceRegistered.deviceRegistered( newDeviceEntity )** should be called to pass the newly created device entity back to SDK. <br>In case data is not verified, the current workflow should be canceled by developer by calling **OstDeviceRegistered.cancelFlow()**  |

<br>

#### verifyData
This function will be called by SDK to verify data during the `performQRAction` workflow.

```
verifyData( ostWorkflowContext, ostContextEntity, ostVerifyData)
```

| Argument | Description |
|---|---|
| **OstWorkflowContext**  | Information about the current workflow during which this callback will be called  |
| **OstContextEntity**  | Information about the entity |
| **OstVerifyData** | **ostVerifyData.dataVerified()** should be called if the data is verified successfully. <br>In case data is not verified, the current workflow should be canceled by developer by calling **ostVerifyData.cancelFlow()** |


## Execute Core Workflow APIs
### Core Workflow Methods
Create a new instance of the workflow callback implementation and invoke the required method.

#### setupDevice
This workflow needs userId and tokenId so setupDevice may be called after the user logs in to the application. Using a mapping between userId in Ost Platform and the app user, you have access to userId and tokenId.

If the user is logged in, then setupDevice should be called every time the app launches, this ensures that the current device is registered before communicating with Ost Platform server.

```javascript
 /**
   * Setup user device 
   * @param {String} userId - Ost User id
   * @param {String} tokenId - Id assigned by Ost to token
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
  OstWalletSdk.setupDevice(userId, tokenId, workflow)
```

#### activateUser
User activation refers to the deployment of smart-contracts that form the user's token wallet. An activated user can engage with a token. 

```javascript
/**
   * Add user session
   * @param {String} userId - Ost User id
   * @param {String} expiresAfterInSecs - session key expiry time. 
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
  OstWalletSdk.activateUser( userId, 
              pin, 
              passphrasePrefix, 
              expiresAfterInSecs, 
              spendingLimit, 
              workflow)

```

#### addSession
A session is a period of time during which a sessionKey is authorized to sign transactions under a pre-set limit per transaction on behalf of the user. The device manager, which controls the tokens, authorizes sessions.

```javascript
/**
     * Add user session
     * @param {String} userId - Ost User id
     * @param {String} expiresAfterInSecs - session key expiry time. 
     * @param {String} spendingLimit - spending limit once in a transaction of session
     * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
     * @public
     */
  OstWalletSdk.addSession( userId, 
            expireAfterInSecs, 
            spendingLimit, 
            workflow)
```


#### executeTransaction
A transaction where tokens are transferred from a user to another actor within are signed using sessionKey if there is an active session. In the absence of an active session, a new session is authorized.

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

  OstWalletSdk.executeTransaction( userId, 
                    tokenHolderAddresses, 
                    amounts, 
                    ruleName, 
                    meta, 
                    workflow)

```


#### getDeviceMnemonics
The mnemonic phrase represents a human-readable way to authorize a new device. This phrase is 12 words long. 

```javascript
/**
   * Get Device mnemonics 
   * @param {String} userId - Ost User id
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
  OstWalletSdk.getDeviceMnemonics( userId, 
                    workflow)

```

#### authorizeCurrentDeviceWithMnemonics
A user that has stored their mnemonic phrase can enter it on a new mobile device and authorize that device to be able to control their tokens.

```javascript
 /**
     * Authorize user device with mnemonics
     * @param {String} userId - Ost User id
     * @param {String} mnemonics - string of mnemonics
     * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
     * @public
     */

  OstWalletSdk.authorizeCurrentDeviceWithMnemonics(userId, 
                                    mnemonics, 
                                    workflow) 

```

#### performQRAction
QR codes can be used to encode transaction data for authorizing devices and making purchases via webstores, etc. This method can be used to process the information scanned off a QR code and act on it.

```javascript
/**
   * Perform QR action 
   * @param {String} userId - Ost User id
   * @param {String} data - Json string of payload is scanned by QR-Code.
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
  OstWalletSdk.performQRAction(userId, 
                data, 
                workflow) 
```

#### resetPin
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
  OstWalletSdk.resetPin( userId, 
          appSalt, 
          currentPin, 
          newPin, 
          workflow )
```

#### initiateDeviceRecovery
A user can control their tokens using their authorized device(s). If a user loses their authorized device, the user can recover access to her tokens by authorizing a new device by initiating the recovery process.

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
OstWalletSdk.initiateDeviceRecovery( userId, 
                        pin, 
                        appSalt,  
                        deviceAddressToRecover, 
                        workflow ) 
```

#### abortDeviceRecovery
To abort an initiated device recovery.

```javascript
/**
   * Abort device recovery 
   * @param {String} userId - Ost User id
   * @param {String} pin - user current pin
   * @param {String} appSalt - Passphrase prefix provided by application server
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
OstWalletSdk.abortDeviceRecovery(userId,  
                    pin ,  
                    appSalt , 
                    workflow ) 
```

#### logoutAllSessions
To revoke all sessions associated with provided userId.

```javascript
/**
   * Logout user all sessions  
   * @param {String} userId - Ost User id
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
OstWalletSdk.logoutAllSessions(userId, 
                  workflow )
```

#### revokeDevice
To unauthorize the current device.

```javascript
/**
   * revokeDevice
   * @param {String} userId - Ost User id
   * @param {String} deviceAddress - device address 
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
  OstWalletSdk.revokeDevice( userId , 
              deviceAddress , 
              workflow)

```

#### updateBiometricPreference
To enable or disable biometrics.

```javascript
/**
   * Update biometric prederence  
   * @param {String} userId - Ost User id
   * @param {boolean} enable - to enable biometric prefernce
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication 
   * @public
   */
  OstWalletSdk.updateBiometricPreference( userId , enable ,workflow )
```

### Execute a workflow

To execute a workflow, you need to pass an instance of `OstWalletSdkCallbackImplementation` class. The callback implementation will be different for each workflow available in the SDK.

```javascript

import OstWalletWorkflowCallback from './OstWalletSdkCallbackImplementation';

onLogoutAllSessions() {
    AsyncStorage.getItem('user').then((user) => {
        user = JSON.parse(user);
        // Note: logoutAllSessions will revoke all sessions keys from all the devices of the user.
        OstWalletSdk.logoutAllSessions(user.user_details.user_id, new OstWalletWorkflowCallback(), console.warn);
    });
}

```