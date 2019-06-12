//
/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/
  

#import "OstJsonApiCallbackImpl.h"

@interface OstJsonApiCallbackImpl()

@property(nonatomic, strong) RCTResponseSenderBlock successCallback;
@property(nonatomic, strong) RCTResponseSenderBlock errorCallback;

@end

@implementation OstJsonApiCallbackImpl
- (instancetype) initWithSuccess:(RCTResponseSenderBlock) successCallback errorCallback: (RCTResponseSenderBlock) errorCallback  {
  self = [super init];
  if (self) {
    [self setSuccessCallback: successCallback];
    [self setErrorCallback: errorCallback];
  }
  return self;
}

- (void)onOstJsonApiErrorWithError:(OstError * _Nullable)error errorData:(NSDictionary<NSString *,id> * _Nullable)errorData {
  self.errorCallback(@[ [error userInfo], errorData ]);
  [self cleanUp];
}

- (void)onOstJsonApiSuccessWithData:(NSDictionary<NSString *,id> * _Nullable)data {
  self.successCallback(@[ data ]);
  [self cleanUp];
}

- (void) cleanUp {
  [self setSuccessCallback: nil];
  [self setErrorCallback: nil];
}
@end
