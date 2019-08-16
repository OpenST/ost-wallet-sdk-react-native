# OST Wallet Sdk UI react native

## Introduction

For quick and easy integration with SDK, developers can use built-in User Interface Components which are themeable and support content customization.

## Setup

To setup OstWalletSdkUI, please refer [setup](README.md#setup).


## OstWalletSdkUI SDK APIs
### Important Notes
1. App must [initialize](README.md#installing-react-native-sdk) the sdk <em><b>before</b></em> initiating any UI workflows.
2. App must perform [setupDevice](README.md#1--subscribe-to-ostwalletsdkevents-in-your-top-most-level-component) workflow <em><b>before</b></em> initiating any UI workflows.


To use OstWalletSdkUI 
```
import {OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
```

### Set Theme Config

Theme for OstWalletSdkUI can be initialized by calling `setThemeConfig` API which setup OstWalletSdkUI theme config

`nav_bar_logo_image` is used to show image on navigation bar.

```javascript
const theme_config = {
    "nav_bar_logo_image": {
        "asset_name": "nav_bar_logo"
    }
};

/**
* Set theme config for UI
* config: Config to use for UI
*/
OstWalletSdkUI.setThemeConfig(theme_config);
```
<b>important</b><br/>
`asset_name` is name of asset which is present in the respective assets folder for iOS/android.


### Set Content Config

Content for OstWalletSdkUI can be initialized by calling `setContentConfig` API which setup OstWalletSdkUI content config

While activating user `create_pin["terms_and_condition_url"]` url is used to show terms and conditions, where as while confirming pin `confirm_pin["terms_and_condition_url"]` url is used.

```Swift
const content_config = {
    "activate_user": {
        "create_pin": {
            "terms_and_condition_url": "https://ost.com/terms"
        },
        "confirm_pin": {
            "terms_and_condition_url": "https://ost.com/terms"
        }
    }
};

/**
* Set content config for UI
* config: Config to use for UI
*/
OstWalletSdkUI.setContentConfig(content_config);
```

### Activate User
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

### Authorize Session

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

### Get Mnemonic Phrase

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

### Reset a User's PIN

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

### Initialize Recovery

A user can control their Brand Tokens using their authorized devices. If they lose their authorized device, they can recover access to their BrandTokens by authorizing a new device via the recovery process.

If application set `recoverDeviceAddress` then OstWalletUI ask for `pin` to initiate device recovery. Else it displays authorized device list for given `userId` to select device from. 

```javascript
/**
* Initiate device recovery 
* @param {String} userId - Ost User id
* @param {String} deviceAddressToRecover - Device address which wants to recover
* @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication 
* @public
*/
OstWalletSdkUI.initiateDeviceRecovery(
    userId,
    deviceAddressToRecover,
    uiCallback 
)
```

### Abort Device Recovery

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

### Revoke Device

To revoke device access.
```js
/**
   * Revoke device
   * @param {String} userId - Ost User id
   * @param {String} deviceAddressToRecover - Device address which wants to recover
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  revokeDevice(userId, deviceAddressToRevoke, uiCallback ) {
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    OstWalletSdkUI.revokeDevice( userId, deviceAddressToRevoke, coreUiCallback.uuid );
    return coreUiCallback.uuid;
  }
```

### Update Biometric Preference

This method can be used to enable or disable the biometric.
```js
/**
   * Update biometric prederence
   * @param {String} userId - Ost User id
   * @param {boolean} enable - to enable biometric prefernce
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  updateBiometricPreference( userId , enable , uiCallback ){
    let coreUiCallback = this._getCoreUiCallback(uiCallback);
    enable =  !!enable;
    OstWalletSdkUI.updateBiometricPreference( userId,  enable,  coreUiCallback.uuid  );
    return coreUiCallback.uuid;
  }
```

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

Unsubscribes the listner from the specified event of UI Workflow.

```javascript
/**
* Unsubscribes the listner from the specified event of UI Workflow.
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

# SDK UI WorkFlow Callbacks

Derive workflow implementation from  `OstWalletUIWorkflowCallback` class before calling any of the above workflows.

### Get User Passphrase
```javascript
/** Get server defined passphrase from user.
*
* @param {String} userId - Id of user whose passphrase is required.
* @param {Object} ostWorkflowContext - info about workflow type
* @param {OstPassphrasePrefixAccept} setPassphrase - Set passhrase which received from server
*/
getPassphrase( userId, ostWorkflowContext, OstPassphrasePrefixAccept) 
```
Once application gets passphrase prefix for provied `userId`, application should call  
```javascript
/** Set passphrase pefix received from server
*
OstPassphrasePrefixAccept.setPassphrase(
    passphrasePrefix, 
    userId
)
```
### Request Acknowledged
Acknowledge application about the request which is going to made by SDK.
```js
/**
   * Request acknowledged
   * @param {String} workflowId - Workflow id
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param ostContextEntity - info about entity
   * @override
   */
  requestAcknowledged(workflowId, ostWorkflowContext , ostContextEntity )
```

### Flow Complete
Inform SDK user that the flow is complete.
```js
/**
   * Flow complete
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(workflowId, ostWorkflowContext , ostContextEntity )
```

### Flow Interrupt
Use this listener to get flow interrupt update of UI workflow
```js
/**
   * Flow interrupt
   * @param {String} workflowId - Workflow id
   * @param ostWorkflowContext workflow type
   * @param ostError reason of interruption
   * @override
   */
  flowInterrupt(workflowId, ostWorkflowContext , ostError)
```
