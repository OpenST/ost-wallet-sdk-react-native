import  OstWalletSdk from '../OstWalletSdk';
import BigNumber from 'bignumber.js';

class TokenHelper {

    constructor(){
        this.ostUserId = null;
        this.tokenId = null;
        this.user = null;
        this.token = null;
    }

    init(ostUserId) {
      if(!ostUserId) return Promise.reject();
      this.ostUserId =  ostUserId;
      return this.getOstUser(ostUserId).then((user)=> {
                const tokenId = user && user["token_id"];
                this.tokenId = tokenId;
                return this.getOstToken(tokenId).then((token)=> {
                          this.token = token;
                          return { user , token };
                        }).catch((error)=> {
                          //Ignore as there is no reject
                        })
              }).catch((error)=>{
               //Ignore as there is no reject
              });
    }

    getOstUser(id) {
        return new Promise((resolve, reject) => {
          OstWalletSdk.getUser(id, (user) => {
            if (user) {
              this.user =  user;  
              resolve(user);
            }
          })
        })
    }

    getOstToken(id) {
        id = id && id.toString() || "";
        return new Promise((resolve, reject) => {
          OstWalletSdk.getToken(id, (token) => {
            this.token = token;
            resolve(token)
          });
        });
    }

    getTokenHolderAddress(){
      const auxChain = this.token && this.token.auxiliary_chains , 
            firstAuxChain = auxChain && auxChain[0], 
            companyTokenHolders = firstAuxChain && firstAuxChain["company_token_holders"] ; 
      return companyTokenHolders && companyTokenHolders[0] || "";
     }
 
     getDecimals(){
       return this.token["decimals"]
     }

     getTokenSymbol(){
      return this.token["symbol"];
     }

    fromDecimal(val, decimals){
        decimals = decimals || this.getDecimals();
        if (!val || !decimals) return '';
        val = BigNumber(val);
        let exp = BigNumber(10).exponentiatedBy(decimals);
        return val.dividedBy(exp).toString(10);
    }

    toDecimal(val, decimals){
        decimals = decimals || this.getDecimals();
        if (!val || !decimals) return '';
        val = BigNumber(val);
        let exp = BigNumber(10).exponentiatedBy(decimals);
        return val.multipliedBy(exp).toString(10);
    }

    toBtPrecision(bt , precession=2){
        if (!bt) return '';
        bt = String(bt);
        bt = BigNumber(bt);
        return bt.decimalPlaces(precession, 1).toString(10);
    }

}

export default new TokenHelper();