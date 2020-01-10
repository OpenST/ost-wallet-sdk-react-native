# OstTransaction Config

## Introduction

App developers can configure session `expiration_time` and `spending_limit` while executing transaction.

To configure the content, the sdk needs to be provided with [JSON object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).

The default configuration can be found [here](../js/TransactionHelper/ost-transaction-config.json).

## Dictionary Data Structure

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
    }
  ]
}
```

In the above example:

* The first-level key `session_buckets` corresponds to list of buckets for creating session. The bucket selection is 
depends on `spending_limit`. 
* The second-level key `expiration_time` corresponds to expiry time of session.
* The second-level key `spending_limit` corresponds to spending limit of session.

Above configuration allows user to execute transction of spending limit `100`. SDK throws error `INVALID_BUCKET` if user makes transaction above `100`.
