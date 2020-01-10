# OstWallet Settings

## Introduction

Application developer can incorporate in built `OstWalletSettings`. OstWalletSettings filters available workflows on the basis of current user and device status.

OstWalletSettings supports 13 workflows:

* Activate User
* Wallet Details
* Initialize Recovery
* Add Session
* Reset a User's PIN
* Get Mnemonic Phrase
* Authorize device using mnemonics
* Abort Device Recovery
* Revoke Device
* Scan QR Code to add another device
* Get Current Device QR code
* Enable Biometrics
* Disable Biometrics

## Usage

Developer can integrate wallet settings into application by importing

<b>eg. with react-navigation:</b>
```js
import {OstWalletSettingsComponent} from '@ostdotcom/ost-wallet-sdk-react-native';

let settingsStack = createStackNavigator(
  {
    WalletSettingScreen: OstWalletSettingsComponent
  }
);
```

While navigating to Settings page, passing `ostUserId` and `ostWalletUIWorkflowCallback` are mandetory.

<b>eg. with react-navigation:</b>
```js
const ostUserId = <APPLICATION-USER-OST-USER-ID>
const delegate = new OstWalletUIWorkflowCallback(ostUserId, {})
this.props.navigation.push("WalletSettingScreen", {'ostUserId': ostUserId, 'ostWalletUIWorkflowCallback': delegate});
```

><b>Note</b> <br/>
> Developer needs to create a class extends from `OstWalletUIWorkflowCallback`.<br/>
> Write logic to get passphrase prefix from mappy-server.

After receiving passphrase, call setPassphrase method of delegate `passphrasePrefixAccept`
```js
passphrasePrefixAccept.setPassphrase(passphrasePrefixString, currentUserOstId, () => {
      passphrasePrefixAccept.cancelFlow();
      workflowDelegate.saltFetchFailed(res);
});
```

else call `passphrasePrefixAccept.cancelFlow();`

## UI Modification

Navigation bar color scheme decided from [OstThemeConfig](./configs/ost-sdk-theme-config.js). 

OstWalletScreen component color schemes:

| Component | Property |
| -------------- | ------------ |
| Navigation bar background color | navigation_bar --> tint_color |
| Navigation bar title color | navigation_bar_header --> tint_color |
| Option title | c1 |
| Option description | c2 |
| Option seperator | cell_separator --> color |
| Wallet details link | link |
| Wallet details stauts | status |

## Settings Content

Developer can modify `header` and `description` of settings options. To modify contet, [refer here](./OstWalletSettingsConfig.md).

```js
import {OstWalletSettings} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";

let settingsContentConfig = {}

OstWalletSettings.setMasterConfig(settingsContentConfig)
```


