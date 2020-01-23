# OST Wallet SDK Changelog

## Version 2.3.12
* OstWalletSettings UI component is now available in SDK. To use `OstWalletSettings`, please update downstream sdk.<br/>
iOS:`v2.3.6`<br/>
Android:`v2.3.8`

## Version 2.3.12-beta.1
* OstWalletSettings UI component is now available in SDK. To use `OstWalletSettings`, please update downstream sdk.<br/>
iOS:`v2.3.6-beta-1`<br/>
Android:`v2.3.8-beta.1`

## Version 2.3.11
### Bug Fix:
* In Android inaccurate error is thrown when application runs out of memory during recover device workflow.<br/>
Downstream Android Sdk updated to `v2.3.7`

## Version 2.3.10
* OstWalletSdk supports custom loader for OstWalletUI. To use custom loader, please update downstream sdk.<br/>
iOS:`v2.3.5`<br/>
Android:`v2.3.6`

## Version 2.3.9
* Downstream iOS Sdk updated to `v2.3.4`

## Version 2.3.8
* Removed jitpack.io dependency.

## Version 2.3.7
* Downstream iOS Sdk updated to `v2.3.3`

## Version 2.3.6
* Downstream Android Sdk updated to `v2.3.5`

## Version 2.3.5
* Downstream Android Sdk updated to `v2.3.4`

## Version 2.3.4
* Downstream Android Sdk updated to `v2.3.2`

## Version 2.3.3
### Bug Fix:
* OstWalletUIWorkflowCallback signature updated.

## Version 2.3.2
### Bug Fix:
* Fixed a bug, where `ostApiError.getApiError` always returned an empty object.

## Version 2.3.1
### Feature:
* OstWalletUI now supports
    - get add device QR-Code
    - scan QR-Code to authorize device
    - scan QR-Code to execute transaction
    - authorize current device with mnemonics
* Api provided to fetch current device from OstPlatform.
* Now supports getting active sessions from Sdk.

## Version 2.3.0
### Feature:
* OstWalletSdk now contains UI.
* UI components can be modified.
* Languages for UI workflow components can be modified.
* OstWalletUI now supports
    - activate user
    - create session
    - get device mnemonics
    - revoke device
    - reset pin
    - initiate device recovery
    - abort device recovery
    - update biometric preference

## Version v2.2.4
### Bug Fix:
* iOS: Inconsistent signature generation fix.

## Version v2.2.3
* Android: Added support for AndroidX

## Version v2.2.2
### Bug Fix:
* iOS: Scanning unrecognized QR codes no longer causes the SDK to crash

## Version v2.2.1
### Bug Fix:
* Fix `fetchDevice` cache issue for `initiateDeviceRecovery`
* Add `No Network Access` error to OstApiError
### Security Enhancements
* Implemented public-key pinning for api.ost.com

## Version v2.2.0
### Changes: 
* Added Multi Currency Feature which allows developers to specify fiat-currency at runtime while executing a transaction.
* Added OstJsonApi that allows developers to fetch data from Ost Platform. Please see README.MD for supported Api(s).
