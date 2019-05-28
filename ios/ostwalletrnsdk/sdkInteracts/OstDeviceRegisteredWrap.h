//
//  OstDeviceRegisteredWrap.h
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "BaseSdkInteract.h"

NS_ASSUME_NONNULL_BEGIN

@interface OstDeviceRegisteredWrap : BaseSdkInteract
- (void) deviceRegistered: (NSString *) jsonMethodParams error: (NSError **) err;
@end

NS_ASSUME_NONNULL_END
