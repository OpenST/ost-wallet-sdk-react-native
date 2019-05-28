//
//  OstRNUtils.h
//  RNProject
//
//  Created by Rachin Kapoor on 23/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#if __has_include("OstWalletSdk-Swift.h")
#import "OstWalletSdk-Swift.h"
#else
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#endif


NS_ASSUME_NONNULL_BEGIN

@interface OstRNErrorUtils : NSObject
@property (class, readonly) NSString * ERROR_DOMAIN;
@property (class, readonly) int INVALID_WORKFLOW_CODE;
@property (class, readonly) NSString * invalidJsonString;
@property (class, readonly) NSString * invalidJsonArray;
@property (class, readonly) NSString * invalidWorkflow;

+ (OstError *) invalidJsonStringError: (NSString * _Nonnull) internalCode;
+ (OstError *) invalidJsonArrayError: (NSString * _Nonnull) internalCode;
+ (OstError *) invalidWorkflowError: (NSString * _Nonnull) internalCode;

+ (NSDictionary *) errorToJson: (NSError * _Nonnull) error internalCode:(NSString * _Nonnull) internalCode;
+ (NSDictionary *) errorToJson:(NSError * _Nonnull)error internalCode:(NSString * _Nonnull)internalCode errorCode:(NSString * _Nonnull) errorCode;
@end

NS_ASSUME_NONNULL_END
