import WalletSettingsConfig from "./ost-wallet-settings-config";
import objectMerge from "lodash.merge";

const ItemsThatNeedCamera = ["add-another-device"];

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
    if ( externalConfig[ "item-display-order" ] ) {
      this.masterConfig[ "item-display-order" ] = externalConfig[ "item-display-order" ];
    }

    this._processDisplayOrder();
  }

  getMasterConfig() {
    return this.masterConfig;
  }

  getAllItemConfigs() {
    return this.masterConfig["item-configs"];
  }

  getDisplayOrder() {
    return this.masterConfig[ "item-display-order" ];
  }

  getItemConfig( itemId ) {
    let allConfigs = this.getAllItemConfigs();
    return allConfigs[ itemId ];
  }

  getItemContentConfig( itemId ) {
    let config = this.getItemConfig( itemId );
    if ( config ) {
      return config[ "content-config" ];
    }
    return null;
  }

  getSessionSpendingLimit() {
    let itemConfig = this.getItemConfig( "add-session" ) || {};
    let config = itemConfig.config || {};
    return config[ "spending-limit" ] || "0";
  }

  getSessionExpirationTime() {
    let itemConfig = this.getItemConfig( "add-session" ) || {};
    let config = itemConfig.config || {};
    return config[ "expiration-time" ] || "0";
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