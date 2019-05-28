//
//  OstPinAcceptWrap.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 22/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "OstPinAcceptWrap.h"

@implementation OstPinAcceptWrap

- (void)pinEntered:(NSString * _Nonnull)userPin passphrasePrefix:(NSString * _Nonnull)passphrasePrefix
{
  id <OstPinAcceptDelegate> delegate = (id <OstPinAcceptDelegate>) self.delegate;
  [delegate pinEntered:userPin passphrasePrefix:passphrasePrefix];
  [self done];
}

@end
