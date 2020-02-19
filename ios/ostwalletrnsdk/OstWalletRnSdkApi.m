//
/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/

#import "OstWalletRnSdkApi.h"
#import "OstJsonApiCallbackImpl.h"

@implementation OstWalletRnSdkApi

RCT_EXPORT_MODULE(OstJsonApi) ;

RCT_EXPORT_METHOD(getBalanceForUserId: (NSString * _Nonnull) userId
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback )
{
  
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getBalanceForUserId: userId delegate: delegate];
}

RCT_EXPORT_METHOD(getBalanceWithPricePointForUserId: (NSString * _Nonnull)userId
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback )
{
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getBalanceWithPricePointForUserId: userId delegate: delegate];
}

RCT_EXPORT_METHOD(getPricePointForUserId: (NSString * _Nonnull)userId
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback )
{
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getPricePointForUserId: userId delegate: delegate];
}

RCT_EXPORT_METHOD(getTransactionsForUserId: (NSString * _Nonnull)userId
                  params: (NSDictionary<NSString *, id> * _Nullable)params
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback )
{
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getTransactionsForUserId: userId params:params delegate:delegate];
}

RCT_EXPORT_METHOD(getPendingRecoveryForUserId: (NSString * _Nonnull)userId
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback) {
  
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getPendingRecoveryForUserId:userId delegate:delegate];
}

RCT_EXPORT_METHOD(getDeviceListForUserId: (NSString * _Nonnull)userId
                  params: (NSDictionary<NSString *, id> * _Nullable)params
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback) {
  
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getDeviceListForUserId:userId params:params delegate:delegate];
}
  
RCT_EXPORT_METHOD(getCurrentDeviceForUserId: (NSString * _Nonnull)userId
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback) {
    
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getCurrentDeviceForUserId:userId delegate:delegate];
}


RCT_EXPORT_METHOD(getRedeemableSkus: (NSString * _Nonnull)userId
                  params: (NSDictionary<NSString *, id> * _Nullable)params
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback )
{
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getRedeemableSkusWithUserId:userId params:params delegate:delegate];
}


RCT_EXPORT_METHOD(getRedeemableSkuDetails: (NSString * _Nonnull)userId
                  skuId: (NSString * _Nonnull)skuId
                  params: (NSDictionary<NSString *, id> * _Nullable)params
                  successCallback: (RCTResponseSenderBlock _Nonnull) successCallback
                  errorCallback: (RCTResponseSenderBlock _Nonnull) errorCallback )
{
  OstJsonApiCallbackImpl *delegate = [[OstJsonApiCallbackImpl alloc]initWithSuccess:successCallback errorCallback:errorCallback];
  [OstJsonApi getRedeemableSkuDetailsWithUserId:userId skuId:skuId params:params delegate: delegate];
}

@end
