#import "OstWalletSdk.h"
#import <React/RCTLog.h>

@interface RCT_EXTERN_REMAP_MODULE(OstSdk, OstWalletSdkS, NSObject)

RCT_EXTERN_METHOD(initialize)

@end

@implementation OstWalletSdk

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initialize:(NSString *)url )
{
  RCTLogInfo(@"BaseUrl %@", url);
}

@end
  
  