//
//  OstDeviceRegisteredWrap.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

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
