//
/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/
  

#import "OstSetPassphrasePrefixAcceptWrap.h"

@implementation OstSetPassphrasePrefixAcceptWrap

- (void) setPassphrasePrefix: (NSString *)passphrasePrefix forUserId: (NSString *)userId {
  id <OstPassphrasePrefixAcceptDelegate> delegate = (id <OstPassphrasePrefixAcceptDelegate>) self.delegate;
  
  [delegate setPassphraseWithOstUserId:userId passphrase:passphrasePrefix];
  [self done];
}

@end
