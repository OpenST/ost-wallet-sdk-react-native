//
//  OstWalletRnBridge1.m
//  OstWalletRnSdk
//
//  Created by Ashutosh Lodhi on 06/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "OstWalletRnBridge.h"
#import <React/RCTBridgeModule.h>

@implementation OstWalletRnBridge

@end


@interface RCT_EXTERN_MODULE(OstWalletRnSdk, NSObject)

RCT_EXTERN_METHOD(addEvent:(NSString *)url )

@end
