
#import "OstWalletSdk.h"

@interface RCT_EXTERN_REMAP_MODULE(OstSdk, OstWalletSdkS, NSObject)

RCT_EXTERN_METHOD(initialize)

@end

@implementation OstWalletSdk

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
RCT_EXPORT_MODULE()

@end
  