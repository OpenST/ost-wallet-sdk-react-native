# OstWallet Redemption Config

## Introduction

App developers can configure the text shown on redemption page.

To configure the content, the sdk needs to be provided with [JSON object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).

The default configuration can be found [here](../js/Redemptions/ost-redemption-config.json).

## Dictionary Data Structure

Here is the small sample json representation of the configuration.

```json
{
  "themeingConfig": {
    "common": {
        "walletIcon": null,
        "storeIcon": null
    },
    "skuListScreen": {
        "navHeader": null,
        "header": null,
        "description": null
    },
    "skuDetailsScreen": { 
      "navHeader": null
    }  
  },
  "transactionMeta" : {
    "name": "redemption",
    "type": "user_to_company"
  }
}
```
In the above example:

* The first-level key `themeingConfig` allows to configure the icons and text content.
* The first-level key `transactionMeta` allows to configure the transaction meta properties like name and type.
* The second-level key `common` includes options to configure the wallet icon in header and the store icon.
* The second-level key `skuListScreen` allows to configure the navigation header and the header and description shown on the redemption store list page.
* The second-level key `skuDetailsScreen` allows to configure the navigation header shown on the redemption store details page.
