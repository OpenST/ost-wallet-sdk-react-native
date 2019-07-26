//
/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/
  

#import "BaseSdkInteract.h"

NS_ASSUME_NONNULL_BEGIN

@interface OstPassphrasePrefixAcceptWrap : BaseSdkInteract
- (void) setPassphrasePrefix: (NSString *)passphrasePrefix forUserId: (NSString *)userId;
@end

NS_ASSUME_NONNULL_END
