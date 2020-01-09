import React, {PureComponent} from 'react';
import {Alert, FlatList, Linking, Platform, Text, TouchableWithoutFeedback, View, Image, Clipboard, Modal, Dimensions, SafeAreaView} from 'react-native';
import inlineStyle from './walletDetailsStyles';

import OstWalletSdk from '../OstWalletSdk';
import OstWalletSdkUI from '../OstWalletSdkUI';
import OstJsonApi from '../OstJsonApi';
import OstWalletSdkHelper from "../helpers/OstWalletSdkHelper";
import OstThemeConfigHelper from '../helpers/OstThemeConfigHelper';
import OstWalletSettings from './OstWalletSettings';
import {sdkErrorHelper, DEFAULT_CONTEXT, DEVICE_OUT_OF_SYNC,  USER_UNAUTHORIZED} from "../helpers/OstSdkErrorHelper";

let InAppBrowser = null;

class WalletDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      refreshing: false
    };

    this.userId = props.userId;
  }

  componentDidMount() {
    this.ostUser = null;
    this.ostDevice = null;
    this.token = null;
    this.cells = null;
    this.onRefresh();
  }

  onRefresh = () => {
    if( this.state.refreshing ) {
      return;
    }
    this.setState({
      refreshing: true
    });
    this._fetchUser();
  };

  _fetchUser() {
    OstWalletSdk.getUser(this.userId, (userData) => {
      if ( !userData ) {
        // What to do here?
      }

      // Store user data.
      this.ostUser = userData;

      // Get the device.
      this._fetchToken(userData.token_id);
    });
  }

  _fetchToken(tokenId) {
    OstWalletSdk.getToken(tokenId.toString(), (token) => {
      this.token = token;

      this._fetchDevice();
    })
  }

  _fetchDevice() {
    OstWalletSdk.getCurrentDeviceForUserId(this.userId, (device) => {
      if( device && OstWalletSdkHelper.canDeviceMakeApiCall( device ) ) {
        this._fetchDeviceFromServer(device);
        return;
      }
      // Make do with what we have.
      this._onDeviceFetch(device);
    });
  }

  _fetchDeviceFromServer(localDevice) {

    OstJsonApi.getCurrentDeviceForUserId(this.userId,( deviceApiResponse ) => {
      this._onDeviceFetch(deviceApiResponse)
    }, ( error ) => {
      let deviceEntity = {
        local_device: localDevice,
        result_type: "local_device"
      }

      this._onDeviceFetch(deviceEntity);
    });
  }

  _onDeviceFetch(deviceApiResponse) {
    if (deviceApiResponse) {
      let resultType = deviceApiResponse["result_type"];
      let device = deviceApiResponse[ resultType ];
      this.ostDevice = device;
    }
    this._buildList();
  }

  _buildList() {
    let cells = [];

    cells.push( this._buildUserStatusData() );
    cells.push( this._buildTokenIdData() );
    cells.push( this._buildTokenHolderAddressData() );
    cells.push( this._buildDeviceAddressData() );
    cells.push( this._buildDeviceStatusData() );
    cells.push( this._buildDeviceManagerAddressData() );
    cells.push( this._buildRecoveryKeyAddressData() );
    cells.push( this._buildRecoveryOwnerAddressData() );

    this.setState({
      list: cells,
      refreshing: false
    })
  }

  _buildTokenIdData() {
    return {
      "cellType": "text",
      "heading": "Token ID",
      "text": this.token ? this.token.id : ''
    };
  }

  _buildUserIdData() {
    return {
      "cellType": "copy",
      "heading": "OST User ID",
      "text": this.ostUser ? this.ostUser.id : ''
    };
  }

  _buildUserStatusData() {
    return {
      "cellType": "status",
      "heading": "User Status",
      "text": this.ostUser ? this.ostUser.status : ''
    };
  }

  _buildTokenHolderAddressData() {
    let viewEndPoint = OstWalletSettings.getOstViewEndpoint()
    let link = null
    if (viewEndPoint) {
      link = viewEndPoint + 'token/th-'+ this._getAuxChainId() + '-' + this._getUtilityBandedToken() + '-' + this.ostUser.token_holder_address;
    }

    return {
      "cellType": "link",
      "heading": "Token Holder Address",
      "text": this.ostUser ? this.ostUser.token_holder_address : '',
      "link": link
    };
  }

  _buildDeviceManagerAddressData() {
    let viewEndPoint = OstWalletSettings.getOstViewEndpoint()
    let link = null
    if (viewEndPoint) {
      link = viewEndPoint + 'address/ad-'+ this._getAuxChainId() + '-' + this.ostUser.device_manager_address;
    }

    return {
      "cellType": "link",
      "heading": "Device Manager Address",
      "text": this.ostUser ? this.ostUser.device_manager_address : '',
      "link": link
    };
  }

  _buildRecoveryKeyAddressData() {
    return {
      "cellType": "copy",
      "heading": "Recovery Key Address",
      "text": this.ostUser ? this.ostUser.recovery_address : ''
    };
  }

  _buildRecoveryOwnerAddressData() {
    let viewEndPoint = OstWalletSettings.getOstViewEndpoint()
    let link = null
    if (viewEndPoint) {
      link = viewEndPoint + 'address/ad-'+ this._getAuxChainId() + '-' + this.ostUser.recovery_owner_address;
    }
    return {
      "cellType": "link",
      "heading": "Recovery Owner Address",
      "text": this.ostUser ? this.ostUser.recovery_owner_address : '',
      "link": link
    };
  }

  _buildDeviceAddressData() {
    return {
      "cellType": "copy",
      "heading": "Device Address",
      "text": this.ostDevice ? this.ostDevice.address : ''
    };
  }

  _buildDeviceStatusData() {
    return {
      "cellType": "status",
      "heading": "Device Status",
      "text": this.ostDevice ? this.ostDevice.status : ''
    };
  }

  _getUtilityBandedToken() {
    return (this.token.auxiliary_chains[0]).utility_branded_token || '0x'
  }

  _getAuxChainId() {
    return ((this.token.auxiliary_chains[0]).chain_id).toString(10) || '0'
  }

  onCopyCellTapped = async (item) => {
    await Clipboard.setString(item.text);
  };

  onLinkCellTapped = async (item) => {
    if (item.link) {
      if(InAppBrowser && await InAppBrowser.isAvailable()) {

      }else {
        Linking.openURL(item.link)
      }
    }
  };

  backButtonTapped = () => {
    this.props.onBackButtonPress()
  }

  render() {

    return (
      <Modal
        style= {inlineStyle.list}
        animationType="slide"
        transparent={false}
        visible={this.props.modalVisible}>
        <SafeAreaView style={[inlineStyle.navigationBar, {backgroundColor: OstThemeConfigHelper.themeConfig.navigation_bar.tint_color}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>

          <TouchableWithoutFeedback onPress={this.backButtonTapped}>
            <View style={inlineStyle.closeContainer}>
              <Text style={[inlineStyle.closeText, {color: OstThemeConfigHelper.themeConfig.navigation_bar_header.tint_color}]}>X</Text>
            </View>
          </TouchableWithoutFeedback>

            <Text style={{fontSize: 17, fontWeight: '600', alignSelf: 'center', justifyContent:"center", color: OstThemeConfigHelper.themeConfig.navigation_bar_header.tint_color }}>{this.props.viewData.content_config.heading}</Text>
            <View style={{marginLeft:50}}></View>
          </View>
        </SafeAreaView>

        <FlatList
          onRefresh={this.onRefresh}
          data={this.state.list}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          visible={false}
        />
      </Modal>
    );
  }

  _keyExtractor = (item, index) => `id_${item.heading}_${item.text}`;

  _renderItem = ({ item, index }) => {
    switch ( item.cellType ) {
      case "text":
        return this._renderTextCell({item, index});
      case "status":
        return this._renderStatusCell({item, index});
      case "copy":
        return this._renderCopyCell({item, index});
      case "link":
        return this._renderLinkCell({item, index});
      default:
        return this._renderTextCell({item, index});
    }
  };

  _renderTextCell = ({item, index}) => {
    return (
      <View style={[inlineStyle.listComponent, OstThemeConfigHelper.getBorderBottomColor()]}>
        {this.getHeadingComponent(item)}
        <Text style={[inlineStyle.text]}>{item.text}</Text>
      </View>
    );
  };

  _renderStatusCell = ({item, index}) => {
    return (
      <View style={[inlineStyle.listComponent, OstThemeConfigHelper.getBorderBottomColor()]}>
        {this.getHeadingComponent(item)}
        <Text style={OstThemeConfigHelper.getStatusConfig()}>{item.text}</Text>
      </View>
    );
  };

  _renderCopyCell = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onCopyCellTapped(item)}>
        <View style={[inlineStyle.listComponent, OstThemeConfigHelper.getBorderBottomColor()]}>
          {this.getHeadingComponent(item)}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text style={inlineStyle.text}>{item.text}</Text>
            </View>
            {/*<Image style={{ height: 16, width: 24}} source={iconCopy} />*/}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  _renderLinkCell = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onLinkCellTapped(item)}>
        <View style={[inlineStyle.listComponent, OstThemeConfigHelper.getBorderBottomColor()]}>
          {this.getHeadingComponent(item)}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View>
              <Text style={[inlineStyle.linkText, OstThemeConfigHelper.getLinkConfig()]}>{item.text}</Text>
            </View>
            {/*<Image style={{ height: 16, width: 24}} source={viewIcon} />*/}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  getHeadingComponent(item) {
    return(<Text style={[inlineStyle.title, OstThemeConfigHelper.getC1Config()]}>{item.heading}</Text>)
  }
}

export default WalletDetails;
