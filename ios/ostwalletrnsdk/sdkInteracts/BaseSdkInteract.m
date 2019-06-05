/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import "BaseSdkInteract.h"

#if __has_include("OstWalletSdk-Swift.h")
#import "OstWalletSdk-Swift.h"
#else
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#endif

#import "OstWorkFlowCallbackImpl.h"
#import "OstRNErrorUtils.h"


@interface BaseSdkInteract()
@end



static NSMutableDictionary *map;
@implementation BaseSdkInteract
+ (NSMutableDictionary *) getMap {
  if ( nil == map ) {
    map = [[NSMutableDictionary alloc] init];
  }
  return map;
}

+ (void) addToMap: (NSString *) uuid sdkInteract:(BaseSdkInteract *) sdkInteract {
  NSMutableDictionary *map = [BaseSdkInteract getMap];
  map[uuid] = sdkInteract;
}

+ (void) removeFromMap: (NSString *) uuid {
  if ( nil == map || nil == map[uuid] ) {
    return;
  }
  [map removeObjectForKey: uuid];
}

+ (BaseSdkInteract *) getFromMap: (NSString *) uuid {
  NSMutableDictionary *map = [BaseSdkInteract getMap];
  return map[ uuid ];
}

- (void) postError: (NSError **) errorPointer fallbackError: (OstError *) fallbackError {
  OstWorkFlowCallbackImpl *workflow = [OstWorkFlowCallbackImpl getInstance:[self workflowCallbackId]];
  if ( nil == workflow ) {
    //Update the errorPointer.
    *errorPointer = [[OstError alloc]initWithInternalCode: @"rn_si_bsi_pe_1"
                                         errorCode: OstErrorCodeInvalidWorkflow
                                         errorInfo: nil];
    return;
  }
  
  OstError *errorToPost;
  if ( [*errorPointer isKindOfClass: OstError.class] ) {
    errorToPost = (OstError *)(*errorPointer);
  } else {
    errorToPost = fallbackError;
  }
  *errorPointer = nil;
  [workflow flowInterruptedWithWorkflowContext: workflow.pseudoContext error: errorToPost];
  [self done];
}

- (NSString *)getUUID {
  return self.uuid;
}

- (NSString *) getWorkflowCallbackId {
  return self.workflowCallbackId;
}

- (instancetype) initWithCallback: (id<OstBaseDelegate> _Nonnull)delegate
               workflowCallbackId: (NSString *) workflowCallbackId
{
  self = [super init];
  if (self) {
    self.uuid = [[NSUUID UUID] UUIDString];
    self.delegate = delegate;
    self.workflowCallbackId = workflowCallbackId;
    [BaseSdkInteract addToMap:self.uuid sdkInteract: self];
  }
  return self;
}

- (void) done {
  self.delegate = nil;
  [BaseSdkInteract removeFromMap: self.uuid];
}

- (void) cancelFlow {
  [self.delegate cancelFlow];
  [self done];
}

- (NSDictionary *) convertJSONString: (NSString *) jsonParams error: (OstError **)error {
  NSData *jsonData = [jsonParams dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData
                                                         options:NSJSONReadingAllowFragments
                                                           error: error];
  if ( nil != *error) {
    *error =  [OstRNErrorUtils invalidJsonStringError: @"rn_si_bsi_cjsons_1"];
  }
  return params;
}







@end
