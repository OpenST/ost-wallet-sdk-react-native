import OstRedemptionConfig from "./ost-redemption-config";
import objectMerge from "lodash.merge";

class OstRedemableCustomConfig {
    constructor(){
        const config        = JSON.parse(JSON.stringify(OstRedemptionConfig)) || {};
        this.defaultConfig  = config["themeingConfig"];
        this.config         = {};
    }

    setConfig = (externalConfig={}) => {
        this.config = objectMerge(this.defaultConfig, externalConfig);
    }

    getBackArrowUri = () => {
        return this.config && this.config.common && this.config.common["backArrow"];
    }

    getWalletIconUri = () => {
        return this.config && this.config.common && this.config.common["walletIcon"];
    }

    getStoreIconUri = () => {
        return this.config && this.config.common && this.config.common["storeIcon"];
    }

    getHeader = () => {
        return this.config && this.config.skuListScreen && this.config.skuListScreen["header"];
    }

    getDescription = () => {
        return this.config && this.config.skuListScreen && this.config.skuListScreen["description"];
    }

    getSkuListNavHeader = () => {
        return this.config && this.config.skuListScreen && this.config.skuListScreen["navHeader"];
    }

    getSkuDetailsScreenNavHeader = () => {
        return this.config && this.config.skuDetailsScreen && this.config.skuDetailsScreen["navHeader"];
    }

    
}

export default new OstRedemableCustomConfig();