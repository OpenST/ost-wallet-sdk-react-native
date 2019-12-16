import BigNumber from 'bignumber.js';
import OstWalletSdk from '../OstWalletSdk';
import OstWalletSdkUI from  '../OstWalletSdkUI';
import {sdkErrorHelper, USER_UNAUTHORIZED, DEFAULT_CONTEXT} from '../helpers/OstSdkErrorHelper';
import OstWalletUIDelegate from '../OstWalletUIWorkflowCallback'
import OstWalletDelegate  from '../OstWalletWorkFlowCallback'
import EventEmitter from 'eventemitter3';

import uuidv4 from 'uuid/v4';
import { setInstance } from '../callbackHandlers/OstWalletSdkUICallbackManager';
import OstWalletUIWorkFlowCallback from "../OstWalletUICoreCallback";

let transactionConfig = {};

class OstTransactionHelper {
  constructor() {

  }

  sortConfig(sortData) {
    sortData.sort((a, b) => {
      let aBnSpendingLimit = new BigNumber(a.spending_limit);
      let bBnSpendingLimit = new BigNumber(b.spending_limit);
      return aBnSpendingLimit.minus(bBnSpendingLimit);
    });

    return sortData;
  }

  setTxConfig(externalConfig) {
    let sortedData = this.sortConfig(externalConfig.session_buckets);
    externalConfig.session_buckets = sortedData
    transactionConfig = externalConfig
  }

  executeDirectTransfer(userId, amounts, addresses, txMeta = null) {
    let obj = new OstTransactionExecutor(userId, 'direct transfer', amounts, addresses, txMeta)
    obj.perform();

    return obj.uuid;
  }
}

class OstTransactionExecutor {
  constructor(userId, ruleName, amounts, addresses, txMeta = null) {
    this.uuid = uuidv4();
    this.ee = new EventEmitter();
    this.userId = userId;
    this.amounts = amounts;
    this.addresses = addresses;
    this.txMeta = txMeta;
    this.ruleName = ruleName

    this.totalTxAmount = new BigNumber('0')

    setInstance(this)
  }

  async perform() {
    try {
      //get final tx amount
      this.totalTxAmount = this.getTotalTransctionAmount();

      //check is session available.
      const hasSession = await this.hasActiveSession();
      if (!hasSession) {
        //craete Session
        await this.createNewSession();
      }

      this.executeTransfer()
    }catch(err) {
      let eName = OstWalletUIWorkFlowCallback.EVENTS.flowInterrupt;
      this.ee.emit(eName, err.ostWorkflowContext , err.ostError);
    }
  }

  getTotalTransctionAmount() {
    let totalAmount = new BigNumber('0');

    for (amount of this.amounts) {
      let bnAmount = new BigNumber(amount);
      totalAmount = totalAmount.plus(bnAmount);
    }

    return totalAmount
  }

  hasActiveSession()  {
    return new Promise((resolve, reject) => {
      OstWalletSdk.getActiveSessionsForUserId(this.userId, this.totalTxAmount.toString(10), (activeSessions) => {
        if (activeSessions && activeSessions.length > 0) {
          resolve(true)
        }else {
          resolve(false)
        }
      });
    });
  }
  createNewSession() {
    return new Promise((resolve, reject) => {
      let bucketForTx = this.getSpedingLimitAndExpiryTimeBucket()
      if (!bucketForTx) {
        reject();
      }
      let spendingLimit = bucketForTx.spending_limit;
      let sessionKeyExpiryTime = parseInt(bucketForTx.expiry_time);
      let delegate = new OstWalletUIDelegate()

      delegate.flowComplete = (ostWorkflowContext, ostContextEntity) => {
        resolve(ostWorkflowContext, ostContextEntity)
      };

      delegate.flowInterrupt = (ostWorkflowContext, ostError) => {
        let errObject = {"ostWorkflowContext": ostWorkflowContext, "ostError": ostError}
        reject(errObject)
      };

      OstWalletSdkUI.addSession(userId, sessionKeyExpiryTime, spendingLimit, workflowDelegate);
    })
  }

  getSpedingLimitAndExpiryTimeBucket(val) {
    this.totalTxAmount = new BigNumber(val);
    let validBucket = null;
    for(bucket of transactionConfig.session_buckets) {
      let bucketSpendingLimit = new BigNumber(bucket.spending_limit);
      if (this.totalTxAmount.lte(bucketSpendingLimit)) {
        validBucket = bucket
        break;
      }
    }

    return validBucket
  }

  executeTransfer() {
    let executeTxDelegate = new OstWalletDelegate()
    executeTxDelegate.flowComplete = (workflowContext, contextEntity) => {
      let eName = OstWalletUIWorkFlowCallback.EVENTS.flowComplete;
      this.ee.emit(eName, workflowContext , contextEntity);
    }

    executeTxDelegate.flowInterrupt = (workflowContext, ostError) => {
      let eName = OstWalletUIWorkFlowCallback.EVENTS.flowInterrupt;
      this.ee.emit(eName, workflowContext , ostError);
    }

    executeTxDelegate.requestAcknowledged = (workflowContext, contextEntity) => {
      let eName = OstWalletUIWorkFlowCallback.EVENTS.requestAcknowledged;
      this.ee.emit(eName, workflowContext , contextEntity);
    }

    OstWalletSdk.executeTransaction(
      this.userId,
      this.addresses,
      this.amounts,
      this.ruleName,
      this.txMeta,
      executeTxDelegate
    )
  }

  getEventEmitter() {
    return this.ee;
  }
}

export default new OstTransactionHelper()