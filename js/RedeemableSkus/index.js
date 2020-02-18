import React from 'react';
import { View, Image, Text, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import { OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';

import HeaderRight from "../CommonComponents/Redeemption/HeaderRight";
import ImageConfig from  "../CommonComponents/Redeemption/ImageConfig";
import OstThemeConfigHelper from '../helpers/OstThemeConfigHelper';
import styles from './styles';
import SkusList from './SkusList';


class RedeemableSkusScreen extends React.PureComponent {
   
    static navigationOptions = ({ navigation }) => {
        const balance = navigation && navigation.getParam("balance") || 0 ,
             isCustomBack = !!ImageConfig.getBackArrowUri()
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

    static setImageConfig(config){
      ImageConfig.setImageConfig(config);
    }
    
    constructor( props ){
        super(props);
        this.userId = props.userId || props.navigation.getParam("ostUserId");
        this.state = {
            refreshing: false
        }
        OstJsonApi.getBalanceForUserId(this.userId, (res) => {
          let balance = res.balance && res.balance.available_balance;
          props.navigation.setParams({
            balance
          })
        }, (ostError) => {
          console.log(ostError)
        });
    }

    onPullToRefresh = ()=> {
      this.listRef.refresh();
    }

    beforeRefresh = () => {
      this.setState({
        refreshing: true
      })
    }

    onRefresh = ( res ) => {
      this.setState({
        refreshing: false
      })
    }

    onRefreshError = ( error ) => {
      this.setState({
        refreshing: false
      })
    }

    setListRef = (ref) => {
      this.listRef = ref;
    }

    render(){
        return (<SafeAreaView style={styles.container}>
                <ScrollView
                    ref = {(ref)=>{this.scrollViewRef = ref}}
                    refreshControl={
                        <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onPullToRefresh} />
                    }
                >
                    <View styles={styles.headingWrapper}>
                        {this.props.logo ? <Image source={this.props.logo} style={styles.logoSkipFont} /> : <React.Fragment/>}
                        <Text style={styles.title}>{this.props.title}Decrypt Gift Card Options</Text>  
                        <Text style={styles.description}>{this.props.description}Buy coupons and get great deals by using the tokens you have earned</Text> 
                    </View>
                    <SkusList onRef={this.setListRef} refreshing={this.state.refreshing} userId={this.userId}
                              beforeRefresh={this.beforeRefresh} onRefresh={this.onRefresh} onRefreshError={this.onRefreshError}
                    />
                </ScrollView>
           </SafeAreaView>
        );}
}

export default RedeemableSkusScreen;