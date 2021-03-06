/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import "OstRNSdkCallbackManager.h"
#import "BaseSdkInteract.h"
#import "OstDeviceRegisteredWrap.h"
#import "OstPinAcceptWrap.h"
#import "OstVerifyDataWrap.h"
#import "OstRNErrorUtils.h"

@implementation OstRNSdkCallbackManager
RCT_EXPORT_MODULE(OstRNSdkCallbackManager) ;

RCT_EXPORT_METHOD(cancelFlow: (NSString *) uuid )
{
  BaseSdkInteract *interact = [BaseSdkInteract getFromMap: uuid];
  if ( nil == interact ) {
    //Ignore.
    return;
  }
  [interact cancelFlow];
}

RCT_EXPORT_METHOD(deviceRegistered: (NSString *) uuid
               jsonString: (NSString *) jsonString
               callback: (RCTResponseSenderBlock) callback )
{
  BaseSdkInteract *interact = [BaseSdkInteract getFromMap: uuid];
  
  if ( nil == interact || ![interact isKindOfClass: [OstDeviceRegisteredWrap class] ]) {
    OstError *ostError = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_drjscb_1"];
    callback( @[ [ostError userInfo] ] );
    return;
  }
  
  NSError *err;
  OstDeviceRegisteredWrap * subInteract = (OstDeviceRegisteredWrap *) interact;
  [subInteract deviceRegistered: jsonString error: &err];
  if ( nil != err ) {
    NSDictionary *error = [OstRNErrorUtils errorToJson: err internalCode: @"rn_sdjcbm_drjscb_1"];
    callback( @[error] );
    return;
  }
}

RCT_EXPORT_METHOD(pinEntered: (NSString *) uuid
                  userId : (NSString *) userId
                  pin : (NSString *) pin
                  passphrasePrefix : (NSString *) passphrasePrefix
                  callback: (RCTResponseSenderBlock) callback)
{
  BaseSdkInteract *interact = [BaseSdkInteract getFromMap: uuid];
  if ( nil == interact || ![interact isKindOfClass: [OstPinAcceptWrap class] ]) {
    OstError *ostError = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_pe_1"];
    callback( @[ [ostError userInfo] ] );
    return;
  }
  OstPinAcceptWrap * subInteract = (OstPinAcceptWrap *) interact;
  [subInteract pinEntered:pin passphrasePrefix:passphrasePrefix];
  
}

RCT_EXPORT_METHOD(dataVerified: (NSString *) uuid
                  callback: (RCTResponseSenderBlock) callback)
{
  BaseSdkInteract *interact = [BaseSdkInteract getFromMap: uuid];
  if ( nil == interact || ![interact isKindOfClass: [OstVerifyDataWrap class] ]) {
    OstError *ostError = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_dv_1"];
    callback( @[ [ostError userInfo] ] );
    return;
  }
  OstVerifyDataWrap * subInteract = (OstVerifyDataWrap *) interact;
  [subInteract dataVerified];
}





@end
