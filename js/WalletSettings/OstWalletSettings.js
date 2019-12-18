import WalletSettingsConfig from "./ost-wallet-settings-config";
import objectMerge from "lodash.merge";

import {sdkErrorHelper} from '../helpers/OstSdkErrorHelper'

const ItemsThatNeedCamera = ["add_another_device"];

class OstWalletSettingsClass {
  constructor() {
    // Define the config.
    this.setMasterConfig();
  }

  setMasterConfig( externalConfig ) {
    externalConfig = externalConfig || {};
    let masterConfig = JSON.parse(JSON.stringify(WalletSettingsConfig));
    
    // Deep Merge.
    objectMerge(masterConfig, externalConfig);
    this.masterConfig = masterConfig;

    // As deep merge may also merge Arrays.
    if ( externalConfig[ "item_display_order" ] ) {
      this.masterConfig[ "item_display_order" ] = externalConfig[ "item_display_order" ];
    }

    this._processDisplayOrder();
  }

  setErrorMessages(externalErrorMessages) {
    sdkErrorHelper.setErrorMessages(externalErrorMessages);
  }

  getMasterConfig() {
    return this.masterConfig;
  }

  getAllItemConfigs() {
    return this.masterConfig["item_configs"];
  }

  getDisplayOrder() {
    return this.masterConfig[ "item_display_order" ];
  }

  getItemConfig( itemId ) {
    let allConfigs = this.getAllItemConfigs();
    return allConfigs[ itemId ];
  }

  getItemContentConfig( itemId ) {
    let config = this.getItemConfig( itemId );
    if ( config ) {
      return config[ "content_config" ];
    }
    return null;
  }

  getSessionSpendingLimit() {
    let itemConfig = this.getItemConfig( "add_session" ) || {};
    let config = itemConfig.config || {};
    return config[ "spending_limit" ] || "0";
  }

  getSessionExpirationTime() {
    let itemConfig = this.getItemConfig( "add_session" ) || {};
    let config = itemConfig.config || {};
    let expirationTime = config[ "expiration_time"] || 0
    return parseInt(expirationTime)
  }

  getActivateUserSpendingLimit() {
    let itemConfig = this.getItemConfig( "activate_user" ) || {};
    let config = itemConfig.config || {};
    return config[ "spending_limit" ] || "1";
  }

  getActivateUserExpirationTime() {
    let itemConfig = this.getItemConfig( "activate_user" ) || {};
    let config = itemConfig.config || {};
    let expirationTime = config[ "expiration_time"] || 1
    return parseInt(expirationTime)
  }


  getOstViewEndpoint() {
    let itemConfig = this.getItemConfig( "wallet_details" ) || {};
    let config = itemConfig.config || {};
    let viewEndpoint = config[ "ost_view_endpoint" ]

    if (viewEndpoint && viewEndpoint.length > 0 && typeof viewEndpoint === 'string') {
      return viewEndpoint
    }
    return null
  }

  _processDisplayOrder() {
    const allItemConfigs = this.getAllItemConfigs();
    const displayOrder = this.getDisplayOrder();
    for( itemId in allItemConfigs ) { if ( allItemConfigs.hasOwnProperty( itemId ) ) {
      const itemConfig = allItemConfigs[ itemId ];
      
      // Should this item be shown?
      if ( displayOrder.indexOf( itemId ) < 0 ) {
        itemConfig.shouldShow = false;
      } else {
        itemConfig.shouldShow = true;
      }

      // Does this item need Camera?
      if ( ItemsThatNeedCamera.indexOf(itemId) < 0 ) {
        itemConfig.needsCamera = false;
      } else {
        itemConfig.needsCamera = true;
      }
    }}
  }

};

const OstWalletSettings = new OstWalletSettingsClass();

export default OstWalletSettings;