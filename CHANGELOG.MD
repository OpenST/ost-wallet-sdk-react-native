# OST Wallet SDK Changelog

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
