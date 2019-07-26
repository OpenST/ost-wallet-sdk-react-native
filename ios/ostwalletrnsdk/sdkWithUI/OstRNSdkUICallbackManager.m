//
/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/
  

#import "OstRNSdkUICallbackManager.h"
#import "BaseSdkInteract.h"
#import "OstPassphrasePrefixAcceptWrap.h"
#import "OstRNErrorUtils.h"

@implementation OstRNSdkUICallbackManager
RCT_EXPORT_MODULE(OstRNSdkUICallbackManager) ;

RCT_EXPORT_METHOD(cancelFlow: (NSString *) uuid )
{
  BaseSdkInteract *interact = [BaseSdkInteract getFromMap: uuid];
  if ( nil == interact ) {
    //Ignore.
    return;
  }
  [interact cancelFlow];
}

RCT_EXPORT_METHOD(setPassphrase: (NSString *) passphrasePrefix
                  userId: (NSString *) userId
                  uuid: (NSString *) uuid
                  callback: (RCTResponseSenderBlock) callback )
{
  BaseSdkInteract *interact = [BaseSdkInteract getFromMap: uuid];
  
  if ( nil == interact || ![interact isKindOfClass: [OstPassphrasePrefixAcceptWrap class] ]) {
    OstError *ostError = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_drjscb_1"];
    callback( @[ [ostError userInfo] ] );
    return;
  }
  
  NSError *err;
  OstPassphrasePrefixAcceptWrap * subInteract = (OstPassphrasePrefixAcceptWrap *) interact;
  [subInteract setPassphrase:passphrasePrefix forUserId:userId];
  if ( nil != err ) {
    NSDictionary *error = [OstRNErrorUtils errorToJson: err internalCode: @"rn_sdjcbm_drjscb_1"];
    callback( @[error] );
    return;
  }
}


@end
