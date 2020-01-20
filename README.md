
# Ost Wallet SDK React Native

## Introduction

Ost React Native Wallet SDK is the official Ost Wallet SDK for react-native platform. The SDK is a mobile application development SDK that enables developers to integrate the functionality of a non-custodial crypto-wallet into consumer applications. 

Ost React Native Wallet SDK...

* Safely generates and stores keys on the user's mobile device
* Signs ethereum transactions and data as defined by contracts using EIP-1077
* Enables users to recover access to their Brand Tokens in case the user loses their authorized device


## Table of Contents

- [Installing React-native SDK](#installing-react-native-sdk)
- [Migrating to another version](#migrating-to-another-version)
- [SDK Usage](#sdk-usage)
  * [Initializing the SDK](#initializing-the-sdk)
  * [Initializing SDK With Config](#initializing-sdk-with-config)
- [Getter Methods](#getter-methods)
- [Ost JSON APIs](#ost-json-apis)
- [Intermediate Usage - Ost Wallet SDK UI](#intermediate-usage---ost-wallet-sdk-ui)
- [Expert Usage - Ost Wallet Core Workflow APIs](#expert-usage---ost-wallet-core-workflow-apis)


## Installing React-native SDK

1. Install React Native and create a react-native project

Follow this [official react-native getting started guide](https://facebook.github.io/react-native/docs/0.59/getting-started) to install react native and create a react-native project

2. Install Ost React Native SDK in your project
Run following command in your react-native project root

```bash
 npm install @ostdotcom/ost-wallet-sdk-react-native
```

The sdk needs [eventemitter3](https://github.com/primus/eventemitter3) as peer-dependency. To install `eventemitter3`, run following command in your react-native project root
```bash
 npm install eventemitter3
```

3. Linking the Ost React Native SDk with your project

```bash
 react-native link @ostdotcom/ost-wallet-sdk-react-native
```

4. [Android set-up for Ost React Native SDK](./documentation/android_setup.md)

5. [iOS Set-up for Ost React Native SDK](./documentation/ios_setup.md)

## Migrating to another version
If you decide to change the SDK version, please make sure to update the downsteam native SDKs.

For Android, please run:
```shell
react-native link
react-native run-android
```

For iOS, please update the `ios/Cartfile` with desired version and run:
```shell
carthage update --cache-builds --platform ios
```
After updating the SDK, please delete `ostwalletrnsdk` using the **Remove References** option and add it back by following [this step](./documentation/ios_setup.md#5-add-additional-sdk-files).

## SDK Usage
* Initialize the SDK
* Subscribe to events
* Implement `OstWalletWorkFlowCallback` for a workflow
* Execute workflow

### Initializing the SDK
You must initialize the SDK before using it.
> Initialize the SDK in using BASE_URL (Ost Platform endpoint) inside App.js `constructor()` method.

```javascript
/**
   * Initialize wallet sdk
   * @param {String} endpoint - Ost Platform endpoint
   * @param {function} Callback function with error and success status.
   * @public
   */
  OstWalletSdk.initialize( endpoint, 
            (error, success) => {})
```

### Initializing SDK With Config
Starting version `2.3.1` application can also pass SDK config in the initialize method
> If config is passed in `initialize` method, the configs specified in `OstWalletSdk.plist` and `ost-mobilesdk.json` are ignored. 
> It is no longer mandatory to define `ost-mobilesdk.json` and `OstWalletSdk.plist` files.

```javascript
  let sdkConfig = {
    "BLOCK_GENERATION_TIME": 3,
    "PIN_MAX_RETRY_COUNT": 3,
    "REQUEST_TIMEOUT_DURATION": 60,
    "SESSION_BUFFER_TIME": 3600,
    "PRICE_POINT_CURRENCY_SYMBOL": "USD",
    "USE_SEED_PASSWORD": false,
    "NO_OF_SESSIONS_ON_ACTIVATE_USER": 1,
    "ENABLE_IOS_DEVICE_RESTORE": false
  };

  /**
  * Initialize wallet sdk
  * @param {String} endpoint - Ost Platform endpoint
  * @param {Object} config (optional) - SDK Config. Supported from version 2.3.1
  * @param {function} callback -   A typical node-style, error-first callback.
  * @callback params {Object}error , {Boolean} success
  * @public
  */
  OstWalletSdk.initialize( endpoint, sdkConfig, (error, success) => {

  });
```

### Subscribe to `OstWalletSdkEvents` in your top most level component

In the most top level component (mostly `App.js`) import like this:
```javascript
import { OstWalletSdkEvents, OstWalletSdk, OstWalletSdkUI, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
```

In `componentDidMount()` subscribe to OstWalletSdkEvents and in `componentWillUnmount()` unsubscribe to OstWalletSdkEvents. Also initialize the SDK in using BASE_URL (Ost Platform endpoint) `constructor()` method:

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

## Getter Methods
The SDK provides getter methods that applications can use for various purposes. 
These methods provide the application with data as available in the device's database.
Please refer to [Ost Wallet SDK Getter Methods](./documentation/OstWalletSdkGetMethods.md) for documentation.

## Ost JSON APIs
While the getter methods provide application with data stored in device's database, the JSON API methods make API calls to Ost Platform servers. 
Please refer to [Ost JSON API](./documentation/OstJsonApi.md) for documentation.

## Intermediate Usage - Ost Wallet SDK UI
For quick and easy integration with SDK, developers can use built-in user-interface components which are configurable and support content and theme customization. 

Please refer to [Ost Wallet SDK UI ](./documentation/OstWalletUI.md) for documentation.

## Expert Usage - Ost Wallet Core Workflow APIs
Ost core workflows api do not use any UI components, thereby giving complete ux control to the developers. The [`OstWalletSdkUI`](./documentation/OstWalletUI.md) also uses Ost core workflows.

Please refer to [Ost Core Workflow APIs](./documentation/OstCoreWorkflows.md) for documentation.
