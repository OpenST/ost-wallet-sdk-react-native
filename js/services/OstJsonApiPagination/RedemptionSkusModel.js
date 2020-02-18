import OstJsonApi from "../../OstJsonApi";
import FetchBase from "./BaseModel";

class FetchRedemptionSkus extends FetchBase {

    constructor(userId , params, id, options ){
        super(params, id, options);
        this.userId = userId;
    }

    fetchFromJsonApi(){
      return new Promise((resolve, reject)=> {
          OstJsonApi.getRedeemableSkus(this.userId, this.getParams() , (respones) => {
            this.isFetching = true;
            return resolve(this.dataReceived(respones));
          }, (error)=> {
            this.isFetching = true;
            return reject(error);
          })
      });
    }

}

export default FetchRedemptionSkus;