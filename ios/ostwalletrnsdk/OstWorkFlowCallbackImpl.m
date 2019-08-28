/*
 Copyright © 2019 OST.com Inc
 
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 */

#import "OstWorkFlowCallbackImpl.h"
#import "OstMessageBus.h"
#import "OstDeviceRegisteredWrap.h"
#import "OstPinAcceptWrap.h"
#import "OstVerifyDataWrap.h"

static NSMutableDictionary *workFlowCallbackImplMap =nil;

@interface OstWorkFlowCallbackImpl()
@end

@implementation OstWorkFlowCallbackImpl

+ (OstWorkFlowCallbackImpl *) getInstance:(NSString *) uuid
{
  return workFlowCallbackImplMap[uuid];
}

- (instancetype) initWithId:(NSString * _Nonnull) uuId workflowContext: ( OstWorkflowContext *) workflowContext
{
  self = [super init];
  if (self) {
    if ( workFlowCallbackImplMap == nil) {
      workFlowCallbackImplMap = [[NSMutableDictionary alloc] init];
    }
    
    workFlowCallbackImplMap[uuId] = self;
    self.uuid = uuId;
    self.pseudoContext = workflowContext;
  }
  return self;
}

- (void)flowCompleteWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext ostContextEntity:(OstContextEntity * _Nonnull)ostContextEntity {
  
  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
  params[@"ostContextEntity"] = [self convertContextEntity: ostContextEntity workflowType: workflowContext.workflowType];
  
  [self invokeCallback: @"flowComplete"
                params: params
          interactName: nil
            interactId: nil];
}

- (void)flowInterruptedWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext error:(OstError * _Nonnull)error {
  [self flowInterruptedWithWorkflowContext: workflowContext ostErrorDictionary: [error userInfo]];
}

- (void)flowInterruptedWithWorkflowContext:(OstWorkflowContext * _Nullable )workflowContext ostErrorDictionary: (NSDictionary *) error {
  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"ostError"] = error;
  
  if( nil == workflowContext ){
    workflowContext = [self pseudoContext];
  }
  
   params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
  
  [self invokeCallback: @"flowInterrupt"
                params: params
          interactName: nil
            interactId: nil];
}

- (void)registerDevice:(NSDictionary<NSString *,id> * _Nonnull)apiParams delegate:(id<OstDeviceRegisteredDelegate> _Nonnull)delegate {
  NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
  params[@"apiParams"] = apiParams;
  
  OstDeviceRegisteredWrap *interact = [[OstDeviceRegisteredWrap alloc] initWithCallback: delegate workflowCallbackId: self.uuid];
  
  [self invokeCallback: @"registerDevice"
                params: params
          interactName: @"OstDeviceRegisteredWrap"
            interactId: interact.uuid];
}

- (void)getPin:(NSString * _Nonnull)userId delegate:(id<OstPinAcceptDelegate> _Nonnull)delegate {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"ostWorkflowContext"] = [self convertWorkflowContext: self.pseudoContext];
    params[@"userId"] = userId ;
  
   OstPinAcceptWrap *interact = [[OstPinAcceptWrap alloc] initWithCallback: delegate
                                                        workflowCallbackId: self.uuid];
  
    [self invokeCallback: @"getPin"
                  params: params
            interactName: @"OstPinAcceptWrap"
              interactId: interact.uuid];
}

- (void)invalidPin:(NSString * _Nonnull)userId delegate:(id<OstPinAcceptDelegate> _Nonnull)delegate {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"ostWorkflowContext"] = [self convertWorkflowContext: self.pseudoContext];
    params[@"userId"] = userId ;
  
    OstPinAcceptWrap *interact = [[OstPinAcceptWrap alloc] initWithCallback: delegate
                                                       workflowCallbackId: self.uuid];
    [self invokeCallback: @"invalidPin"
                  params: params
            interactName: @"OstPinAcceptWrap"
              interactId: interact.uuid];
}

- (void)pinValidated:(NSString * _Nonnull)userId {
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"ostWorkflowContext"] = [self convertWorkflowContext: self.pseudoContext];
    params[@"userId"] = userId ;
    [self invokeCallback: @"pinValidated"
                  params: params
            interactName: nil
              interactId: nil];
}

- (void)requestAcknowledgedWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext ostContextEntity:(OstContextEntity * _Nonnull)ostContextEntity {
  
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
    params[@"ostContextEntity"] = [self convertContextEntity: ostContextEntity workflowType: workflowContext.workflowType];
    [self invokeCallback: @"requestAcknowledged"
                  params: params
            interactName: nil
              interactId: nil];
}

- (void)verifyDataWithWorkflowContext:(OstWorkflowContext * _Nonnull)workflowContext ostContextEntity:(OstContextEntity * _Nonnull)ostContextEntity delegate:(id<OstValidateDataDelegate> _Nonnull)delegate {
  
    NSMutableDictionary *params = [[NSMutableDictionary alloc] init];
    params[@"ostWorkflowContext"] = [self convertWorkflowContext: workflowContext];
    params[@"ostContextEntity"] = [self convertContextEntity: ostContextEntity workflowType: workflowContext.workflowType];
  
    OstVerifyDataWrap *interact = [[OstVerifyDataWrap alloc] initWithCallback: delegate
                                                       workflowCallbackId: self.uuid];
  
    [self invokeCallback: @"verifyData"
                  params: params
            interactName: @"OstVerifyDataWrap"
              interactId: interact.uuid];
  
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
  [bus sendEventWithData: obj forEvent: [bus getEventNameForType:@"sdk"]];
  bus = nil;
  
}


- (NSMutableDictionary *) convertWorkflowContext: (OstWorkflowContext *) workflowContext {
  NSMutableDictionary *data = [[NSMutableDictionary alloc] init];
  data[@"WORKFLOW_TYPE"] = [self getWorkflowTypeName: workflowContext.workflowType];
  data[@"WORKFLOW_ID"] = [workflowContext getWorkflowId];
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
    case OstWorkflowTypeShowDeviceQR: return @"SHOW_DEVICE_QR";
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
