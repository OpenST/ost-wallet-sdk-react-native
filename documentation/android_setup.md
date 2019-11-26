# Android setup required for OST React Native SDK

## 1. Linking the OST React Native SDK

### Automatic Linking

```bash
react-native link @ostdotcom/ost-wallet-sdk-react-native
```
### Manual Linking

1. Open up `./android/app/src/main/java/[...]/MainApplication.java`. 
   - Add `import com.ostwalletrnsdk.OstWalletRnSdkPackage;` to the imports at the top of the file. 
   - Add `new OstWalletRnSdkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `./android/settings.gradle`:
  	```
  	include ':ost-wallet-sdk-react-native'
  	project(':ost-wallet-sdk-react-native').projectDir = new File(rootProject.projectDir, 	'../node_modules/ost-wallet-sdk-react-native/android')
  	```
3. Insert the following lines inside the dependencies block in `./android/app/build.gradle`:
    ```
    compile project(':ost-wallet-sdk-react-native')

## 2. Changing `minSdkVersion` in './android/build.gradle' file
Change the `minSdkVersion` to 22 in `android/build.gradle`

```
android {
    defaultConfig {
        minSdkVersion 22
        ...
        ...
        ...
    }
}

```

## 3. Create SDK configuration file
Create file `./android/app/src/main/assets/ost-mobilesdk.json` with application specific configurations using  the json below as an example

```json
{
  "BLOCK_GENERATION_TIME": 3,
  "PIN_MAX_RETRY_COUNT": 3,
  "REQUEST_TIMEOUT_DURATION": 60,
  "SESSION_BUFFER_TIME": 3600,
  "PRICE_POINT_CURRENCY_SYMBOL": "USD",
  "USE_SEED_PASSWORD": false
}
```

1. BlockGenerationTime: The time in seconds it takes to mine a block on auxiliary chain.
2. PricePointTokenSymbol: This is the symbol of base currency. So its value will be OST.
3. PricePointCurrencySymbol: It is the symbol of quote currency used in price conversion.
4. RequestTimeoutDuration: Request timeout in seconds for https calls made by ostWalletSdk.
5. PinMaxRetryCount: Maximum retry count to get the wallet Pin from user.
6. SessionBufferTime: Buffer expiration time for session keys in seconds. Default value is 3600 seconds.
7. UseSeedPassword: The seed password is salt to PBKDF2 used to generate seed from the mnemonic. When UseSeedPassword set to `true`, different deterministic salts are used for different keys.

**NOTE: These configurations are MANDATORY for successful operation. Failing to set them will significantly impact usage.**


# Next Steps

1. [SDK Usage](../README.md#sdk-usage)
2. [SDK Methods](../README.md#sdk-methods)
3. [SDK Callbacks](../README.md#sdk-workflow-callbacks)
