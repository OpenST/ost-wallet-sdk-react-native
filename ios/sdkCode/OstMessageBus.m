//
//  OstMessageBus.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

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
  return @[@"onOstWalletSdkEvents"];
}

- (void) sendEventWithData: (NSMutableDictionary *) data
{
  [self sendEventWithName:@"onOstWalletSdkEvents" body: data];
}

@end
