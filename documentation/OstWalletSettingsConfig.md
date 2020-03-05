# OstWallet Settings Config

## Introduction

App developers can configure the text shown on settings page.

To configure the content, the sdk needs to be provided with [JSON object](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Objects/JSON).

The default configuration can be found [here](../js/WalletSettings/ost-wallet-settings-config.json).

## Dictionary Data Structure

Here is the small sample json representation of the configuration.

```json
{
  "item_display_order": [
	"activate_user",
  ],
  "item_configs": {
	"activate_user": {
	  "content_config": {
        "heading": "Activate User",
        "description": "User is not activated yet."
      },
      "config": {
        "spending_limit": "0",
        "expiration_time": 0
      }
	}
  }
}
```
In the above example:

* The first-level key `item_display_order` corresponds to sequence of allowed workflows.
* The first-level key `item_configs` corresponds to config for workflows.
* The second-level key `activate_user` corresponds to activate user workflow.
* The third-level key `content_config` corresponds to `heading` and `description` of workflows.
* The third-level key `config` corresponds to respective config for workflows.

## Supported Workflows

OstWalletSettings supports 13 workflows

| Configuration Keys                                      | Workflows                                                                      |
| ------------------------------------------------ |:--------------------------------------------------------------|
| activate_user      			 			  | Activate User              							 |
| wallet_details                      			  | Wallet Details              							 |
| recover_device    					  | Initialize Recovery        							 |
| add_session          		 			  | Add Session                							 |
| reset_pin           						  | Reset a User's PIN         							 |
| show_mnemonics      					  | Get Mnemonic Phrase        						 |
| authorize_device_with_mnemonics            | Authorize device using mnemonics 				 |
| abort_recovery       					  | Abort Device Recovery     					 	 |
| revoke_device        					  | Revoke Device              							 |
| add_another_device                                   | Scan QR Code to add another device                 	        |
| show_device_qr_code 	    			  | Get current Device QR code 						 |
| enable_biometrics				  	  | Use biometrics to authorize new Sessions and to confirm high value transactions. |
| disable_biometrics                               	 | Turn off biometrics and use PIN to authorize new Sessions and to confirm high value transactions. |

* All workflows have  `content_config`.
* `config` varies workflow to workflow.

## Workflow Config

Some workflows requires additional data. It can be passed to workflow by setting it in `config`.

| Workflows                                      | Config Keys                                                   | Config Type                         |
| -------------------------------------- | -------------------------------------------------- | ------------------------------- |
| activate_user      				   | - spending_limit                        			 | String                                  |
|                                                       | - expiration_time                       			 | Number				 |
| wallet_details                      	   | - ost_view_endpoint 	 				 | String					 |
| add_session    			          | - spending_limit                        			 | String                                  |
|                                                       | - expiration_time                       			 | Number				 |

