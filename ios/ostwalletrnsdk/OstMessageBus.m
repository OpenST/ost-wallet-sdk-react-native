/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import "OstMessageBus.h"

static OstMessageBus * __weak ref;
@implementation OstMessageBus
RCT_EXPORT_MODULE();



- (instancetype)init
{
  self = [super init];
  if (self) {
    NSLog(@"Creating new instance of OstMessageBus.");
    if ( nil != ref) {
      NSLog(@"WARNING: Multiple instances of OstMessageBus have been created.");
    }
    ref = self;
  }
  return self;
}



+ (OstMessageBus *) getInstance
{
  return ref;
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"onOstWalletSdkEvents", @"onOstWalletSdkUIEvents"];
}

- (NSString *)getEventNameForType: (NSString *)type {
  
  if([type caseInsensitiveCompare:@"sdk"] == NSOrderedSame) {
    return @"onOstWalletSdkEvents";
  }else if([type caseInsensitiveCompare:@"sdkui"] == NSOrderedSame) {
     return @"onOstWalletSdkUIEvents";
  }
  return @"";
}

- (void) sendEventWithData: (NSMutableDictionary *) data forEvent: (NSString *)eventName
{
  [self sendEventWithName:eventName body: data];
}

+ (BOOL) requiresMainQueueSetup
{
  return YES;
}

@end
