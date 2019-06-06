/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import "OstDeviceRegisteredWrap.h"
#import "OstRNErrorUtils.h"

@implementation OstDeviceRegisteredWrap

- (void) deviceRegistered: (NSString *) jsonMethodParams error: (NSError **) error {
  id <OstDeviceRegisteredDelegate> delegate = (id <OstDeviceRegisteredDelegate>) self.delegate;
  OstError *jsonParseError;
  NSDictionary *params = [self convertJSONString: jsonMethodParams error: &jsonParseError];
  if ( nil != jsonParseError) {
    *error = jsonParseError;
    OstError *err =  [OstRNErrorUtils invalidJsonStringError: @"rn_si_odrw_dr_1"];
    [self postError: error fallbackError: err];
    return;
  }
  
  [delegate deviceRegistered: params error: error];
  if ( nil != *error) {
    OstError *err = [[OstError alloc]initWithInternalCode: @"rn_si_odrw_dr_2"
                                                errorCode: OstErrorCodeSdkError
                                                errorInfo: nil];
    [self postError: error fallbackError: err];
    return;
  }
  [self done];
}

@end
