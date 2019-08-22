/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/
  

#import "OstWalletRnSdkUI.h"
#import "OstRNErrorUtils.h"
#import "OstUICallbackImpl.h"

@implementation OstWalletRnSdkUI

RCT_EXPORT_MODULE(OstWalletSdkUI);

#pragma mark - setter

RCT_EXPORT_METHOD(setThemeConfig: (NSDictionary<NSString *, id> *)config) {
  [OstWalletUI setThemeConfig: config];
}

RCT_EXPORT_METHOD(setContentConfig: (NSDictionary<NSString *, id> *)config) {
  [OstWalletUI setContentConfig: config];
}

#pragma mark - UIWorkflows

RCT_EXPORT_METHOD(activateUser: (NSString * _Nonnull) userId
                  expiresAfterInSecs: (NSString * _Nonnull) expiresAfterInSecs
                  spendingLimit: (NSString * _Nonnull) spendingLimit
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI activateUserWithUserId:userId
                                               expireAfterInSec:[expiresAfterInSecs doubleValue]
                                                  spendingLimit:spendingLimit
                                       passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(initiateDeviceRecovery: (NSString * _Nonnull) userId
                  recoverDeviceAddress: (NSString * _Nullable) deviceAddress
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI initaiteDeviceRecoveryWithUserId:userId
                                                     recoverDeviceAddress:deviceAddress
                                                 passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(abortDeviceRecovery: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI abortDeviceRecoveryWithUserId:userId
                                              passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(addSession: (NSString * _Nonnull) userId
                  expiresAfterInSecs: (NSString * _Nonnull) expiresAfterInSecs
                  spendingLimit: (NSString * _Nonnull) spendingLimit
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  NSString *worklfowId = [OstWalletUI addSessionWithUserId:userId
                                          expireAfterInSec: [expiresAfterInSecs doubleValue]
                                             spendingLimit:spendingLimit
                                  passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(updateBiometricPreference: (NSString * _Nonnull) userId
                  enable: (BOOL) enable
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  NSString *worklfowId = [OstWalletUI updateBiometricPreferenceWithUserId:userId
                                                                   enable:enable
                                                 passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}


RCT_EXPORT_METHOD(resetPin: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  NSString *worklfowId = [OstWalletUI resetPinWithUserId:userId passphrasePrefixDelegate:uiCallbackImpl];
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(showComponentSheet) {
  [OstWalletUI showComponentSheet];
}

RCT_EXPORT_METHOD(revokeDevice: (NSString * _Nonnull) userId
                  revokeDeviceAddress: (NSString * _Nullable) deviceAddress
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI revokeDeviceWithUserId:userId
                                         revokeDeviceAddress: deviceAddress
                                    passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(getDeviceMnemonics: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI getDeviceMnemonicsWithUserId:userId
                                          passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(authorizeCurrentDeviceWithMnemonics: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI authorizeCurrentDeviceWithMnemonicsWithUserId:userId
                                                           passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(getAddDeviceQRCode: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI getAddDeviceQRCodeWithUserId:userId];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}

RCT_EXPORT_METHOD(authorizeDeviceViaQR: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletUI authorizeDeviceViaQRWithUserId:userId
                                            passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}
  
RCT_EXPORT_METHOD(executeTransactionViaQR: (NSString * _Nonnull) userId
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
    
  NSString *worklfowId = [OstWalletUI executeTransactionViaQRWithUserId: userId];
  
  [OstWalletUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}
  

@end
