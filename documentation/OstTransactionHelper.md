# Ost Transaction Helper

## Introduction

Developer can call functions of transaction helper to execute transaction and setting up config for transaction.

## Configuration

App developers can configure session `expiration_time` and `spending_limit` while executing transaction. To configure the session creation parameters (session buckets), the sdk needs to be provided with JSON object. The default configuration can be found [here](../js/TransactionHelper/ost-transaction-config.json).

### Configuration Data Structure

Here is the small sample json representation of the configuration.

```js
{
  "session_buckets": [
    {
      expiration_time: 60*60*24*30*2, //2 months
      spending_limit: '10'
    },
    {
      expiration_time: 60*60*24*30, //1 months
      spending_limit: '50'
    },
    {
      expiration_time: 60*60*24, //24 hours
      spending_limit: '100'
    },
    {
      expiration_time: 60*60*1, //1 hour
      spending_limit: '1000'
    }
  ]
}
```

In the above example:

* The first-level key `session_buckets` corresponds to list of buckets for creating session. The bucket selection is 
depends on `spending_limit`. 
* The second-level keys
  - `expiration_time` : corresponds to expiry time of session.
  - `spending_limit`  : corresponds to spending limit of session.

Above configuration allows user to execute transction of spending limit `1000`. SDK throws error, if user makes transaction above `1000`.

### Set Transaction Config

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
