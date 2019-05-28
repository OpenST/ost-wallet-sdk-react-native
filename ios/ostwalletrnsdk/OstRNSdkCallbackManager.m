//
//  OstRNSdkCallbackManager.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 21/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

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
    NSDictionary *error = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_drjscb_1"];
    callback( @[error] );
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
    NSDictionary *error = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_pe_1"];
    callback( @[error] );
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
    NSDictionary *error = [OstRNErrorUtils invalidWorkflowError:@"rn_sdjcbm_pe_1"];
    callback( @[error] );
    return;
  }
  OstVerifyDataWrap * subInteract = (OstVerifyDataWrap *) interact;
  [subInteract dataVerified];
}





@end
