
# ost-wallet-sdk-react-native

## Getting started

`$ npm install ost-wallet-sdk-react-native --save`

### Mostly automatic installation

`$ react-native link ost-wallet-sdk-react-native`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `ost-wallet-sdk-react-native` and add `RNOstWalletSdk.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNOstWalletSdk.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.ost.ostwalletsdk;` to the imports at the top of the file
  - Add `new OstWalletSdkPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':ost-wallet-sdk-react-native'
  	project(':ost-wallet-sdk-react-native').projectDir = new File(rootProject.projectDir, 	'../node_modules/ost-wallet-sdk-react-native/android')
  	```
3. Change the `minSdkVersion` to 22 in `android/build.gradle`	
4. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':ost-wallet-sdk-react-native')
  	```

## Usage
```javascript
import OstWalletSdk from 'ost-wallet-sdk-react-native';

// TODO: What to do with the module?
OstWalletSdk;
```
  