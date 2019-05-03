#import "OstWalletSdkBridge.h"
#import <React/RCTLog.h>

@implementation OstWalletSdkBridge

- (dispatch_queue_t)methodQueue
{
    return dispatch_get_main_queue();
}
@end

@interface RCT_EXTERN_MODULE(OstWalletSdk, NSObject)

RCT_EXTERN_METHOD(initialize:(NSString *)url)

@end
  
  