/*
 Copyright © 2019 OST.com Inc

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0
 */

import { NativeModules } from 'react-native';
const { OstWalletSdkUI } = NativeModules;

class OstWalletRNSdkUI {
  /**
   * Active user
   * @param {String} userId - Ost User id
   * @param {String} spendingLimit - spending limit once in a transaction of session
   * @param {String} expiresAfterInSecs - session key expiry time.
   * @param {OstWalletUIWorkFlowCallback} workflow - callback implementation instances for application communication
   * @public
   */
  activateUser(userId, spendingLimit, expiresAfterInSecs, workflow) {
    OstWalletSdkUI.activateUser(userId, spendingLimit, String(expiresAfterInSecs), workflow.uuid );
  }
}

export default new OstWalletRNSdkUI();