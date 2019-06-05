/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import <Foundation/Foundation.h>

#if __has_include("OstWalletSdk-Swift.h")
#import "OstWalletSdk-Swift.h"
#else
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#endif


NS_ASSUME_NONNULL_BEGIN

@interface BaseSdkInteract : NSObject
@property id <OstBaseDelegate> _Nullable  delegate;
@property NSString *uuid;
@property NSString *workflowCallbackId;

- (instancetype) initWithCallback: (id<OstBaseDelegate> _Nonnull)delegate
               workflowCallbackId: (NSString *) workflowCallbackId;

- (void) cancelFlow;
//- (bool) messageReceived: (NSString *) methodName json: (NSString * _Nullable) jsonParams;
+ (BaseSdkInteract *) getFromMap: (NSString *) uuid;
- (NSDictionary *) convertJSONString: (NSString * _Nonnull) jsonParams error: (OstError *_Nullable * _Nullable)error;
- (void) done;
- (void) postError: (NSError **) errorPointer fallbackError: (OstError *) fallbackError;
@end

NS_ASSUME_NONNULL_END
