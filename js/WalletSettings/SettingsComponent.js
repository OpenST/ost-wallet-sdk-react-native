import React, {PureComponent} from 'react';
import {Alert, FlatList, Linking, Platform, Text, TouchableWithoutFeedback, View} from 'react-native';
import OstWalletSdkHelper from "../helpers/OstWalletSdkHelper";
import WalletDetails from './WalletDetails'

import inlineStyle from './styles'

import {optionIds, WalletSettingsController} from './WalletSettingsController';
import OstThemeConfigHelper from '../helpers/OstThemeConfigHelper'
import OstWalletSettings from "@ostdotcom/ost-wallet-sdk-react-native/js/WalletSettings/OstWalletSettings";

let AndroidOpenSettings = null;
import('react-native-android-open-settings').then((pack) => {
  AndroidOpenSettings = pack.default;
}).catch( (err) => {

});

class SettingsComponent extends PureComponent {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    let navigationParams = {
      title: navigation.getParam('navTitle', 'Wallet Settings'),
      headerStyle:  {
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      }
    };

    return Object.assign(navigationParams, OstThemeConfigHelper.getNavigationHeaderConfig());
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      refreshing: false,
      modalVisible: false,
    };

    this.flatListLayout = null

    OstThemeConfigHelper.updateConfig();

    let ostUserId = this.props.ostUserId;
    let delegate = this.props.ostWalletUIWorkflowCallback;

    /// If using react-navigation.
    let navigation = this.props.navigation;
    if ( navigation && navigation.getParam ) {
      ostUserId = ostUserId || navigation.getParam("ostUserId");
      delegate  = delegate || navigation.getParam("ostWalletUIWorkflowCallback");
    }

    this.controller = new WalletSettingsController(ostUserId, delegate);
  }

  componentDidMount() {
    this.refreshList();
  }

  refreshList = (onFetch) => {
    if (this.state.refreshing) {
      return
    }
    this.setState({
      refreshing: true
    })
    this.controller.refresh((optionsData) => {
      this.setState({
        list: optionsData,
        refreshing: false
      });
      if (onFetch) {
        onFetch(optionsData)
      }
    }, true);
  };

  onSettingItemTapped = (item) => {
    this._processTappedOption(item);
  };

  async _processTappedOption(item) {
    if ( optionIds.walletDetails === item.id ) {
      this.showWalletDetails();
      return;
    }
    this._perfromWorkflow(item)
  }

  showWalletDetails() {
    this.setState({
      modalVisible: true
    })
  }

  hideWalletDetails() {
    this.setState({
      modalVisible: false
    })
  }

  _perfromWorkflow(item) {
    let workflowInfo = this.controller.perform(item.id);
    if ( workflowInfo ) {
      this.onWorkflowStarted( workflowInfo );
    } else {
      console.log("PepoError", "ws_indx_osit_1", "Some coding error occurred");
    }
  }

  enableAccess() {
    if (Platform.OS == 'android') {
      if (AndroidOpenSettings) {
        AndroidOpenSettings.appDetailsSettings();
      }
    } else {
      Linking.canOpenURL('app-settings:')
        .then((supported) => {
          if (!supported) {
            console.log("Can't handle settings url");
          } else {
            return Linking.openURL('app-settings:');
          }
        })
        .catch((err) => console.error('An error occurred', err));
    }
  }

  onWorkflowStarted = (workflowInfo) => {
    this.workflowInfo = workflowInfo;
    this.controller.setUIDelegate(this);
  };

  requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
  };

  flowComplete = (ostWorkflowContext , ostContextEntity) => {
    this.refreshList(() => {
    });
  };

  onUnauthorized = (ostWorkflowContext , ostError) => {
  };

  saltFetchFailed = (ostWorkflowContext , ostError) => {
  };

  userCancelled = (ostWorkflowContext , ostError) => {

  };

  deviceTimeOutOfSync = (ostWorkflowContext , ostError) => {
  };

  workflowFailed = (ostWorkflowContext , ostError) => {
  };

  _keyExtractor = (item, index) => `id_${item.id}`;

  _renderItem = ({ item, index }) => {
    const config = OstThemeConfigHelper;
    return (
      <TouchableWithoutFeedback onPress={() => this.onSettingItemTapped(item)}>
        <View style={[inlineStyle.listComponent, config.getBorderBottomColor()]}>
          <Text style={[inlineStyle.title, config.getC1Config()]}>{item.heading}</Text>
          <Text style={[inlineStyle.subtitle, config.getC2Config()]}>{item.description}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    let walletDetailsData = OstWalletSettings.getItemConfig("wallet_details")
    return (
      <>
        <WalletDetails viewData={walletDetailsData} modalVisible={this.state.modalVisible} userId={this.controller.userId} onBackButtonPress={() => this.hideWalletDetails()} flatlistLayout={this.flatListLayout}/>
      <View style= {inlineStyle.list}>
        <FlatList
          data={this.state.list}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          visible={false}
          onRefresh={this.refreshList}
          onLayout={(event) => {
            const {x, y, width, height} = event.nativeEvent.layout;
            this.flatListLayout = event.nativeEvent.layout;
          }}
        />
      </View>
      </>
    );
  }
}

export default SettingsComponent;
