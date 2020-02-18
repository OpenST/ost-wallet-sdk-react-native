import React from 'react';
import { View, Image, Text, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import HeaderRight from "../CommonComponents/Redeemption/HeaderRight";
import ImageConfig from  "../CommonComponents/Redeemption/ImageConfig";
import OstThemeConfigHelper from '../helpers/OstThemeConfigHelper';
import styles from './styles';
import SkusList from './SkusList';

class RedeemableSkusScreen extends React.PureComponent {
   
    static navigationOptions = ({ navigation }) => {
        const balance = navigation && navigation.getParam('balance')
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
        this.state = {
            refreshing: false
        }
    }

    onPullToRefresh = ()=> {

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
                    <SkusList refreshing={this.state.refreshing}/>
                </ScrollView>
           </SafeAreaView>
        );}
}

export default RedeemableSkusScreen;