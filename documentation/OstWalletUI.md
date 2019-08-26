# OST Wallet Sdk UI react native

## Introduction

For quick and easy integration with SDK, developers can use built-in User Interface Components which are themeable and support content customization.

## Setup

To setup OstWalletSdkUI, please refer [setup](../README.md#installing-react-native-sdk).


## Before We Begin
- App must [initialize](../README.md#initialize) the sdk <em><b>before</b></em> initiating any UI workflows.
- App must perform [setupDevice](../README.md#setupdevice) workflow <em><b>before</b></em> initiating any UI workflows.


## OstWalletSdkUI SDK APIs

To use OstWalletSdkUI 
```
import {OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
```

### Set Theme Config

Theme for OstWalletSdkUI can be initialized by calling `setThemeConfig` API which setup OstWalletSdkUI theme config. To define custom theme config, please refer [ThemeConfig](https://github.com/ostdotcom/ost-wallet-sdk-android/blob/release-2.3/documentation/ThemeConfig.md) documentation.


```js
/**
* Set theme config for UI
* config: Config to use for UI
*/
OstWalletSdkUI.setThemeConfig(theme_config);
```
<b>important</b><br/>
`asset_name` is name of asset which is present in the respective assets folder for iOS/android.


### Set Content Config

Content for OstWalletSdkUI can be initialized by calling `setContentConfig` API which setup OstWalletSdkUI content config.
To define custom content config, please refer [ContentConfig](https://github.com/ostdotcom/ost-wallet-sdk-android/blob/release-2.3/documentation/ContentConfig.md) documentation.

While activating user `create_pin["terms_and_condition_url"]` url is used to show terms and conditions, where as while confirming pin `confirm_pin["terms_and_condition_url"]` url is used.

```js
/**
* Set content config for UI
* config: Config to use for UI
*/
OstWalletSdkUI.setContentConfig(content_config);
```

### Setup your Passphrase Prefix Delegate

`Passphrase Prefix` is a salt provided by your application that assists in generation of User's recovery key using user's Pin.
This salt should be _unique_ for each user, is immutable and needs to be associated with the user. The salt should not unencrypted be 
stored in memory or on deivce. When the UI workflow need's to ask for user's Pin, delegate's getPassphrase method is invoked.
The delegate must be derived from `OstWalletUIWorkflowCallback` class.

Here is an example:
```js
import { OstWalletUIWorkflowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
class UserPassphrasePrefixDelegate extends OstWalletUIWorkflowCallback {
  constructor() {
    super();
  }
  getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) {
    let fetchPromise = new Promise((resolve,reject) => {
        //Write code here to validate userId. 
        //If it is not same as that of the logged-in user, reject the promise.
        
        //Write code here to fetch the salt from your server.
        //Read the passphrasePrefix from response and resolve the Promise. 
    });
    fetchPromise
      .then((passphrasePrefix) => {
        OstPassphrasePrefixAccept.setPassphrase(passphrasePrefix, userId, (error) => {
          console.warn(error);
        });
      })
      .catch((err) => {
          // Cancel the workflow.
          OstPassphrasePrefixAccept.cancelFlow();
      });
  }
}
export default UserPassphrasePrefixDelegate;
```

### Ost Wallet UI Workflows

#### Activate User
User activation refers to the deployment of smart-contracts that form the user's Brand Token wallet. An activated user can engage with a Brand Token economy.

```javascript
/**
* Activate user
* @param {String} userId - Ost User id
* @param {String} expiresAfterInSecs - session key expiry time.
* @param {String} spendingLimit - spending limit once in a transaction of session
* @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
* @public
*/
OstWalletSdkUI.activateUser(
    userId,     
    expiresAfterInSecs,
    spendingLimit, 
    uiCallback
)
```

#### Add Session

A session is a period of time during which a sessionKey is authorized to sign transactions under a pre-set limit on behalf of the user. The device manager, which controls the tokens, authorizes sessions.
```js
/**
   * Add user session
   * @param {String} userId - Ost User id
   * @param {String} expiresAfterInSecs - session key expiry time.
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  addSession(userId, expiresAfterInSecs, spendingLimit, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.addSession(userId, String(expiresAfterInSecs), String(spendingLimit), coreUiCallback.uuid);
    return coreUiCallback.uuid;
  }
```

#### Get Mnemonic Phrase

The mnemonic phrase represents a human-readable way to authorize a new device. This phrase is 12 words long.
```js
/**
   * Get device mnemonics
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  getDeviceMnemonics(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.getDeviceMnemonics( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }
```

#### Reset a User's PIN

The user's PIN is set when activating the user. This method supports re-setting a PIN and re-creating the recoveryOwner as part of that.
```js
/**
   * Reset pin
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   */
  resetPin(userId, uiCallback) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.resetPin( userId, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }
```

#### Initiate Recovery

A user can control their Brand Tokens using their authorized devices. If they lose their authorized device, they can recover access to their BrandTokens by authorizing a new device via the recovery process.

If application set `recoverDeviceAddress` then OstWalletUI ask for `pin` to initiate device recovery. Else it displays authorized device list for given `userId` to select device from. 

```javascript
/**
* Initiate device recovery 
* @param {String} userId - Ost User id
* @param {String} recoverDeviceAddress - Device address which wants to recover
* @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication 
* @public
*/
OstWalletSdkUI.initiateDeviceRecovery(
    userId,
    recoverDeviceAddress,
    uiCallback 
)
```

> `recoverDeviceAddress` can be `null`. <br/> 
> If you have your own UI to select the device to revoke, set `recoverDeviceAddress` to the selected device address.<br/> 
> When `null` is passed, the Sdk will ask user to choose the device using built-in device list UI.<br/> 


#### Abort Device Recovery

To abort initiated device recovery.

```javascript
/**
* Abort device recovery 
* @param {String} userId - Ost User id
* @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication 
* @public
*/
OstWalletSdkUI.abortDeviceRecovery( 
    userId, 
    uiCallback
) 
```

#### Revoke Device

To revoke device access.
```js
/**
   * Revoke device
   * @param {String} userId - Ost User id
   * @param {String} deviceAddressToRevoke - Device address which wants to recover
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  revokeDevice(userId, deviceAddressToRevoke, uiCallback ) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.revokeDevice( userId, deviceAddressToRevoke, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }
```
> `deviceAddressToRevoke` can be `null`. <br/> 
> If you have your own UI to select the device to revoke, set `deviceAddressToRevoke` to the selected device address.<br/> 
> When `null` is passed, the Sdk will ask user to choose the device using built-in device list UI.<br/> 


#### Update Biometric Preference

This method can be used to enable or disable the biometric.
```js
/**
   * Update biometric prederence
   * @param {String} userId - Ost User id
   * @param {boolean} enable - to enable biometric prefernce
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  updateBiometricPreference( userId, enable, uiCallback ){
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    enable =  !!enable;
    OstWalletSdkUI.updateBiometricPreference( userId,  enable,  coreUiCallback.uuid  );
    return coreUiCallback.uuid;
  }
```

##  Ost Wallet UI Events and Listeners

### Subscribe

Subscribe to specified event of UI Workflow

Supported `EventName` are:
* requestAcknowledged
* flowComplete
* flowInterrupt

You can retrive event names from Sdk:
```javascript
OstWalletSdkUI.EVENTS.requestAcknowledged
OstWalletSdkUI.EVENTS.flowComplete
OstWalletSdkUI.EVENTS.flowInterrupt
```

```javascript
/**
* Subscribes to specified event of UI Workflow.
* @param {String} workflowId - Id of the workflow as returned by methods of OstWalletSdkUI
* @param {String} eventName - Name of the event to subscribe to.
* @param {Function} listener - The listener function.
* @param {*} context - The context to invoke the listener with.
* @returns {Boolean} - false if failed to subscribe.
* @public
*/
OstWalletSdkUI.subscribe(
    workflowId, 
    eventName, 
    listener, 
    context
)
```

```javascript
/**
* Subscribes once to specified event of UI Workflow.
* @param {String} workflowId - Id of the workflow as returned by methods of OstWalletSdkUI
* @param {String} eventName - Name of the event to subscribe to.
* @param {Function} listener - The listener function.
* @param {*} context - The context to invoke the listener with.
* @returns {Boolean} - false if failed to subscribe.
* @public
*/
OstWalletSdkUI.subscribeOnce(
    workflowId, 
    eventName, 
    listener,
    context
)
```


### Unsubscribe

Unsubscribes the listener from the specified event of UI Workflow.

```javascript
/**
* Unsubscribes the listener from the specified event of UI Workflow.
* @param {String} workflowId - Id of the workflow as returned by methods of OstWalletSdkUI
* @param {String} eventName - Name of the event to subscribe to.
* @param {Function} listener - The listener function.
* @param {*} context - The context to invoke the listener with.
* @returns {Boolean} - false if failed to subscribe.
* @public
*/
OstWalletSdkUI.unsubscribe(
    workflowId, 
    eventName,
    listener, 
    context
)
```

### Event Listeners

#### Request Acknowledged Listener
Acknowledge application about the request which is going to made by SDK.
```js
/**
   * Request acknowledged
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param ostContextEntity - info about entity
   * @override
   */
  requestAcknowledged(ostWorkflowContext, ostContextEntity ) => {
    //ostWorkflowContext.WORKFLOW_ID gives the id of the workflow.
    //ostWorkflowContext.WORKFLOW_TYPE gives the type of the workflow.
  }
```

#### Flow Complete Listener
```js
/**
   * Flow complete
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(ostWorkflowContext, ostContextEntity ) => {
    //ostWorkflowContext.WORKFLOW_ID gives the id of the workflow.
    //ostWorkflowContext.WORKFLOW_TYPE gives the type of the workflow.
  }
```

#### Flow Interrupt Listener
```js
/**
   * Flow interrupt
   * @param ostWorkflowContext workflow type
   * @param ostError reason of interruption
   * @override
   */
  flowInterrupt(ostWorkflowContext, ostError) => {
    //ostWorkflowContext.WORKFLOW_ID gives the id of the workflow.
    //ostWorkflowContext.WORKFLOW_TYPE gives the type of the workflow.
  }
```


