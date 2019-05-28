//
//  OstPinAcceptWrap.h
//  RNProject
//
//  Created by Ashutosh Lodhi on 22/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BaseSdkInteract.h"

NS_ASSUME_NONNULL_BEGIN

@interface OstPinAcceptWrap : BaseSdkInteract
- (void)pinEntered:(NSString * _Nonnull)userPin passphrasePrefix:(NSString * _Nonnull)passphrasePrefix;
@end

NS_ASSUME_NONNULL_END
