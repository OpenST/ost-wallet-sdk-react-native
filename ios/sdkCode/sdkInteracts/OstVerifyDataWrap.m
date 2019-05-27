//
//  OstVerifyDataWrap.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 22/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "OstVerifyDataWrap.h"

@implementation OstVerifyDataWrap

- (void)dataVerified {
  id <OstValidateDataDelegate> delegate = (id <OstValidateDataDelegate>) self.delegate;
  [delegate dataVerified];
  [self done];
}

@end
