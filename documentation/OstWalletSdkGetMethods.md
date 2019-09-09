# OST Wallet React Native SDK Getter Methods

## Table of Contents

- [Before We Begin](#before-we-begin)
- [Get Token](#get-token)
  - [Usage](#usage)
  - [Sample Response](#sample-response)
- [Get User](#get-user)
  - [Usage](#usage-1)
  - [Sample Response](#sample-response-1)
- [Get Current Device](#get-current-device)
  - [Usage](#usage-2)
  - [Sample Response](#sample-response-2)
- [Get Biometric Preference](#get-biometric-preference)
  - [Usage](#usage-3)
- [Get Active Sessions](#get-active-sessions)
  - [Usage](#usage-4)
  - [Sample Response](#sample-response-3)
- [QR Code for Authorizing Device](#qr-code-for-authorizing-device)
  - [Usage](#usage-5)
  - [Sample Render Method](#sample-render-method)

<a id="before-we-begin"></a>
## Before We Begin
- App must [initialize](../README.md#initializing-the-sdk) the SDK <em><b>before</b></em> initiating getter methods.
- We recommend using these methods *after* [setupDevice](../README.md#setupdevice) workflow has been performed.
- The getter methods provide the data as available with the device. 
  - The methods may return `null` if the data is not available.
- These methods are *synchronous* in the native SDK. Because of react-native's bridge they behave *asynchronous* in the react-native SDK. 
  - These methods do not make any API calls.

<a id="get-token"></a>
## Get Token
Method to get token information.
> `getToken` method will return partial data if device has not been registered.

<a id="usage"></a>
##### Usage
```js
  /*
    Please update tokenId as per your needs. 
    Since this tokenId does not belong to your economy, you may get an error if you do not change it.
  */
  let tokenId = '1129';

  /**
   * Get token object for provided userId
   * @param {String} tokenId - Ost Token id
   * @param {function} callback - Gets token object if present else nil
   * @callback params {Object} token entity. Returns null if information is not available with device.
   * @public
   */
  OstWalletSdk.getToken(tokenId, (tokenEntity) => {
    console.log("tokenEntity", tokenEntity);
  });
```
<a id="sample-response"></a>
##### Sample Response
Please refer to the [Token Object](https://dev.ost.com/platform/docs/api/#token) for a detailed description.
```json
{
  "updated_timestamp": 1560167796,
  "auxiliary_chains": [
    {
      "organization": {
        "owner": "0x8986922410e5d8cf43cfc94c1b51dcf8dfdf7637",
        "contract": "0xb8e3fcfb5dac714e40b63489f4f393c7073fdbb3"
      },
      "company_uuids": [
        "d6bf0061-a32d-48af-a29b-013260a947f3"
      ],
      "company_token_holders": [
        "0x93f08d0c5d7bc28cc117681b3b23f8501a09e786"
      ],
      "utility_branded_token": "0xc50e3fd492a9a99a964f7aff8d755075d0732ff0",
      "chain_id": 197
    }
  ],
  "origin_chain": {
    "stakers": [
      "0x8986922410e5d8cf43cfc94c1b51dcf8dfdf7637"
    ],
    "organization": {
      "owner": "0x8986922410e5d8cf43cfc94c1b51dcf8dfdf7637",
      "contract": "0x0260a404804b1d7cf6fa678fb5d8441495cfff1b"
    },
    "branded_token": "0x18cbeae2f1785abf68c9984f9186a29ed062c3ca",
    "chain_id": 3
  },
  "decimals": 6,
  "total_supply": "500000000000",
  "conversion_factor": 10,
  "base_token": "USDC",
  "symbol": "SC1",
  "name": "STC1",
  "id": 1129
}
```

<a id="get-user"></a>
## Get User
Method to get user information.
> `getUser` method will return partial data if device has not been registered.

<a id="usage-1"></a>
##### Usage
```js
  /*
    Please update userId as per your needs. 
    Since this userId does not belong to your economy, you will get an error if you do not change it.
  */
  let userId = "71c59448-ff77-484c-99d8-abea8a419836";

  /**
   * Get user object for provided userId
   * @param {String} userId - Ost User id
   * @param {function} callback - Gets object if present else nil
   * @callback params {Object}user
   * @public
   */
  OstWalletSdk.getUser(userId, (userEntity)=>{
    console.log( userEntity );
  });
```

<a id="sample-response-1"></a>
##### Sample Response
```json
{
  "updated_timestamp": 1566832473,
  "status": "ACTIVATED",
  "type": "user",
  "recovery_owner_address": "0x0a64dc924d32a569b1d0885acfc34832e1444944",
  "recovery_address": "0x99c46a66621d6967cbd692e615ec36747d58fecb",
  "device_manager_address": "0x55f379612796b863590d388ed509ae50de12a5d2",
  "token_holder_address": "0xbf3df93b15c6933177237d9ed8400a2f41c8b8a9",
  "token_id": 1129,
  "id": "71c59448-ff77-484c-99d8-abea8a419836"
}
```

<a id="get-current-device"></a>
## Get Current Device
Method to get device entity.

<a id="usage-2"></a>
##### Usage
```js
  /*
    Please update userId as per your needs. 
    Since this userId does not belong to your economy, you may get an error if you do not change it.
  */
  let userId = "71c59448-ff77-484c-99d8-abea8a419836";

  /**
   * Get current device object for provided userId
   * @param {String} userId - Ost User id
   * @param {function} callback - Gets current device object if present else nil
   * @callback params {Object} device
   * @public
   */
  OstWalletSdk.getCurrentDeviceForUserId(userId, (device)=>{
    console.log( device );
  });
```
<a id="sample-response-2"></a>
##### Sample Response
```json
{
  "updated_timestamp": 1566832473,
  "status": "AUTHORIZED",
  "api_signer_address": "0x674d0fc0d044f085a87ed742ea778b55e298b429",
  "linked_address": "0x73722b0c0a6b6418893737e0ca33dd567e33f6aa",
  "address": "0x8d92cf567191f07e5c1b487ef422ff684ddf5dd3",
  "user_id": "71c59448-ff77-484c-99d8-abea8a419836"
}
```

<a id="get-biometric-preference"></a>
## Get Biometric Preference
Method to get biometric preference of the user.

<a id="usage-3"></a>
##### Usage
```js
  /*
    Please update userId as per your needs. 
    Since this userId does not belong to your economy, you may get an error if you do not change it.
  */
  let userId = "71c59448-ff77-484c-99d8-abea8a419836";

  /**
   * Get biometric preference for user
   *
   * @param userId - Ost User id
   * @param callback - Gets biometric preference boolean value
   */
  OstWalletSdk.isBiometricEnabled(userId, (status) => {
    console.log("isBiometricEnabled", status );
    // logs true or false.
  });
```

<a id="get-active-sessions"></a>
## Get Active Sessions
Method to get active sessions available with device.

<a id="usage-4"></a>
##### Usage
```js
  /*
    Please update userId and minimumSpendingLimitInWei as per your needs. 
    Since this userId does not belong to your economy, you may get an error if you do not change it.
  */
  let userId = "71c59448-ff77-484c-99d8-abea8a419836";
  let minimumSpendingLimitInWei = "1000000";

  /**
   * Get user object for provided userId
   * @param {String} userId - Ost User id
   * @param {String} minimumSpendingLimitInWei - optional parameter, defaults to zero.
   * @param {function} callback - Gets array of current device sessions.
   * @callback params {Array} array of sessions
   * @public
   */
  OstWalletSdk.getActiveSessionsForUserId(userId, minimumSpendingLimitInWei, (activeSessions)=>{
    console.log(activeSessions);
  });


  // Optionally, getActiveSessionsForUserId method can also 
  // be invoked without specifying minimumSpendingLimitInWei.
  OstWalletSdk.getActiveSessionsForUserId(userId,(activeSessions)=>{
    console.log(activeSessions);
  });
```
<a id="sample-response-3"></a>
##### Sample Response
```json
[
  {
    "updated_timestamp": 1566832473,
    "status": "AUTHORIZED",
    "nonce": 2,
    "spending_limit": "1000000000000000000",
    "approx_expiration_timestamp": 1566922426,
    "expiration_height": 3607838,
    "address": "0x3171bce99d00812b77aa216ed544ab35fc8b6fb1",
    "user_id": "71c59448-ff77-484c-99d8-abea8a419836"
  },
  {
    "updated_timestamp": 1566832473,
    "status": "AUTHORIZED",
    "nonce": 2,
    "spending_limit": "1000000000000000000",
    "approx_expiration_timestamp": 1566922426,
    "expiration_height": 3607838,
    "address": "0x816324ed539b62652a247ce5c1f1962f6de13e14",
    "user_id": "71c59448-ff77-484c-99d8-abea8a419836"
  },
  {
    "updated_timestamp": 1566832473,
    "status": "AUTHORIZED",
    "nonce": 3,
    "spending_limit": "1000000000000000000",
    "approx_expiration_timestamp": 1566922426,
    "expiration_height": 3607838,
    "address": "0x95b3fcb5aa3930a9bc42da171b8733a3a869955f",
    "user_id": "71c59448-ff77-484c-99d8-abea8a419836"
  },
  {
    "updated_timestamp": 1566832473,
    "status": "AUTHORIZED",
    "nonce": 3,
    "spending_limit": "1000000000000000000",
    "approx_expiration_timestamp": 1566922426,
    "expiration_height": 3607838,
    "address": "0xe57b68fc8aca57d9488d1607df628a4076571eda",
    "user_id": "71c59448-ff77-484c-99d8-abea8a419836"
  },
  {
    "updated_timestamp": 1566832473,
    "status": "AUTHORIZED",
    "nonce": 2,
    "spending_limit": "1000000000000000000",
    "approx_expiration_timestamp": 1566922426,
    "expiration_height": 3607838,
    "address": "0x459712cb13efd12ade7ff3a5fd4641f5c21904c9",
    "user_id": "71c59448-ff77-484c-99d8-abea8a419836"
  }
]
```

<a id="qr-code-for-authorizing-device"></a>
## QR Code for Authorizing Device
Method to generate QR code that can be scanned by an **authorized** device. Scanning this QR code with an authorized mobile device will result in this device (from where the QR code has been generated) being authorized.
> App should use this method only when the current device status is `REGISTERED`.

<a id="usage-5"></a>
##### Usage
```js
  /*
    Please update userId and minimumSpendingLimitInWei as per your needs. 
    Since this userId does not belong to your economy, you may get an error if you do not change it.
  */
  let userId = "71c59448-ff77-484c-99d8-abea8a419836";

  /**
   * Get device QR code
   * @param {String} userId - Ost User id
   * @param {function} successCallback - returns image as base64 string.
   * @param {function} errorCallback.
   * @public
   */
  OstWalletSdk.getAddDeviceQRCode( userId , (base64Image) => {
    console.log(base64Image);
    // Assuming this method is called from Component, 
    // let's update the component's state to display the image.
    this.setState({
      qrCode: base64Image
    });
  }, (error) => {

  });
```

<a id="sample-render-method"></a>
##### Sample Render Method
```jsx
  render() {
    // Assuming that callback will set 'qrCode' attribute in component's state.
    if ( this.state.qrCode ) {
      return (
        <Image 
          style={{padding: 10, width: "100%", aspectRatio: 1}}
          source={{uri: `data:image/png;base64,${this.state.qrCode}`}}
        />
      );
    }
    return null;
  }
```
