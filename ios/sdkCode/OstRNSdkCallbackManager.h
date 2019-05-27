//
//  OstRNSdkCallbackManager.h
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

#if __has_include("RCTBridgeModule.h")
#import "RCTBridgeModule.h"
#else
#import <React/RCTBridgeModule.h>
#endif

#if __has_include("OstWalletSdk-Swift.h")
#import "OstWalletSdk-Swift.h"
#else
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#endif

NS_ASSUME_NONNULL_BEGIN

@interface OstRNSdkCallbackManager : NSObject <RCTBridgeModule>

@end

NS_ASSUME_NONNULL_END
