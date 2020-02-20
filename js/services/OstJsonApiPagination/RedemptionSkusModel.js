import OstJsonApi from "../../OstJsonApi";
import {BaseModel} from "./BaseModel";

class RedemptionSkusModel extends BaseModel {

    constructor(userId , params, id, options ){
        super(params, id, options);
        this.userId = userId;
    }

    fetchFromJsonApi(){
      return new Promise((resolve, reject) => {
          OstJsonApi.getRedeemableSkus(this.userId, this.getParams() , (respones) => {
            this.isFetching = false;
            console.log("response list -------",respones);
            return resolve(this.dataReceived(respones));
          }, (error)=> {
            this.isFetching = false;
            return reject(error);
          })
      });
    }

    clone() {
      let Constructor = this.constructor;
      return new Constructor(this.userId , this.extraParams, this.id, this.options);
    }

}

export default RedemptionSkusModel;