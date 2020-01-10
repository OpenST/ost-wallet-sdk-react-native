# OST Wallet React Native SDK UI

## Introduction
For quick and easy integration with SDK, developers can use built-in user interface components which are configurable and support content and theme customization. All OstWalletSdkUI workflows return `workflow-id`. The application can subscribe to the events of the workflow using the `workflow-id`.

## Setup
`OstWalletSdkUI` is packaged along with OstWalletSdk. There are no additional steps for using `OstWalletSdkUI`. To setup OstWalletSdk, please refer to [setup](../README.md#installing-react-native-sdk).

## Before We Begin
- App must [initialize](../README.md#initializing-the-sdk) the sdk <em><b>before</b></em> initiating any UI workflows.
- App must perform [setupDevice](../README.md#setupdevice) workflow <em><b>before</b></em> initiating any UI workflows.

## OstWalletSdkUI SDK APIs

To use OstWalletSdkUI 
```
import {OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
```

### Set Theme Config
Theme for OstWalletSdkUI can be initialized by calling `setThemeConfig` API which setup OstWalletSdkUI theme config. To define custom theme config, please refer to [Theme Config Android](https://github.com/ostdotcom/ost-wallet-sdk-android/blob/release-2.3/documentation/ThemeConfig.md)/[Theme Config iOS](https://github.com/ostdotcom/ost-wallet-sdk-ios/blob/release-2.3/documentation/ThemeConfig.md) documentation.

```js
    // Define the content config
    const theme_config = {
        "nav_bar_logo_image": { 
            "asset_name": "YOUR_LOGO_ASSET_NAME"
        }
    };

    /**
    * Set theme config for UI
    * config: Config to use for UI
    */
    OstWalletSdkUI.setThemeConfig(theme_config);
```
> * In the above example, `asset_name` is name of asset which is present in the respective assets folder for iOS/android.


### Set Content Config
Content for OstWalletSdkUI can be initialized by calling `setContentConfig` API which set-up OstWalletSdkUI content config.
To define custom content config, please refer to [Content Config Android](https://github.com/ostdotcom/ost-wallet-sdk-android/blob/release-2.3/documentation/ContentConfig.md)/[Content Config iOS](https://github.com/ostdotcom/ost-wallet-sdk-ios/blob/release-2.3/documentation/ContentConfig.md) documentation.

```js
    // Please update terms_and_condition.url as per your needs.
    const content_config = {
        "activate_user": {
            "create_pin": {
                "placeholders": {
                    "terms_and_condition": {
                        "url": "https://YOUR-WEB-SITE.com/terms-page"
                    }
                }
            },
            "confirm_pin": {
                "placeholders": {
                    "terms_and_condition": {
                        "url": "https://YOUR-WEB-SITE.com/terms-page"
                    }
                }
            }
        }
    };

    /**
    * Set content config for UI
    * config: Config to use for UI
    */
    OstWalletSdkUI.setContentConfig(content_config);
```
### Set Loader Manager

Application loader for OstWalletUI can be initialized by calling `setLoaderManager` API. This API is available in native SDK. <br/><br/>
Custom loader is supported from OstWalletSdk-native version Android v`2.3.6` Or iOS v`2.3.5`<br/>
Please, verify OstWalletSdk version in `Cartfile`.
<br/><br/>
Custom loader needs to be written in native code (java, swift/Objective-C).<br/>
Sample code for custom loader is available in respective platform directory. For [iOS](https://github.com/ostdotcom/ost-wallet-sdk-ios/blob/release-2.3/Samples/CustomLoader/OstMockCustomLoader.md) and [Android](https://github.com/ostdotcom/ost-wallet-sdk-android/blob/develop/Samples/customloader/OstCustomLoader.md)


### Setup your Passphrase Prefix Delegate
`Passphrase Prefix` is a salt provided by your application that assists in generation of User's recovery key using user's PIN.
This salt should be _unique_ for each user, is immutable and needs to be associated with the user. The salt should not be stored in memory or on deivce unencrypted. When the UI workflow need's to ask for user's PIN, delegate's getPassphrase method is invoked.

The delegate must be derived from `OstWalletUIWorkflowCallback` class.

Here is an example:
```javascript
import { OstWalletUIWorkflowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
class UserPassphrasePrefixDelegate extends OstWalletUIWorkflowCallback {
  constructor() {
    super();
  }

  getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept) {
    let fetchPromise = new Promise((resolve,reject) => {
        //Write code here to validate userId. 
        //If it is not the same as that of the logged-in user, reject the promise.
        
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

  /**
   *  Optional Callback Implementation
   *  --------------------------------
   *  
   *  Application can also define and use following callback methods:
   *  - requestAcknowledged(ostWorkflowContext , ostContextEntity )
   *  - flowComplete(ostWorkflowContext , ostContextEntity )
   *  - flowInterrupt(ostWorkflowContext , ostError)
   *
   *  Note:
   *  These methods can be helpful for debugging. 
   *  Defining these methods does NOT impact ui workflow event subscription in any way.
   *  If application subscribes to events and also defines these callbacks, both shall be invoked.
   */

  requestAcknowledged(ostWorkflowContext , ostContextEntity ) {
      console.log("Received requestAcknowledged callback");

      let contextWorkflowId = ostWorkflowContext.WORKFLOW_ID;
      let workflowType = ostWorkflowContext.WORKFLOW_TYPE;
      let entityType = ostContextEntity.entityType;
      let entityData = ostContextEntity.entity;

      console.log("- Workflow Id:", contextWorkflowId);
      console.log("- Workflow Type:", workflowType);
      console.log("- OstContextEntity type:", entityType)
      console.log("- OstContextEntity entityData:", entityData);
  }

  flowComplete(ostWorkflowContext , ostContextEntity ) { 
      console.log("Received flowComplete callback");

      let contextWorkflowId = ostWorkflowContext.WORKFLOW_ID;
      let workflowType = ostWorkflowContext.WORKFLOW_TYPE;
      let entityType = ostContextEntity.entityType;
      let entityData = ostContextEntity.entity;

      console.log("- Workflow Id:", contextWorkflowId);
      console.log("- Workflow Type:", workflowType);
      console.log("- OstContextEntity type:", entityType)
      console.log("- OstContextEntity entityData:", entityData);
  }

  flowInterrupt(ostWorkflowContext , ostError) {
      console.log("Received flowInterrupt callback");

      let contextWorkflowId = ostWorkflowContext.WORKFLOW_ID;
      let workflowType = ostWorkflowContext.WORKFLOW_TYPE;
      let errorData = ostError.error;
      let errorCode = ostError.getErrorCode();
      
      // If you would like to reach out to Ost Devs for support, 
      // we request you to collect internalErrorCode
      let internalErrorCode = ostError.getInternalErrorCode();
      let isApiError = ostError.isApiError();

      console.log("- Workflow Id:", contextWorkflowId);
      console.log("- Workflow Type:", workflowType);
      console.log("- Error");
      console.log("  - Error Code:", errorCode);
      console.log("  - Is Api Error:", isApiError);
      console.log("  - Sdk Internal Error Code", internalErrorCode);
      console.log("  - error data", errorData);

      if ( isApiError && ostError.isApiSignerUnauthorized() ) {
          console.log("- This device has either been revoked or not yet registered.");
      } else if ("WORKFLOW_CANCELED" === errorCode.toUpperCase() ) {
          console.log("- This error can be ignored. The workflow has been canceled by the user or application");
      }
  }
}
export default UserPassphrasePrefixDelegate;
```

### Ost Wallet Settings

OstWallet Settings is a pre-built UI Component available exclusively available in `ost-wallet-sdk-react-native` Sdk. It is a wallet settings page that can be used by end-users to perfrom different wallet operations(Ost Wallet UI Workflows). For details [check here](./OstWalletSettings.md)

### Ost Wallet UI Workflows

#### Activate User
User activation refers to the deployment of smart-contracts that form the user's token wallet. An activated user can engage with a token.

```javascript

let uiCallback = new UserPassphrasePrefixDelegate()

/**
* Activate user
* @param {String} userId - Ost User id
* @param {String} expiresAfterInSecs - session key expiry time.
* @param {String} spendingLimit - spending limit once in a transaction of session
* @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
* @public
*/
let workflowId = OstWalletSdkUI.activateUser(
    userId,     
    expiresAfterInSecs,
    spendingLimit, 
    uiCallback
);

// Subscribe to events
OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
  // User is being activated. At this point, user can neither receive or send tokens.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
  // Show success message to user.
  // User has been activated. User can now start receiving tokens.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
  // Show error to user.
  // An error occoured during the workflow. The user has NOT been activated.
});

```

#### Add Session
A session is a period of time during which a sessionKey is authorized to sign transactions under a pre-set limit per transaction on behalf of the user. The device manager, which controls the tokens, authorizes sessions.
```js

let uiCallback = new UserPassphrasePrefixDelegate()

/**
   * Add user session
   * @param {String} userId - Ost User id
   * @param {String} expiresAfterInSecs - session key expiry time.
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
let workflowId = OstWalletSdkUI.addSession(
    userId, 
    expiresAfterInSecs, 
    spendingLimit, 
    uiCallback
) 

// Subscribe to events
OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
  // Session is being added.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
  // Show success message to user.
  // Session has been added.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
  // Show error to user.
  // An error occoured during the workflow. The Session has NOT been added.
});
```

#### Get Mnemonic Phrase
The mnemonic phrase represents a human-readable way to authorize a new device. This phrase is 12 words long.
```js
let uiCallback = new UserPassphrasePrefixDelegate()

/**
   * Get device mnemonics
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
let workflowId = OstWalletSdkUI.getDeviceMnemonics(
    userId, 
    uiCallback
)

// Subscribe to events
OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
  // Show success message to user.
  // User has seen the mnemonics
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
  // Show error to user.
  // An error occoured during the workflow.
});
```

#### Reset a User's PIN
The user's PIN is set when activating the user. This method supports re-setting a PIN and re-creating the recoveryOwner as part of that.
```js

let uiCallback = new UserPassphrasePrefixDelegate()

/**
   * Reset pin
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   */
let workflowId = OstWalletSdkUI.resetPin(
    userId, 
    uiCallback
)

// Subscribe to events
OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
  // Pin is being reset.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
  // Show success message to user.
  // Workflow completed successfully.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
  // Show error to user.
  // An error occoured during the workflow. 
});
```

#### Initiate Recovery
A user can control their tokens using their authorized device(s). If the user loses their authorized device, she can recover access to their tokens by authorizing a new device via the recovery process.

If application set `recoverDeviceAddress` then OstWalletUI ask for `pin` to initiate device recovery. Else it displays authorized device list for given `userId` to select device from. 

```javascript

let uiCallback = new UserPassphrasePrefixDelegate();

/**
* Initiate device recovery 
* @param {String} userId - Ost User id
* @param {String} recoverDeviceAddress - Device address which wants to recover
* @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication 
* @public
*/
let workflowId = OstWalletSdkUI.initiateDeviceRecovery(
    userId,
    recoverDeviceAddress,
    uiCallback 
)

// Subscribe to events
OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
  // Device recovery has been initiated. 
  // The device will be recovered after 12 hours.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
  // Show success message to user.
  // Device recovery has been initiated. 
  // The device will be recovered after 12 hours.
});

OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
  // Show error to user.
  // An error occoured during the workflow. 
});

```

> `recoverDeviceAddress` can be `null`. <br/> 
> If you have your own UI to select the device to revoke, set `recoverDeviceAddress` to the selected device address.<br/> 
> When `null` is passed, the Sdk will ask user to choose the device using built-in device list UI.<br/> 


#### Abort Device Recovery
To abort initiated device recovery.

```javascript

  let uiCallback = new UserPassphrasePrefixDelegate();

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

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
    // Request has been acknowledged by OST Platform.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Device recovery has been aborted.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });

```

#### Revoke Device
To revoke device access.
```js

  let uiCallback = new UserPassphrasePrefixDelegate();

  /**
   * Revoke device
   * @param {String} userId - Ost User id
   * @param {String} deviceAddressToRevoke - Device address which wants to recover
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  let workflowId = OstWalletSdkUI.revokeDevice(userId, deviceAddressToRevoke, uiCallback );

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
    // Request has been acknowledged by OST Platform.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Device has been revoked.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });

```
> `deviceAddressToRevoke` can be `null`. <br/> 
> If you have your own UI to select the device to revoke, set `deviceAddressToRevoke` to the selected device address.<br/> 
> When `null` is passed, the Sdk will ask user to choose the device using built-in device list UI.<br/> 


#### Update Biometric Preference
To enable or disable the biometric.
```js

  let uiCallback = new UserPassphrasePrefixDelegate();
  let shouldEnable = true;

  /**
   * Update biometric preference
   * @param {String} userId - Ost User id
   * @param {boolean} shouldEnable - pass true to enable biometic preference, false to disable.
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
  let workflowId = OstWalletSdkUI.updateBiometricPreference( userId, shouldEnable, uiCallback );

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Preference has been updated.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });
```

#### Authorize Current Device With Mnemonics
To add a new device using 12 words recovery phrase.

```js

  let uiCallback = new UserPassphrasePrefixDelegate();
  /**
   * Authorize user device with mnemonics
   * @param {String} userId - Ost User id
   * @param {OstWalletWorkFlowCallback} workflow - callback implementation instances for application communication
   * @public
   */
  let workflowId = OstWalletSdkUI.authorizeCurrentDeviceWithMnemonics(userId, uiCallback);

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
    // Request has been acknowledged by OST Platform.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Device has been authorized.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });
```

#### Get Add Device QR-Code
To show QR-Code to scan from another authorized device

```js

  let uiCallback = new UserPassphrasePrefixDelegate();

  /**
   * Get add device QR code
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
   let workflowId = OstWalletSdkUI.getAddDeviceQRCode(userId, uiCallback);

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
    // Current Device is being authorized.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Current Device has been authorized.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });
```

### Scan QR-Code to Authorize Device
To authorize device by scanning device QR-Code. 

QR-Code Sample:
```json
{
    "dd":"AD",
    "ddv":"1.1.0",
    "d":{
        "da": "0x7701af46018fc57c443b63e839eb24872755a2f8"
    }
}
```

```js
  let uiCallback = new UserPassphrasePrefixDelegate();

  /**
   * Scan QR-Code to authorize device
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
   let workflowId = OstWalletSdkUI.scanQRCodeToAuthorizeDevice(userId, uiCallback);

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
    // Device is being authorized.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Device has been authorized.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });
```
### Execute Transaction

* <b> By Scanning QR-Code </b> <br />
To execute transaction via device by scanning device QR-Code.

QR-Code Sample:
```json
{
    "dd":"TX",
    "ddv":"1.1.0",
    "d":{
        "rn":"direct transfer",
        "ads":[
            "0x7701af46018fc57c443b63e839eb24872755a2f8",
            "0xed09dc167a72d939ecf3d3854ad0978fb13a8fe9"
        ],
        "ams":[
            "1000000000000000000",
            "1000000000000000000"
        ],
        "tid": 1140,
        "o":{
                "cs":"USD",
                "s": "$"
        }
    },
    "m":{
        "tn":"comment",
        "tt":"user_to_user",
        "td":"Thanks for comment"
    }
}
```
```js

  let uiCallback = new UserPassphrasePrefixDelegate();

  /**
   * Scan QR-Code to execute transaction
   *
   * @param {String} userId - Ost User id
   * @param {OstWalletUIWorkflowCallback} uiCallback - callback implementation instances for application communication
   * @public
   */
   let workflowId = OstWalletSdkUI.scanQRCodeToExecuteTransaction(userId, uiCallback);

  // Subscribe to events
  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, () => {
    // Transaction is being executed.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
    // Show success message to user.
    // Transaction has been executed successfully.
  });

  OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
    // Show error to user.
    // An error occoured during the workflow. 
  });
```

* <b>By Calling function</b> <br />
Helper method creates session if active sessoin for transction amount is not available. To execute transaction via helper method, [ref here](./OstTransactionHelper.md)

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
