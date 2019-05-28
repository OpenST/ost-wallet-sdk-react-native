//
//  OstRNUtils.m
//  RNProject
//
//  Created by Rachin Kapoor on 23/05/19.
//  Copyright © 2019 Facebook. All rights reserved.
//

#import "OstRNErrorUtils.h"

static NSString* invalidJsonStringErrorMessage = @"";
static NSString* invalidJsonArrayErrorMessage = @"";
static NSString* invalidWorkflowErrorMessage = @"";


@implementation OstRNErrorUtils


+ (NSString *) invalidJsonString {
  return @"INVALID_JSON_STRING";
}

+ (NSString *) invalidJsonArray {
  return @"INVALID_JSON_ARRAY";
}

+ (NSString *) invalidWorkflow {
  return @"INVALID_WORKFLOW";
}

+ (NSString *) ERROR_DOMAIN {
  return @"OstSdkError";
}

+ (int) INVALID_WORKFLOW_CODE {
  return 2000;
}

+ (NSDictionary *) errorToJson: (NSError * _Nonnull) error internalCode:(NSString * _Nonnull) internalCode {
  return [OstRNErrorUtils errorToJson: error
                    internalCode: internalCode
                       errorCode: @"UNCAUGHT_EXCEPTION_HANDELED"];
}

+ (NSDictionary *) errorToJson:(NSError * _Nonnull)error internalCode:(NSString * _Nonnull)internalCode errorCode:(NSString * _Nonnull) errorCode{
  if ( [error isKindOfClass: OstError.class ] ) {
    return [error userInfo];
  }
  
  NSMutableDictionary *err = [[NSMutableDictionary alloc] init];
  
  err[OstJSONErrorKeys.errorCode] = errorCode;
  err[OstJSONErrorKeys.errorMessage] = [error description];
  err[OstJSONErrorKeys.internalErrorCode] = internalCode;
  err[OstJSONErrorKeys.isApiError] = 0;
  
  return err;
}

+ (NSDictionary *) invalidJsonStringError: (NSString * _Nonnull) internalCode {
  NSString *errorMessage = invalidJsonStringErrorMessage;
  return [OstError toUserInfoWithErrorMessage: errorMessage
                                    errorCode: OstRNErrorUtils.invalidJsonString
                                 internalCode: internalCode
                                    errorInfo: nil
                                   isApiError: false
                                     apiError: nil];
}

+ (NSDictionary *) invalidJsonArrayError: (NSString * _Nonnull) internalCode {
  NSString *errorMessage = invalidJsonArrayErrorMessage;
  return [OstError toUserInfoWithErrorMessage: errorMessage
                                    errorCode: OstRNErrorUtils.invalidJsonArray
                                 internalCode: internalCode
                                    errorInfo: nil
                                   isApiError: false
                                     apiError: nil];
}

+ (NSDictionary *) invalidWorkflowError: (NSString * _Nonnull) internalCode {
  NSString *errorMessage = invalidWorkflowErrorMessage;
  return [OstError toUserInfoWithErrorMessage: errorMessage
                                    errorCode: OstRNErrorUtils.invalidWorkflow
                                 internalCode: internalCode
                                    errorInfo: nil
                                   isApiError: false
                                     apiError: nil];
}

@end
