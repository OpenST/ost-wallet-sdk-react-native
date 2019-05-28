//
//  BaseSdkInteract.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

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

- (void) errorEncountered:(NSDictionary *) errorDict error: (NSError **) error {
  OstWorkFlowCallbackImpl *workflow = [OstWorkFlowCallbackImpl getInstance:[self workflowCallbackId]];
  if ( nil == workflow ) {
    *error = [[NSError alloc] initWithDomain: OstRNErrorUtils.ERROR_DOMAIN
                                        code: OstRNErrorUtils.INVALID_WORKFLOW_CODE
                                    userInfo: errorDict];
    return;
  }

  [workflow flowInterruptedWithWorkflowContext: nil ostErrorDictionary: errorDict];
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

- (NSDictionary *) convertJSONString: (NSString *) jsonParams error: (NSError **)error{
  NSData *jsonData = [jsonParams dataUsingEncoding:NSUTF8StringEncoding];
  NSDictionary *params = [NSJSONSerialization JSONObjectWithData:jsonData
                                                         options:NSJSONReadingAllowFragments
                                                           error: error];
  return params;
}







@end
