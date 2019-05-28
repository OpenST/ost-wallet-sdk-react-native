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
  NSDictionary *params = [self convertJSONString: jsonMethodParams error: error];
  if ( nil != *error) {
    NSDictionary *errDict = [OstRNErrorUtils invalidJsonStringError: @"rn_si_odrw_dr_1"];
    [self errorEncountered: errDict error:error];
    return;
  }
  
  [delegate deviceRegistered: params error: error];
  if ( nil != *error) {
    NSDictionary *errDict = [OstRNErrorUtils errorToJson:*error internalCode: @"rn_si_odrw_dr_2"];
    [self errorEncountered: errDict error:error];
    return;
  }
  [self done];
}

@end
