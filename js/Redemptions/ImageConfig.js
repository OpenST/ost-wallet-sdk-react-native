//TODO commenting 

class ImageConfig {
    constructor(){
        this.config ={};
    }

    setImageConfig = (config) => {
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

    
}

export default new ImageConfig();