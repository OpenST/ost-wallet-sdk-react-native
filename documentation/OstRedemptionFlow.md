# OstRedemption Flow

## Introduction

OstRedemption component is a pre-built UI component available exclusively in `ost-wallet-sdk-react-native` SDK.
It consist two pages - one displaying redeemable product list and another displaying product details and redemption options. It can be used by end-users to integrate redemption flow into their app.
> <b>IMPORTANT:</b> This feature requires application to use [React Navigation](https://reactnavigation.org/docs/en/getting-started.html) package.

## Usage

### Create Redemption Flow stack navigation

```js
import {OstRedeemableSkus, OstRedeemableSkuDetails } from '@ostdotcom/ost-wallet-sdk-react-native';

let redemptionStack = createStackNavigator(
  {
    RedeemableSkusScreen: OstRedeemableSkus,
    RedeemableSkuDetails: OstRedeemableSkuDetails
  }
);
```

### Naviagte to settings page
`ostUserId` and `ostWalletUIWorkflowCallback` are mandetory parameters that need to be passed as params to the `WalletSettingScreen` screen.
```js
const ostUserId = <APPLICATION-USER-OST-USER-ID>
const delegate = new OstWalletUIWorkflowCallback(ostUserId, {})
this.props.navigation.push("WalletSettingScreen", {'ostUserId': ostUserId, 'ostWalletUIWorkflowCallback': delegate});
```

><b>Note</b> <br/>
> Developer needs to create a class extends from `OstWalletUIWorkflowCallback` and write logic to get passphrase prefix from their application server.
> Please refer [this](OstWalletUI.md#setup-your-passphrase-prefix-delegate) section for documentation.

## UI Customization

Developer can customize wallet settings by updating respective properties mentioned in image. OstTheme config shown [here](./configs/ost-sdk-theme-config.js)

![copy-framework-file](images/wallet_settings.png)
![copy-framework-file](images/wallet_details.png)

## Settings Content

Developer can modify `header` and `description` of settings options. To modify contet, [refer here](./OstWalletSettingsConfig.md).

```js
import {OstWalletSettings} from "@ostdotcom/ost-wallet-sdk-react-native/js/index";

let settingsContentConfig = {}

OstWalletSettings.setMasterConfig(settingsContentConfig)
```


