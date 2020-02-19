class OstRedemableCustomConfig {
    constructor(){
        this.config ={
            backArrow: null, 
            walletIcon: null,
            storeIcon: null,
            header: null,
            description: "" //@TODO Ashutosh set default description
        };
    }

    setConfig = (config) => {
        if(!config) return;
        this.config= config
    }

    getBackArrowUri = () => {
        return this.config["backArrow"];
    }

    getWalletIconUri = () => {
        return this.config["walletIcon"];
    }

    getStoreIconUri = () => {
        return this.config["storeIcon"];
    }

    getHeader = () => {
        return this.config["header"];
    }

    getDescription = () => {
        return this.config["description"];
    }

    
}

export default new OstRedemableCustomConfig();