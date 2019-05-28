//
//  OWRnSdk.m
//  RNProject
//
//  Created by Ashutosh Lodhi on 20/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//
#import <CoreImage/CoreImage.h>
#import "OstWalletRnSdk.h"
#import "OstWorkFlowCallbackImpl.h"
#import "OstRNErrorUtils.h"

@implementation OstWalletRnSdk

RCT_EXPORT_MODULE(OstWalletSdk) ;

RCT_EXPORT_METHOD(initialize:(NSString *)url callback:(RCTResponseSenderBlock)callback)
{
 
  __weak NSError *error = nil;
  
  [OstWalletSdk initializeWithApiEndPoint:url error:&error];
  
  if (error != nil) {
    NSDictionary *err = [OstRNErrorUtils errorToJson: error internalCode: @"rn_owrs_init_1"];
    callback(@[ err ]);
    return;
  }
}

RCT_EXPORT_METHOD(setupDevice:(NSString *)userId
                  tokenId:(NSString *)tokenId
                  uuid:(NSString *)uuid)
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeSetupDevice];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  [OstWalletSdk setupDeviceWithUserId: userId tokenId:tokenId forceSync: false delegate: workflowCallback];
}

RCT_EXPORT_METHOD(activateUser: (NSString *) userId
                  pin: (NSString *) pin
                  passphrasePrefix: (NSString *) passphrasePrefix
                  expiresAfterInSecs: (NSString *) expiresAfterInSecs
                  spendingLimit: (NSString *) spendingLimit
                  uuid: (NSString *) uuid){
  
   OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeActivateUser];
    OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk activateUserWithUserId:userId
                               userPin:pin
                      passphrasePrefix:passphrasePrefix
                         spendingLimit:spendingLimit
                      expireAfterInSec: [expiresAfterInSecs doubleValue]
                              delegate:workflowCallback] ;
}

RCT_EXPORT_METHOD(addSession: (NSString *) userId
                  expiresAfterInSecs: (NSString *) expiresAfterInSecs
                  spendingLimit: (NSString *) spendingLimit
                  uuid: (NSString *) uuid )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeAddSession];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk addSessionWithUserId:userId spendingLimit:spendingLimit expireAfterInSec:[expiresAfterInSecs doubleValue] delegate:workflowCallback];
  
}

RCT_EXPORT_METHOD(executeTransaction: (NSString *) userId
                  tokenHolderAddresses: (NSString *) tokenHolderAddresses
                  amounts: (NSString *) amounts
                  ruleName: (NSString *) ruleName
                  meta: (NSString *) meta
                  uuid: (NSString *) uuid )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeExecuteTransaction];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  NSData *data = [tokenHolderAddresses dataUsingEncoding:NSUTF8StringEncoding];
  NSError *error = nil;
  
  NSArray *addressesArr = [NSJSONSerialization
               JSONObjectWithData:data
               options:0
               error:&error];
  
  if( error ){
    NSDictionary *err = [OstRNErrorUtils invalidJsonArrayError:@"rn_owrs_et_1"];
    [workflowCallback flowInterruptedWithWorkflowContext: context ostErrorDictionary: err];
    return;
  }

  data = [amounts dataUsingEncoding:NSUTF8StringEncoding];
  error = nil;
  NSArray *amountsArr = [NSJSONSerialization
               JSONObjectWithData:data
               options:0
               error:&error];
  
  if( error ){
     NSDictionary *err = [OstRNErrorUtils invalidJsonArrayError:@"rn_owrs_et_2"];
    [workflowCallback flowInterruptedWithWorkflowContext: context ostErrorDictionary: err];
    return;
  }
  
  NSDictionary *metaObj  = nil;
  if( nil != meta ){
    data = [meta dataUsingEncoding:NSUTF8StringEncoding];
    metaObj = [NSJSONSerialization
               JSONObjectWithData: data
               options: 0
               error: &error];
    
    if( error ){
      NSDictionary *err = [OstRNErrorUtils invalidJsonStringError:@"rn_owrs_et_3"];
      [workflowCallback flowInterruptedWithWorkflowContext: context ostErrorDictionary: err];
      return;
    }
  }
  
  
  //Convert rule name to know rule enum.
  OstExecuteTransactionType ruleType = OstExecuteTransactionTypeDirectTransfer;
  if ( [@"Pricer" caseInsensitiveCompare: ruleName] == NSOrderedSame ) {
    ruleType = OstExecuteTransactionTypePay;
  }
  
  
  [OstWalletSdk executeTransactionWithUserId:userId
                        tokenHolderAddresses:addressesArr
                                     amounts:amountsArr
                             transactionType: ruleType
                                        meta:metaObj
                                    delegate:workflowCallback];
}

