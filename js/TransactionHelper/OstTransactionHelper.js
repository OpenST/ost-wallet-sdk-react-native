import BigNumber from 'bignumber.js';
import OstWalletSdk from '../OstWalletSdk';
import OstWalletSdkUI from  '../OstWalletSdkUI';
import {sdkErrorHelper, USER_UNAUTHORIZED, DEFAULT_CONTEXT} from '../helpers/OstSdkErrorHelper';
import OstWalletUIDelegate from '../OstWalletUIWorkflowCallback'
import OstWalletDelegate  from '../OstWalletWorkFlowCallback'
import EventEmitter from 'eventemitter3';
import objectMerge from "lodash.merge";

import uuidv4 from 'uuid/v4';
import { setInstance } from '../callbackHandlers/OstWalletSdkUICallbackManager';
import OstWalletUIWorkFlowCallback from "../OstWalletUICoreCallback";

import defaultTransactionConfig from "./ost-transaction-config";

let transactionConfig = {};

class OstTransactionHelper {
  constructor() {
    this.setTxConfig();
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
    externalConfig = externalConfig || {};
    let masterConfig = JSON.parse(JSON.stringify(defaultTransactionConfig));

    // Deep Merge.
    objectMerge(masterConfig, externalConfig);

    let sortedSessionBuckets = this.sortConfig(masterConfig.session_buckets);
    masterConfig.session_buckets = sortedSessionBuckets;

    transactionConfig = masterConfig;
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
    this.decimalAmounts = [];
    this.addresses = addresses;
    this.txMeta = txMeta;
    this.ruleName = ruleName
    this.token = null;
    this.user = null;


    this.totalTxAmount = new BigNumber('0')

    setInstance(this)
  }

  async perform() {
    try {


      //getUser
      await this.getOstUser()
      if (!this.user) {
        //throw error
      }

      //getToken
      await this.getToken()

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

  getOstUser() {
    return new Promise((resolve, reject) => {
      OstWalletSdk.getUser(this.userId, (ostUser) => {
        this.user = ostUser;
        resolve(ostUser);
      });
    });
  }

  getToken() {
    return new Promise((resolve, reject) => {
      let tokenId = this.user.token_id;
      OstWalletSdk.getToken(tokenId, (ostToken) => {
        this.token = ostToken;
        resolve(ostToken);
      })
    });
  }

  getTokenDecimal() {
    return this.token.decimals;
  }

  getTotalTransctionAmount() {
    let totalAmount = new BigNumber('0');

    for (amount of this.amounts) {
      let decimalAmount = this.toDecimal(amount);
      this.decimalAmounts.push(decimalAmount)

      let bnAmount = new BigNumber(decimalAmount);
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

      OstWalletSdkUI.addSession(this.userId, sessionKeyExpiryTime, spendingLimit, delegate);
    })
  }

  getSpedingLimitAndExpiryTimeBucket() {
    let validBucket = {};
    for(bucket of transactionConfig.session_buckets) {
      let decimalSpedingLimit = this.toDecimal(bucket.spending_limit)
      let bucketSpendingLimit = new BigNumber(decimalSpedingLimit);
      if (this.totalTxAmount.lte(bucketSpendingLimit)) {
        Object.assign(validBucket, bucket)
        validBucket.spending_limit = decimalSpedingLimit
        break;
      }
    }

    return validBucket
  }

  toDecimal(val) {
    val = BigNumber(val);
    let exp = BigNumber(10).exponentiatedBy(this.getTokenDecimal());
    return val.multipliedBy(exp).toString(10);
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
      this.decimalAmounts,
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