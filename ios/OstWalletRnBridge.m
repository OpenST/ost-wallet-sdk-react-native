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

    - (dispatch_queue_t)methodQueue
    {
        return dispatch_get_main_queue();
    }
    RCT_EXPORT_MODULE()

@end

@interface RCT_EXTERN_MODULE(OstWalletRnSdk, NSObject)

    RCT_EXTERN_METHOD(addEvent:(NSString *)url )

@end

