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
  [OstWalletSdkUI setThemeConfig: config];
}

RCT_EXPORT_METHOD(setContentConfig: (NSDictionary<NSString *, id> *)config) {
  [OstWalletSdkUI setContentConfig: config];
}

#pragma mark - UIWorkflows

RCT_EXPORT_METHOD(activateUser: (NSString * _Nonnull) userId
                  spendingLimit: (NSString * _Nonnull) spendingLimit
                  expiresAfterInSecs: (NSString * _Nonnull) expiresAfterInSecs
                  uuid:(NSString *)uuid) {
  
  OstUICallbackImpl *uiCallbackImpl = [[OstUICallbackImpl alloc]initWithId:uuid];
  
  NSString *worklfowId = [OstWalletSdkUI activateUserWithUserId:userId
                                                  spendingLimit:spendingLimit
                                               expireAfterInSec:[expiresAfterInSecs doubleValue]
                                       passphrasePrefixDelegate:uiCallbackImpl];
  
  [OstWalletSdkUI subscribeWithWorkflowId:worklfowId listner: uiCallbackImpl];
}


@end
