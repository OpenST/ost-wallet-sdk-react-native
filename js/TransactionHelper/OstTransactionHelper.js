import BigNumber from 'bignumber.js';
import OstWalletSdk from '../OstWalletSdk';
import OstWalletSdkUI from  '../OstWalletSdkUI';
import OstWalletUIDelegate from '../OstWalletUIWorkflowCallback'
import OstWalletDelegate  from '../OstWalletWorkFlowCallback'
import EventEmitter from 'eventemitter3';
import objectMerge from "lodash.merge";

import uuidv4 from 'uuid/v4';
import { setInstance } from '../callbackHandlers/OstWalletSdkUICallbackManager';
import OstWalletUIWorkFlowCallback from "../OstWalletUICoreCallback";

import defaultTransactionConfig from "./ost-transaction-config";
import OstWalletUIWorkflowCallback from "../OstWalletUIWorkflowCallback";
import OstRNError from "../OstRNError/OstRNError";
import TokenHelper from "../helpers/TokenHelper";

let transactionConfig = {};

class OstTransactionHelper {
  
  constructor() {
    this.isExternalConfig = false;
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
    this.isExternalConfig = !!Object.keys(externalConfig).length;
    let masterConfig = JSON.parse(JSON.stringify(defaultTransactionConfig));

    // Deep Merge.
    objectMerge(masterConfig, externalConfig);

    let sortedSessionBuckets = this.sortConfig(masterConfig.session_buckets);
    masterConfig.session_buckets = sortedSessionBuckets;

    transactionConfig = masterConfig;
  }

  executeDirectTransfer(userId, amounts, addresses, txMeta, transferDelegate) {
    let obj = new OstTransactionExecutor(userId, 'direct transfer', amounts, addresses, txMeta, transferDelegate)
    obj.perform();

    return obj.uuid;
  }

  /**
   * @param {*} amount -  wei 
   * @param {*} decimal - Number
   */
  static getValidBucket(amount ,  decimal){
    let validBucket = null;
    if(!(amount instanceof BigNumber)){
      amount =  new BigNumber(amount);
    }
    for(bucket of transactionConfig.session_buckets) {
      let decimalSpedingLimit = TokenHelper.toDecimal(bucket.spending_limit , decimal) ;
      let bucketSpendingLimit = new BigNumber(decimalSpedingLimit);
      if (amount.lte(bucketSpendingLimit)) {
        validBucket = {};
        Object.assign(validBucket, bucket)
        validBucket.spending_limit = decimalSpedingLimit
        break;
      }
    }
    return validBucket
  }
}

class OstTransactionExecutor {
  constructor(userId, ruleName, amounts, addresses, txMeta, transferDelegate) {
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

    if ( !transferDelegate || !(transferDelegate instanceof OstWalletUIWorkflowCallback) ) {
      let err = new Error("transferDelegate can not be null and must be an instanceof OstWalletUIWorkflowCallback");
      throw err;
    }

    this.delegate = transferDelegate;


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
      this.onPerformCatch(err);
    }
  }

  onPerformCatch(err){
    let eName = OstWalletUIWorkFlowCallback.EVENTS.flowInterrupt;
    this.ee.emit(eName, err.ostWorkflowContext , err.ostError);
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
      let decimalAmount = TokenHelper.toDecimal(amount, this.getTokenDecimal());
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
        const ostWorkflowContext = {"WORKFLOW_TYPE": 'EXECUTE_TRANSACTION'}
        const errorData = {
          "error_code": "INVALID_BUCKET",
          "internal_error_code": "rn_js_th_oth_1",
          "error_message": "Valid bucket not found for given transaction value.",
          "is_api_error": false
        }
        const ostError = new OstRNError(errorData)
        return reject({"ostWorkflowContext": ostWorkflowContext, "ostError": ostError});
      }

      let spendingLimit = bucketForTx.spending_limit;
      let sessionKeyExpiryTime = parseInt(bucketForTx.expiration_time);
      let delegate = new OstWalletUIDelegate()

      delegate.getPassphrase = (userId, ostWorkflowContext, OstPassphrasePrefixAccept) => {
        this.delegate.getPassphrase(userId, ostWorkflowContext, OstPassphrasePrefixAccept);
      }

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
    return OstTransactionHelper.getValidBucket(this.totalTxAmount ,this.getTokenDecimal());
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

   this.callExecuteTransfer(executeTxDelegate);
  }

  callExecuteTransfer( executeTxDelegate ){
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

export {OstTransactionExecutor , OstTransactionHelper };

export default new OstTransactionHelper(); 

