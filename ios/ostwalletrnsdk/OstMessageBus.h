//
//  OstMessageBus.h
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif


#if __has_include("RCTEventEmitter.h")
#import "RCTEventEmitter.h"
#else
#import <React/RCTEventEmitter.h>
#endif



NS_ASSUME_NONNULL_BEGIN

@interface OstMessageBus : RCTEventEmitter <RCTBridgeModule>
+ (OstMessageBus *) getInstance;
- (void) sendEventWithData: (NSMutableDictionary *) data;
+ (BOOL) requiresMainQueueSetup;
@end

NS_ASSUME_NONNULL_END
