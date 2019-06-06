/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import "OstPinAcceptWrap.h"

@implementation OstPinAcceptWrap

- (void)pinEntered:(NSString * _Nonnull)userPin passphrasePrefix:(NSString * _Nonnull)passphrasePrefix
{
  id <OstPinAcceptDelegate> delegate = (id <OstPinAcceptDelegate>) self.delegate;
  [delegate pinEntered:userPin passphrasePrefix:passphrasePrefix];
  [self done];
}

@end
