import React from 'react';
import { View, Image, Text, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
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
        this.state = {
            refreshing: false
        }
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

    onPullToRefresh = ()=> {
      this.listRef.refresh();
    }

    __setState = (state) => {
      if(!state) return;
      this.setState(state);
    }

    beforeRefresh = () => {
      this.__setState({
        refreshing: true
      });
    }

    onRefresh = ( res ) => {
      this.__setState({
        refreshing: false
      })
    }

    onRefreshError = ( error ) => {
      this.__setState({
        refreshing: false
      })
    }

    setListRef = (ref) => {
      this.listRef = ref;
    }

    setScrollViewRef  = (ref) => {
      this.scrollViewRef = ref
    }

    render(){
      const storeLogo = OstRedemableCustomConfig.getStoreIconUri() , 
            header = OstRedemableCustomConfig.getHeader(),
            description = OstRedemableCustomConfig.getDescription()
      ;
        return (<SafeAreaView style={styles.container}>
                <ScrollView ref = {this.setScrollViewRef}
                    refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onPullToRefresh} />}
                >
                    <View styles={styles.headingWrapper}>
                        {storeLogo && <Image source={storeLogo} style={styles.logoSkipFont} />}
                        {header && <Text style={styles.title}>{header}</Text> }  
                        {description && <Text style={styles.description}>{description}</Text> }
                    </View>
                    <SkusList onRef={this.setListRef} refreshing={this.state.refreshing} userId={this.userId}
                              beforeRefresh={this.beforeRefresh} onRefresh={this.onRefresh} onRefreshError={this.onRefreshError}
                    />
                </ScrollView>
           </SafeAreaView>
        );}
}

export default OstRedeemableSkus;