# OST Wallet UI

## Introduction

Wallet UI SDK is useful to integrate OstWalletSdk in application with available UI components.
Please note, at the moment, UI features are only available in <em><b>beta</b></em> release.

## Setup

OstWalletUI is packaged along with OstWalletSdk and does not need additional setup steps.
Please follow the step provided [here](./README.md#installing-react-native-sdk).

## OstWalletUI APIs
### Important Notes
1. App must [initialize](./README.md#initialize) the sdk <em><b>before</b></em> initiating any UI workflows.
2. App must perform [setupDevice](./README.md#setupdevice) workflow <em><b>before</b></em> initiating any UI workflows.


To use the APIs you will first need to import the OstWalletSdk from 'ost-wallet-sdk-react-native' as below:
```js
import {OstWalletSdkUI} from '@ostdotcom/ost-wallet-sdk-react-native';
```

### Set Theme Config
Theme for OstWalletUI can be initialized by calling `OstWalletSdkUI.setThemeConfig` method.
```js
const ThemeConfig = {  
  "nav_bar_logo_image": {
    "asset_name": "YOUR_LOGO_ASSET_NAME"
  }
};
OstWalletSdkUI.setThemeConfig(ThemeConfig);
```
> `nav_bar_logo_image` is name of the asset. Please place the assets in both iOS and Android asset folder with same name.

### Set Content Config
The content on the views can be configured by calling `OstWalletSdkUI.setContentConfig` method.
```js
const ContentConfig = {
  /* Key: Workflow Id, Value: Screen Config Objects */
  "activate_user": {
    /* Key: Screen Id, Value: Screen Config. */
    "create_pin": {
      /* Key: Config Option Id */
      "terms_and_condition_url": "https://YOUR-WEB-SITE.com/terms"
    },
    "confirm_pin": {
      "terms_and_condition_url": "https://YOUR-WEB-SITE.com/terms"
    }
  }
};
OstWalletSdkUI.setContentConfig(ContentConfig);
```

### Setup your Passphrase Prefix Delegate

`Passphrase Prefix` is a salt provided by your application that assists in generation of User's recovery key using user's Pin.
This salt should be _unique for each user, is immutable and needs to be associated with the user. The salt should not unencrypted be 
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

### Activate User

User activation refers to the deployment of smart-contracts that form the user's Brand Token wallet. An activated user can engage with a Brand Token economy.<br/><br/>
**Parameters**<br/>
&nbsp;_userId: OST Platform user id provided by application server_<br/>
&nbsp;_expireAfterInSec: Session key validat duration_<br/>
&nbsp;_spendingLimit: Spending limit in a transaction in atto BT_<br/>
&nbsp;_passphrasePrefixDelegate: An instance of a class derived from `OstWalletUIWorkflowCallback` _<br/>

&nbsp;_Returns: Workflow Id(use to subscribe object to listen callbacks from perticular workflow id)_<br/>

```js
// UserPassphrasePrefixDelegateObject can be singleton or a new instance of each workflow.
const UserPassphrasePrefixDelegateObject = new UserPassphrasePrefixDelegate()

let workflowId = OstWalletSdkUI.activateUser(
    userId, /* Make sure to define and assign userId variable */
    1209600, /* 14 days */
    '1000000000000000000', /* spendingLimit */,
    UserPassphrasePrefixDelegateObject
);

//Store the workflowId, so that app can subscribe to events of the workflow.
```
### Initiate Recovery

A user can control their Brand Tokens using their authorized devices. If they lose their authorized device, they can recover access to their BrandTokens by authorizing a new device via the recovery process .<br/><br/>
**Parameters**<br/>
&nbsp;_userId: OST Platform user id provided by application server_<br/>
&nbsp;_recoverDeviceAddress: Device address which wants to recover. _<br/>
&nbsp;_passphrasePrefixDelegate: Callback implementation object to get passphrase prefix from application_<br/>

&nbsp;_Returns: Workflow Id(use to subscribe object to listen callbacks from perticular workflow id)_<br/>


> `recoverDeviceAddress` can be `null`. <br/> 
> If you have your own UI to select the device to revoke, set `recoverDeviceAddress` to the selected device address.<br/> 
> When `null` is passed, the Sdk will ask user to choose the device.<br/> 

```js
let workflowId = OstWalletUI.initiateDeviceRecovery(
    userId, /* Make sure to define and assign userId variable */
    recoverDeviceAddress, /* Make sure to define recoverDeviceAddress variable */
    UserPassphrasePrefixDelegateObject
);

//Store the workflowId, so that app can subscribe to events of the workflow.
```

### Abort Device Recovery
To abort device recovery.<br/><br/>
**Parameters**<br/>
&nbsp;_userId: OST Platform user id provided by application server_<br/>
&nbsp;_passphrasePrefixDelegate: Callback implementation object to get passphrase prefix from application_<br/>

&nbsp;_Returns: Workflow Id(use to subscribe object to listen callbacks from perticular workflow id)_<br/>

```js
let workflowId = OstWalletUI.abortDeviceRecovery(
    userId,
    UserPassphrasePrefixDelegateObject
);
```




