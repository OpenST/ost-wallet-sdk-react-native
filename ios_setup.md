# iOS setup required for OST React Native SDK

## 1. Installing [Carthage](https://github.com/Carthage/Carthage)

Get [Carthage](https://github.com/Carthage/Carthage) by running following command on terminal

```bash
 brew install carthage
```

You can also choose [other methods](https://github.com/Carthage/Carthage/#installing-carthage) to install [Carthage](https://github.com/Carthage/Carthage)

## 2. Downloading OST React Native SDK using Carthage
Carthage looks at a file called `Cartfile` to determine which libraries to install. Create a file in the `./ios` directory of your react-native project called `Cartfile` and enter the following to tell Carthage which dependencies we want:

Add following entry in your `Cartfile`
```bash
 github "ostdotcom/ost-wallet-sdk-ios" == 2.3.0-beta.1
```

Now to actually install everything run the following in your terminal:

```bash
 carthage update --platform iOS
```
A `Cartfile.resolved` file and a `Carthage` directory will appear in the same directory where your `.xcodeproj` or `.xcworkspace` is.


## 3. Copying the `OstWalletSdk.framework` file in your Xcode project

Open your project in Xcode, click on the project file in the left section of the screen and scroll down to the `Linked Frameworks and Libraries` section in Xcode.

`Carthage` folder will have the `.framework` files that we will add in Xcode project.

Now open the `./ios/Carthage/Build/iOS` folder in Finder:

Run this command

```bash
open ios/Carthage/Build/iOS
```
Open application target, under General tab, drag the built `OstWalletSdk.framework` binary from `./ios/Carthage/Build/iOS` folder into Linked Frameworks and Libraries section.

![copy-framework-file](https://dxwfxs8b4lg24.cloudfront.net/docs/native/images/copy-framework-file.png)

## 4. Adding the `OstWalletSdk` dependencies in your Xcode project
We need to add the `.framework` files of dependencies present inside `./ios/Carthage/Build/iOS`.

Open `application targets` in Xcode. Under `Build Phases` click `+` icon and choose `New Run Script Phase`. Add the following command.

```bash
/usr/local/bin/carthage copy-frameworks
```

Click the `+` under `Input Files` and add the following entry framework:

```
$(SRCROOT)/Carthage/Build/iOS/Alamofire.framework
$(SRCROOT)/Carthage/Build/iOS/BigInt.framework
$(SRCROOT)/Carthage/Build/iOS/CryptoEthereumSwift.framework
$(SRCROOT)/Carthage/Build/iOS/CryptoSwift.framework
$(SRCROOT)/Carthage/Build/iOS/EthereumKit.framework
$(SRCROOT)/Carthage/Build/iOS/FMDB.framework
$(SRCROOT)/Carthage/Build/iOS/SipHash.framework
$(SRCROOT)/Carthage/Build/iOS/TrustKit.framework
$(SRCROOT)/Carthage/Build/iOS/OstWalletSdk.framework
```


![copy-framework-file](https://dxwfxs8b4lg24.cloudfront.net/docs/native/images/add-dependency-framework-files.png)


## 5. Add additional SDK files
Follow these steps to add additional files:

* Click on your project, select `File > Add Files to "<Your Project>"`

* Browse to `./node_modules/@ostdotcom/ost-wallet-sdk-react-native/ios`

* Add the folder `ostwalletrnsdk` with following settings:
    
    * Destination: (uncheck) Copy items if needed
    * Added folders: (select) Create groups

![Add-image](https://dxwfxs8b4lg24.cloudfront.net/docs/native/images/additional-files.png)

## 6. Change Build Settings
Open application target, under `Build Settings` tab, enable `Always Embed Swift Standard Libraries` under `Build Options`

![Add image](https://dxwfxs8b4lg24.cloudfront.net/docs/native/images/build-options.png)

## 7. Create SDK configuration file

Create `OstWalletSdk.plist` file. This file has configuration attributes used by OstWalletSdk. You should copy paste the configuration values from below snippet.

```
<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
        <dict>
            <key>BlockGenerationTime</key>
            <integer>3</integer>
            <key>PricePointCurrencySymbol</key>
            <string>USD</string>
            <key>RequestTimeoutDuration</key>
            <integer>30</integer>
            <key>PinMaxRetryCount</key>
            <integer>3</integer>
            <key>SessionBufferTime</key>
            <integer>3600</integer>
            <key>UseSeedPassword</key>
            <false/>
        </dict>
    </plist>
```

1. BlockGenerationTime: The time in seconds it takes to mine a block on auxiliary chain.
2. PricePointCurrencySymbol: It is the symbol of quote currency used in price conversion.
3. RequestTimeoutDuration: Request timeout in seconds for https calls made by ostWalletSdk.
4. PinMaxRetryCount: Maximum retry count to get the wallet Pin from user.
5. SessionBufferTime: Buffer expiration time for session keys in seconds.
6. UseSeedPassword: Uses mnemonics and password to generate seed.

**These configurations are MANDATORY for successful operation. Failing to set them will significantly impact usage.**




# Next Steps

1. [SDK Usage](README.md#sdk-usage)
2. [SDK Methods](README.md#sdk-methods)
3. [SDK Callbacks](README.md#sdk-workflow-callbacks)
