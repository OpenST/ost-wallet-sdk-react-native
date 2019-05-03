#import "OstWalletSdk.h"
#import <React/RCTLog.h>

@implementation OstWalletSdk

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize:(NSString *)url )
{
  RCTLogInfo(@"BaseUrl %@", url);
}

@end
  
  