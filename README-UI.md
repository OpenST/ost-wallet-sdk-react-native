# OST Wallet Sdk UI react native

## Introduction

Wallet UI SDK is useful to integrate OstWalletSdk in application with available UI components.
Please note, at the moment, UI features are only available in <em><b>beta</b></em> release.

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

Theme for OstWalletUI can be initialized by calling `setThemeConfig` API which setup OstWalletUI theme config

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

Content for OstWalletUI can be initialized by calling `setContentConfig` API which  setup OstWalletUI content config

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

### Initialize Recovery

A user can control their Brand Tokens using their authorized devices. If they lose their authorized device, they can recover access to their BrandTokens by authorizing a new device via the recovery process .<br/><br/>

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


### Subscribe 

Subscribe to specified event of UI Workflow

Supported `EventName` is:
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
