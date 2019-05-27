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
+ (OstWorkFlowCallbackImpl *_Nullable) getInstance:(NSString *_Nonnull) uuid;
- (instancetype _Nullable ) initWithId:(NSString * _Nonnull) uuId workflowContext: ( OstWorkflowContext *_Nonnull) workflowContext;
- (void)flowInterruptedWithWorkflowContext:(OstWorkflowContext * _Nullable)workflowContext ostErrorDictionary: (NSDictionary *_Nonnull) error;
@end