RCT_EXPORT_METHOD(getDeviceMnemonics: (NSString *) userId
                  uuid: (NSString *) uuid )
{
  
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeGetDeviceMnemonics];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk getDeviceMnemonicsWithUserId:userId delegate:workflowCallback];
}

RCT_EXPORT_METHOD(authorizeCurrentDeviceWithMnemonics: (NSString *) userId
                  mnemonics: (NSString *) mnemonics
                  uuid: (NSString *) uuid )
{
  
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeAuthorizeDeviceWithMnemonics];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  NSArray *byteMnemonices = [mnemonics componentsSeparatedByString:@" "];
  [OstWalletSdk authorizeCurrentDeviceWithMnemonicsWithUserId:userId mnemonics:byteMnemonices delegate:workflowCallback];
  
}

RCT_EXPORT_METHOD(getAddDeviceQRCode: (NSString *) userId
                  successCallback:(RCTResponseSenderBlock)successCallback
                  errorCallback:(RCTResponseSenderBlock)errorCallback)
{
 
  NSError *error = nil;
  
  
  CIImage * img = [OstWalletSdk getAddDeviceQRCodeWithUserId:userId error: &error];
  if( error ){
    NSDictionary *err = [OstRNErrorUtils errorToJson: error internalCode: @"rn_owrs_gadqr_1"];
    errorCallback(@[ err ]);
    return;
  }
  CIContext *contextToUse = [[CIContext alloc]init];
  NSData *imgData = [contextToUse JPEGRepresentationOfImage: img
                                                 colorSpace: img.colorSpace
                                                    options:@{}];
  NSString *img64Str = [imgData base64EncodedStringWithOptions: NSDataBase64Encoding64CharacterLineLength];
  
  //Invoke successCallback
  successCallback(@[ img64Str ]);
  
}

RCT_EXPORT_METHOD(performQRAction: (NSString *) userId
                  data: (NSString *) data
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypePerformQRAction];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk performQRActionWithUserId:userId payload:data delegate:workflowCallback];
}

RCT_EXPORT_METHOD(resetPin: (NSString *) userId
                  appSalt: (NSString *) appSalt
                  currentPin: (NSString *) currentPin
                  newPin: (NSString *) newPin
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeResetPin];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk resetPinWithUserId:userId passphrasePrefix:appSalt oldUserPin:currentPin newUserPin:newPin delegate:workflowCallback];
}

RCT_EXPORT_METHOD(initiateDeviceRecovery: (NSString *) userId
                  pin: (NSString *) pin
                  appSalt: (NSString *) appSalt
                  deviceAddressToRecover: (NSString *) deviceAddressToRecover
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeInitiateDeviceRecovery];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk initiateDeviceRecoveryWithUserId:userId recoverDeviceAddress:deviceAddressToRecover userPin:pin passphrasePrefix:appSalt delegate:workflowCallback];
}

RCT_EXPORT_METHOD(abortDeviceRecovery: (NSString *) userId
                  pin: (NSString *) pin
                  appSalt: (NSString *) appSalt
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeAbortDeviceRecovery];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk abortDeviceRecoveryWithUserId:userId userPin:pin passphrasePrefix:appSalt delegate:workflowCallback];
}

RCT_EXPORT_METHOD(revokeDevice: (NSString *) userId
                  deviceAddress: (NSString *) deviceAddress
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeRevokeDeviceWithQRCode];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk revokeDeviceWithUserId:userId deviceAddressToRevoke:deviceAddress delegate:workflowCallback];
}

RCT_EXPORT_METHOD(updateBiometricPreference: (NSString *) userId
                  enable: (BOOL) enable
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeUpdateBiometricPreference];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
  
  [OstWalletSdk updateBiometricPreferenceWithUserId:userId enable:enable delegate:workflowCallback];
}

RCT_EXPORT_METHOD(logoutAllSessions: (NSString *) userId
                  uuid: (NSString *) uuid
                  )
{
  OstWorkflowContext *context = [[ OstWorkflowContext alloc] initWithWorkflowType:OstWorkflowTypeLogoutAllSessions];
  OstWorkFlowCallbackImpl *workflowCallback = [[OstWorkFlowCallbackImpl alloc] initWithId: uuid workflowContext:context];
 
  [OstWalletSdk logoutAllSessionsWithUserId:userId delegate:workflowCallback];
}

@end
