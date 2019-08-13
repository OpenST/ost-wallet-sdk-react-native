//
/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
*/
  

#import "OstUICallbackImpl.h"
#import <OstWalletSdk/OstWalletSdk-Swift.h>
#import "OstMessageBus.h"
#import "OstPassphrasePrefixAcceptWrap.h"

static NSMutableDictionary *uiCallbackImplMap = nil;

@implementation OstUICallbackImpl

+ (OstUICallbackImpl *) getInstance:(NSString *) uuid
{
  return uiCallbackImplMap[uuid];
}

- (instancetype) initWithId:(NSString * _Nonnull) uuId
{
  self = [super init];
  if (self) {
    if ( uiCallbackImplMap == nil) {
      uiCallbackImplMap = [[NSMutableDictionary alloc] init];
    }
    
    uiCallbackImplMap[uuId] = self;
    self.uuid = uuId;
  }
  return self;
}

-(void)getPassphraseWithOstUserId:(NSString *)ostUserId workflowContext:(OstWorkflowContext *)workflowContext delegate:(id<OstPassphrasePrefixAcceptDelegate>)delegate {

  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"ostWorkflowId"] = self.uuid;
  params[@"userId"] = ostUserId;
  params[@"ostWorkflowContext"] = workflowContext;

  __unused OstPassphrasePrefixAcceptWrap *interact = [[OstPassphrasePrefixAcceptWrap alloc] initWithCallback: delegate workflowCallbackId: self.uuid];

  [self invokeCallback: @"getPassphrase"
                params: params
          interactName: @"OstPassphrasePrefixAcceptWrap"
            interactId: interact.uuid];
}

- (void)flowCompleteWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext contextEntity:(OstContextEntity * _Nonnull)contextEntity {
  
  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"ostWorkflowId"] = self.uuid;
  params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
  params[@"ostContextEntity"] = [self convertContextEntity: contextEntity
                                              workflowType: workflowContext.workflowType];
  
  [self invokeCallback: @"flowComplete"
                params: params
          interactName: nil
            interactId: nil];
}

- (void)flowInterruptedWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext error:(OstError * _Nonnull)error {
  
  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"ostWorkflowId"] = self.uuid;
  params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
  params[@"ostError"] = [error userInfo];
  
  [self invokeCallback: @"flowInterrupt"
                params: params
          interactName: nil
            interactId: nil];
}

- (void)requestAcknowledgedWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext contextEntity:(OstContextEntity * _Nonnull)contextEntity {
  
  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"ostWorkflowId"] = self.uuid;
  params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
  params[@"ostContextEntity"] = [self convertContextEntity: contextEntity
                                              workflowType: workflowContext.workflowType];
  [self invokeCallback: @"requestAcknowledged"
                params: params
          interactName: nil
            interactId: nil];
}

- (void) invokeCallback:(NSString *) methodName
                 params:(NSMutableDictionary *)params
           interactName:(NSString *)interactName
             interactId: (NSString *) interactId {
  
  NSMutableDictionary *obj = [[NSMutableDictionary alloc] init];
  obj[@"uuid"] = self.uuid;
  obj[@"functionName"] = methodName;
  if ( nil != params) {
    obj[@"params"] = params;
  }
  
  if ( nil != interactName && interactName.length > 0) {
    obj[@"interactName"] = interactName;
  }
  
  if ( nil != interactId && interactId.length > 0) {
    obj[@"interactuuid"] = interactId;
  }
  
  OstMessageBus *bus = [OstMessageBus getInstance];
  [bus sendEventWithData: obj forEvent: [bus getEventNameForType:@"sdkui"]];
  bus = nil;
  
}

- (NSMutableDictionary *) convertWorkflowContext: (OstWorkflowContext *) workflowContext {
  NSMutableDictionary *data = [[NSMutableDictionary alloc] init];
  data[@"WORKFLOW_TYPE"] = [self getWorkflowTypeName: workflowContext.workflowType];
  data[@"WORKFLOW_ID"] = [self uuid];
  data[@"NATIVE_UI_WORKFLOW_ID"] = [workflowContext getWorkflowId];
  return data;
}

- (NSString *) getWorkflowTypeName: (OstWorkflowType) workflowType {
  switch ( workflowType ) {
      case OstWorkflowTypeSetupDevice: return @"SETUP_DEVICE";
      case OstWorkflowTypeActivateUser: return @"ACTIVATE_USER";
      case OstWorkflowTypeAddSession: return @"ADD_SESSION";
      case OstWorkflowTypeGetDeviceMnemonics: return @"GET_DEVICE_MNEMONICS";
      case OstWorkflowTypePerformQRAction: return @"PERFORM_QR_ACTION";
      case OstWorkflowTypeExecuteTransaction: return @"EXECUTE_TRANSACTION";
      case OstWorkflowTypeAuthorizeDeviceWithQRCode: return @"AUTHORIZE_DEVICE_WITH_QR_CODE";
      case OstWorkflowTypeAuthorizeDeviceWithMnemonics: return @"AUTHORIZE_DEVICE_WITH_MNEMONICS";
      case OstWorkflowTypeInitiateDeviceRecovery: return @"INITIATE_DEVICE_RECOVERY";
      case OstWorkflowTypeAbortDeviceRecovery: return @"ABORT_DEVICE_RECOVERY";
      case OstWorkflowTypeRevokeDevice: return @"REVOKE_DEVICE";
      case OstWorkflowTypeResetPin: return @"RESET_PIN";
      case OstWorkflowTypeLogoutAllSessions: return @"LOGOUT_ALL_SESSIONS";
      case OstWorkflowTypeUpdateBiometricPreference: return @"UPDATE_BIOMETRIC_PREFERENCE";
    default: return @"UNKNOWN";
  }
}

- (NSMutableDictionary *) convertContextEntity: (OstContextEntity *) contextEntity workflowType: (OstWorkflowType) workflowType {
  NSMutableDictionary *data = [[NSMutableDictionary alloc] init];
  data[@"entityType"] = [self getContextEntityTypeName: contextEntity.entityType];
  data[@"message"] = @"";
  
  if ( [contextEntity.entity isKindOfClass: (OstBaseEntity.class)] ) {
    OstBaseEntity *bEntity = (OstBaseEntity *) contextEntity.entity;
    data[@"entity"] = bEntity.data;
  } else if ( OstWorkflowTypeGetDeviceMnemonics == workflowType ) {
    NSArray *mnemonics = (NSArray *) contextEntity.entity;
    data[@"entity"] = [mnemonics componentsJoinedByString:@" "];
    data[@"entityType"] = @"string";
  } else {
    data[@"entity"] =contextEntity.entity;
  }
  
  return data;
}
- (NSString *) getContextEntityTypeName: (OstEntityType) workflowType {
  switch (workflowType) {
      case OstEntityTypeUser: return @"user";
      case OstEntityTypeTransaction: return @"transaction";
      case OstEntityTypeTokenHolder: return @"token_holder";
      case OstEntityTypeSession: return @"session";
      case OstEntityTypeDevice: return @"device";
      case OstEntityTypeRecoveryOwner: return @"recovery_owner";
      case OstEntityTypeString: return @"string";
      case OstEntityTypeDictionary: return @"json";
      case OstEntityTypeArray: return @"array";
      case OstEntityTypeBoolean: return @"boolean";
    default: return @"unknown";
  }
}
 
 
  
  @end
