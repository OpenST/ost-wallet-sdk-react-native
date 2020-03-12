# OstWallet Redemption Config

## Introduction

App developers can configure the text shown on redemption page.

To configure the content, the sdk needs to be provided with [JSON object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).

## Dictionary Data Structure

Here is the small sample json representation of the configuration.

```json
{
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
}
```
In the above example:

* The key `common` includes options to configure the wallet icon in header and the store icon.
* The key `skuListScreen` allows to configure the navigation header and the header and description shown on the redemption store list page.
* The key `skuDetailsScreen` allows to configure the navigation header shown on the redemption store details page.

## Redemption Config

The following are the customizable options provided. These can be set in the above config.

| customizable component                                      | Config Keys                                                   | Config Type          |
| --------------------------------------    | --------------------------------------------------    | ------------------------------- |
| Wallet icon      				            | - walletIcon                        			        | Custom icon Image to be rendered.                |                                                                                 
| Store icon                      	        | -  storeIcon 				                            | Custom icon Image to be rendered. 			     |
| Skulist Header    			            | - skuListScreen.header                      	        | String                                                   |
| Skulist Description                       | - skuListScreen.description                           | String  |                                                                                          
| SkuDetails Screen Navigation header       | - skuDetailsScreen.navHeader                          | String  |
| Skulist Screen Navigation header          | - skuListScreen.navHeader                             | String|
