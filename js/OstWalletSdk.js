import { NativeModules } from 'react-native';


const { OstWalletSdk } = NativeModules;
class OstWalletRNSdk {
    
    initialize( endpoint , errorCallback ){
        OstWalletSdk.initialize( endpoint , errorCallback ); 
    }

    setupDevice(userId, tokenId, workflow) {
        OstWalletSdk.setupDevice(userId, tokenId, workflow.uuid);
    }

    activateUser(userId, pin, passphrasePrefix, expiresAfterInSecs, spendingLimit, workflow) {
        OstWalletSdk.activateUser(userId, pin, passphrasePrefix, String(expiresAfterInSecs), spendingLimit, workflow.uuid );
    }

    addSession(userId, expireAfterInSecs, spendingLimit, workflow) {
        OstWalletSdk.addSession(userId, String(expireAfterInSecs), spendingLimit, workflow.uuid);
    }

    executeTransaction(userId, tokenHolderAddresses, amounts, ruleName, workflow) {
        tokenHolderAddresses = JSON.stringify(tokenHolderAddresses);
        amounts = JSON.stringify(amounts);
        OstWalletSdk.executeTransaction(userId, tokenHolderAddresses, amounts, ruleName, workflow.uuid);
    }

    getDeviceMnemonics(userId, workflow) {
        OstWalletSdk.getDeviceMnemonics(userId, workflow.uuid);
    }

    authorizeCurrentDeviceWithMnemonics(userId, mnemonics, workflow) {
        OstWalletSdk.authorizeCurrentDeviceWithMnemonics(userId, mnemonics, workflow.uuid);
    }

    getAddDeviceQRCode(userId , successCallback , errorCallback ) {
        OstWalletSdk.getAddDeviceQRCode( userId , successCallback , errorCallback); 
    }

    performQRAction(userId, data, workflow) {
        OstWalletSdk.performQRAction( userId , data ,  workflow.uuid   );
    }

    resetPin(userId, appSalt, currentPin, newPin, workflow ) {
        OstWalletSdk.resetPin( userId , appSalt , currentPin , newPin , workflow.uuid ); 
    }

    initiateDeviceRecovery(userId, pin, appSalt,  deviceAddressToRecover, workflow ) {
        OstWalletSdk.initiateDeviceRecovery( userId, pin, appSalt, deviceAddressToRecover, workflow.uuid ); 
    }

    abortDeviceRecovery( userId,  pin ,  appSalt , workflow ) {
        OstWalletSdk.abortDeviceRecovery( userId,  pin ,  appSalt ,  workflow.uuid  ); 
    }

    logoutAllSessions(userId, workflow ) {
        OstWalletSdk.logoutAllSessions( userId ,  workflow.uuid  ); 
    }
}

export default new OstWalletRNSdk();
