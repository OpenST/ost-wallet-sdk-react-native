import BigNumber from 'bignumber.js';

class Pricer {

    constructor(){
        let token = {}//TODO ask sdk team
        this.decimals = token.decimal || 18;
    }

    fromDecimal(val){
        if (!val || !this.decimals) return '';
        val = BigNumber(val);
        let exp = BigNumber(10).exponentiatedBy(this.decimals);
        return val.dividedBy(exp).toString(10);
    }

    toDecimal(val){
        if (!val || !this.decimals) return '';
        val = BigNumber(val);
        let exp = BigNumber(10).exponentiatedBy(this.decimals);
        return val.multipliedBy(exp).toString(10);
    }

    toBtPrecision(bt , precession=2){
        if (!bt) return '';
        bt = String(bt);
        bt = BigNumber(bt);
        return bt.decimalPlaces(precession, 1).toString(10);
    }
}

export default new Pricer();