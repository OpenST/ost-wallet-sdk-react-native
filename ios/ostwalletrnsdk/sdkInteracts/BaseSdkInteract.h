//
//  BaseSdkInteract.h
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

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
- (NSDictionary *) convertJSONString: (NSString *) jsonParams error: (NSError **) error;
- (void) done;
- (void) errorEncountered:(NSDictionary *) errorDict error: (NSError **) error;

@end

NS_ASSUME_NONNULL_END
