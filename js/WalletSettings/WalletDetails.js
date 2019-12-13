import React, {PureComponent} from 'react';
import {Alert, FlatList, Linking, Platform, Text, TouchableWithoutFeedback, View, Image, Clipboard, Modal, Dimensions, SafeAreaView} from 'react-native';
import inlineStyle from './walletDetailsStyles';

import OstWalletSdk from '../OstWalletSdk';
import OstWalletSdkUI from '../OstWalletSdkUI';
import OstJsonApi from '../OstJsonApi';
import OstWalletSdkHelper from "../helpers/OstWalletSdkHelper";
import OstThemeConfigHelper from '../helpers/OstThemeConfigHelper'
import OstWalletSettings from './OstWalletSettings'

let InAppBrowser = null;
// import('react-native-inappbrowser-reborn').then((pack) => {
//   return InAppBrowser = pack.default
// }).catch((err) => {
//   //
// })

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
      let ostError = OstWalletSdkHelper.jsonToOstRNError( error );
      let errorMessage = ostSdkErrors.getErrorMessage( null, ostError );
      LoadingModal.showFailureAlert(errorMessage, "", "OK", () => {
        // Close this view.
        this.props.navigation.goBack(null);
      });
    });
  }

  _onDeviceFetch(deviceApiResponse) {
    if (deviceApiResponse) {
      let resultType = deviceApiResponse["result_type"];
      let device = deviceApiResponse[ resultType ];
      this.ostDevice = device;
      this._buildList();

    }else {
      LoadingModal.showFailureAlert("Something went wrong", "", "OK", () => {
        // Close this view.
        this.props.navigation.goBack(null);
      });
    }
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
      "text": this.token.id
    };
  }

  _buildUserIdData() {
    return {
      "cellType": "copy",
      "heading": "OST User ID",
      "text": this.ostUser.id
    };
  }

  _buildUserStatusData() {
    return {
      "cellType": "status",
      "heading": "User Status",
      "text": this.ostUser.status
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
      "text": this.ostUser.token_holder_address,
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
      "text": this.ostUser.device_manager_address,
      "link": link
    };
  }

  _buildRecoveryKeyAddressData() {
    return {
      "cellType": "copy",
      "heading": "Recovery Key Address",
      "text": this.ostUser.recovery_address
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
      "text": this.ostUser.recovery_owner_address,
      "link": link
    };
  }

  _buildDeviceAddressData() {
    return {
      "cellType": "copy",
      "heading": "Device Address",
      "text": this.ostDevice.address
    };
  }

  _buildDeviceStatusData() {
    return {
      "cellType": "status",
      "heading": "Device Status",
      "text": this.ostDevice.status
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
        <SafeAreaView style={inlineStyle.navigationBar}>
          <TouchableWithoutFeedback onPress={this.backButtonTapped}>
            <View style={{width: 44, height: 44, alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{color: '#2A293B', fontSize: 24 }}>X</Text>
            </View>
          </TouchableWithoutFeedback>
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
        <Text style={inlineStyle.statusText}>{item.text}</Text>
      </View>
    );
  };

  _renderCopyCell = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onCopyCellTapped(item)}>
        {this.getActionCell(item, false)}
      </TouchableWithoutFeedback>
    );
  };

  _renderLinkCell = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onLinkCellTapped(item)}>
        {this.getActionCell(item, true)}
      </TouchableWithoutFeedback>
    );
  };

  getHeadingComponent(item) {
    return(<Text style={[inlineStyle.title, OstThemeConfigHelper.getC1Config()]}>{item.heading}</Text>)
  }

  getActionCell = (item, isLinkCell) => {
    return(
      <View style={[inlineStyle.listComponent, OstThemeConfigHelper.getBorderBottomColor()]}>
        {this.getHeadingComponent(item)}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <Text style={isLinkCell ? inlineStyle.linkText : inlineStyle.text}>{item.text}</Text>
          </View>
          {/*<Image style={{ height: 16, width: 24}} source={isLinkCell ? viewIcon : iconCopy} />*/}
        </View>
      </View>
    )
  }
}

export default WalletDetails;
