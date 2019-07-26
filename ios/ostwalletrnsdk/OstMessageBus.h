/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

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
- (void) sendEventWithData: (NSMutableDictionary *) data forEvent: (NSString *)eventName;
+ (BOOL) requiresMainQueueSetup;
- (NSString *)getEventNameForType: (NSString *)type;
@end

NS_ASSUME_NONNULL_END
