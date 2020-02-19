import React from 'react';
import { SafeAreaView } from 'react-native';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';

import HeaderRight from "../CommonComponents/HeaderRight";
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import OstThemeConfigHelper from '../../helpers/OstThemeConfigHelper';
import styles from './styles';
import SkusList from './SkusList';

class OstRedeemableSkus extends React.PureComponent {
   
    static navigationOptions = ({ navigation }) => {
        const balance = navigation && navigation.getParam("balance") || 0 ,
             isCustomBack = !!OstRedemableCustomConfig.getBackArrowUri()
        ;
        let navigationOption = {
          title: navigation && navigation.getParam('navTitle')|| "",
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
          headerRight: <HeaderRight balance={balance}/>
        };
        if( isCustomBack ){
          navigationOption["headerBackImage"] = ""; //TODO @Preshita
        }

        return Object.assign(navigationOption, OstThemeConfigHelper.getNavigationHeaderConfig());
    };
    
    constructor( props ){
        super(props);
        this.userId = props.userId || props.navigation.getParam("ostUserId");
        OstJsonApi.getBalanceForUserId(this.userId, (res) => {
          let balance = res.balance && res.balance.available_balance;
          props.navigation.setParams({
            balance
          })
        }, (ostError) => {});
    }

    componentWillUnmount(){
      this.__setState = () => {};
      this.listRef = null;
      this.scrollViewRef = null;
    }

    __setState = (state) => {
      if(!state) return;
      this.setState(state);
    }

    onItemClick = (item) => {
      if(this.props.onItemClick){
        this.props.onItemClick();
      } else {
        this.props.navigation.push('RedeemableSkuDetails', {'skuObj': item});
      }
    }

    render(){
        return (<SafeAreaView style={styles.container}>
                    <SkusList userId={this.userId} onItemClick={this.onItemClick}/>
                </SafeAreaView>
              );}
}

export default OstRedeemableSkus;