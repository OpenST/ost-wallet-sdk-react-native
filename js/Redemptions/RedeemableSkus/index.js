import React from 'react';
import { SafeAreaView } from 'react-native';
import { OstJsonApi } from '../../OstJsonApi';;

import HeaderRight from "../CommonComponents/HeaderRight";
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import OstThemeConfigHelper from '../../helpers/OstThemeConfigHelper';
import OstWalletUIWorkflowCallback from '../../OstWalletUIWorkflowCallback';
import styles from './styles';
import SkusList from './SkusList';
import BackArrow from '../CommonComponents/BackArrow';
import tokenHelper from "../TokenHelper";

function __getParam(navigation ,  paramName) {
  if(navigation && navigation.getParam){
    return navigation.getParam(paramName);
  }
  return null;
}


//TODO lets think on navigation checks

class OstRedeemableSkus extends React.PureComponent {
   
    static navigationOptions = ({ navigation }) => {
        const balance = __getParam(navigation , "balance") || 0 ,
             isCustomBack = !!OstRedemableCustomConfig.getBackArrowUri()
        ;
        let navigationOption = {
          title: __getParam(navigation , "navTitle") || "" ,
          headerStyle:  {
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.1,
            shadowRadius: 3
          },
          headerBackTitle: null,
          headerRight: <HeaderRight balance={balance}/>
        };
        if( isCustomBack ){
          navigationOption["headerBackImage"] = <BackArrow/>;
        }

        return Object.assign(navigationOption, OstThemeConfigHelper.getNavigationHeaderConfig());
    };
    
    constructor( props ){
        super(props);
    
        this.ostUserId = props.ostUserId || __getParam(props.navigation , "ostUserId");
        this.ostWalletUIWorkflowCallback = props.ostWalletUIWorkflowCallback || __getParam(props.navigation , "ostWalletUIWorkflowCallback");
        
        if( !this.ostUserId ) {
          let err = new Error("ostUserId can not be null");
          throw err;
        }

        if( !this.ostWalletUIWorkflowCallback || !(this.ostWalletUIWorkflowCallback instanceof OstWalletUIWorkflowCallback)  ) {
          let err = new Error("ostWalletUIWorkflowCallback can not be null and must be an instanceof OstWalletUIWorkflowCallback");
          throw err;
        }  

        this.init();
    }

    init(){
      if(!tokenHelper.token){
        tokenHelper.init(this.ostUserId).then(()=>{
          this.updateBalance();
        }).catch(()=>{})
      }else{
        this.updateBalance();
      }
    }

    updateBalance(){
      OstJsonApi.getBalanceForUserId(this.ostUserId, (res) => {
        let balance = res.balance && res.balance.available_balance;
        balance = tokenHelper.toBtPrecision(tokenHelper.fromDecimal(balance));
        this.props.navigation && this.props.navigation.setParams && this.props.navigation.setParams({
          balance
        })
      }, () => {});
    }
  
    componentWillUnmount(){
      this.__setState = () => {};
    }

    __setState = (state) => {
      if(!state) return;
      this.setState(state);
    }

    onItemClick = (item , index) => {
      if(this.props.onItemClick){
        this.props.onItemClick(item , index);
      } else {
        this.props.navigation && this.props.navigation.push && this.props.navigation.push('RedeemableSkuDetails', {'redemptionSku': item,
                                                            'ostUserId':this.ostUserId,
                                                            'ostWalletUIWorkflowCallback': this.ostWalletUIWorkflowCallback
                                                          });
      }
    }

    render(){
        return (<SafeAreaView style={styles.container}>
                    <SkusList ostUserId={this.ostUserId} onItemClick={this.onItemClick}/>
                </SafeAreaView>
              );}
}

export default OstRedeemableSkus;