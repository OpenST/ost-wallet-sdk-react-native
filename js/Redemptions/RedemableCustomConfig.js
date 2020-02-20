import OstRedmptionConfig from "./ost-redemption-config";
import objectMerge from "lodash.merge";

class OstRedemableCustomConfig {
    constructor(){
        const config        = JSON.parse(JSON.stringify(OstRedmptionConfig)) || {};
        this.defautlConfig  = config["themeingConfig"];
        this.config         = {};
    }

    setConfig = (externalConfig={}) => {
        this.config = objectMerge(this.defautlConfig, externalConfig);
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

    
}

export default new OstRedemableCustomConfig();