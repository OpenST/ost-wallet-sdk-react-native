//
//  OstWalletRnSdkBridge.m
//  OstWalletRnSdk
//
//  Created by Ashutosh Lodhi on 06/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_REMAP_MODULE(OstWalletSdk, OstWalletRnSdk ,NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)url (RCTResponseSenderBlock)callback)

@end
