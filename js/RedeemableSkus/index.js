import React from 'react';
import { View, Image, Text, ScrollView, SafeAreaView, RefreshControl } from 'react-native';
import styles from './styles';
import SkusList from './SkusList';

const HeaderRight = (props) => {
    return (
        <View style={styles.headerRightWrapper}>
             {props.walletIcon ? <Image source={props.walletIcon} style={styles.walletImgSkipFont} /> : <React.Fragment/>}
             <Text style={styles.balanceText}>156</Text>
        </View>
    )
}

class RedeemableSkusScreen extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        let walletIcon = navigation.getParam('walletIcon');
        return {
          title: '',
          headerStyle: {
            backgroundColor: 'white',
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.1,
            shadowRadius: 3
          },
          headerTitleStyle: {
            fontFamily: 'AvenirNext-Medium'
          },
          headerBackImage: navigation.getParam('backImage') || null,
          headerRight: <HeaderRight walletIcon={walletIcon}/>
        };
      };
    
    constructor( props ){
        super(props);
        this.userId = this.props.userId || props.navigation.getParam("ostUserId");
        this.state = {
            refreshing: false
        }
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