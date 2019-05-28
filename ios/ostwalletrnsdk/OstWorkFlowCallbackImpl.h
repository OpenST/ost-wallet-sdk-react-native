//
//  OstWorkFlowCallbackImpl.h
//  RNProject
//
//  Created by Ashutosh Lodhi on 20/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#if __has_include("OstWalletSdk-Swift.h")
#import "OstWalletSdk-Swift.h"
#else
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#endif

@interface OstWorkFlowCallbackImpl : NSObject <OstWorkflowDelegate>
@property NSString * _Nonnull uuid;
@property OstWorkflowContext *_Nonnull pseudoContext;

+ (OstWorkFlowCallbackImpl *_Nullable) getInstance:(NSString *_Nonnull) uuid;
- (instancetype _Nullable ) initWithId:(NSString * _Nonnull) uuId workflowContext: ( OstWorkflowContext *_Nonnull) workflowContext;
@end

