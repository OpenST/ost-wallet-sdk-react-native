# OstTransaction Helper

## Introduction

Developer can call functions of transaction helper to execute transaction and setting up config for transaction.

## Set Transaction Config

Developer can set list of buckets for creating session. For details, Please refer [this](./OstTransactionConfig.md)

```js
import {OstTransactionHelper} from "@ostdotcom/ost-wallet-sdk-react-native/js/index"

OstTransactionHelper.setTxConfig(ost-tx-config);
```

## Execute Direct Transfer

Execute direct transfer can be performed by calling 

><b>Note</b> <br />
>Developer needs to create a class extends from OstWalletUIWorkflowCallback and write logic to get passphrase prefix from their application server. Please refer [this](./OstWalletUI.md) section for documentation.

```js 
import {OstTransactionHelper} from "@ostdotcom/ost-wallet-sdk-react-native/js/index"

const ostUserId = <OstUserId>
const txMeta = {"type": "user_to_user", "name": "Tokens sent", "details": "Sending tokens vis direct transafer"};
const workflowCallback = new OstWalletUIWorkflowCallback()

let uuid = OstTransactionHelper.executeDirectTransfer(ostUserId, [tokenValue], [token_holder_address], txMeta, workflowCallback);

OstWalletSdkUI.subscribe(uuid,  OstWalletSdkUI.EVENTS.flowComplete, (workflowContext, contextEntity) => {
  //functionality for transaction success
});
OstWalletSdkUI.subscribe(uuid,  OstWalletSdkUI.EVENTS.flowInterrupt, (workflowContext, ostError) => {
  //functionality for transaction failed
});
OstWalletSdkUI.subscribe(uuid,  OstWalletSdkUI.EVENTS.requestAcknowledged, (workflowContext, contextEntity) => {
	//functionality for transaction ack.
});
```

New session will be created with appropriate bucket, if sdk won't get any active session for given spending limit. 
