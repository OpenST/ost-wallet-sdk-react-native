import React, {PureComponent} from 'react';
import {Alert, FlatList, Linking, Platform, Text, TouchableWithoutFeedback, View} from 'react-native';
import inlineStyle from './styles'





import DeviceInfo from 'react-native-device-info';
import AndroidOpenSettings from 'react-native-android-open-settings';
import {optionIds, WalletSettingController} from './WalletSettingController';


import {ostSdkErrors} from "../../services/OstSdkErrors";
import CameraPermissionsApi from "../../services/CameraPermissionsApi";


import CurrentUser from "../../models/CurrentUser";
import BackArrow from '../CommonComponents/BackArrow';
import Colors from "../../theme/styles/Colors";
import {LoadingModal} from '../../theme/components/LoadingModalCover';

class WalletSettingList extends PureComponent {
  static navigationOptions = (options) => {
    return {
      title: 'Wallet Settings',
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: Colors.white,
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
      headerBackImage: <BackArrow />
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      refreshing: false,
    };

    this._initiateEventTextMap()
  }

  _initiateEventTextMap() {
    this.eventLoaderTextMap = {};

    this._createEventLoaderData(
      optionIds.addSession,
      "Adding Session",
      "Waiting for confirmation",
      "Session added");

    this._createEventLoaderData(
      optionIds.updateBiometricPreference,
      "Updating Biometric",
      "Waiting for confirmation",
      "Biometric updated");

    this._createEventLoaderData(
      optionIds.resetPin,
      "Resetting PIN...",
      "Waiting for confirmation",
      "PIN has been successfully reset");

    this._createEventLoaderData(
      optionIds.recoverDevice,
      "Recovering device",
      "Waiting for confirmation",
      "Device recovery initiated");

    this._createEventLoaderData(
      optionIds.abortRecovery,
      "Cancelling recovery",
      "Waiting for confirmation",
      "Aborted recovery");

    this._createEventLoaderData(
      optionIds.viewMnemonics,
      "",
      "",
      "");

    this._createEventLoaderData(
      optionIds.authorizeWithQR,
      "Authorizing device",
      "Waiting for confirmation",
      "Device authorized");


    this._createEventLoaderData(
      optionIds.authorizeWithMnemonics,
      "Authorizing device",
      "Waiting for confirmation",
      "Device authorized");

    this._createEventLoaderData(
      optionIds.showQR,
      "",
      "Waiting for confirmation",
      "Device authorized");
  }

  _createEventLoaderData(id, startText, ackText, successText){
    let loaderData = {
      id: id,

      startText: startText,

      // Acknowledgement text
      acknowledgedText: ackText,

      // Success Text
      successText: successText,
    };

    this.eventLoaderTextMap[ id ] = loaderData;
    return loaderData;
  }

  _getFlowCompleteText() {
    let text = this.eventLoaderTextMap[this.workflowInfo.workflowOptionId].successText;
    return text
  }

  _getFlowStartedText() {
    let text = this.eventLoaderTextMap[this.workflowInfo.workflowOptionId].startText;
    return text
  }

  _getRequestAcknowledgedText() {
    let text = this.eventLoaderTextMap[this.workflowInfo.workflowOptionId].acknowledgedText;
    return text
  }

  _getFlowFailedText(workflowContext, ostError) {
    return ostSdkErrors.getErrorMessage(workflowContext, ostError)
  }

  componentDidMount() {
    LoadingModal.show("Fetching Settings...");
    this.refreshList();
  }

  refreshList = (onFetch) => {
    let refreshState = this.state.refreshing;

    walletSettingController.refresh((optionsData) => {
      this.setState({
        list: optionsData,
        refreshing: !refreshState
      });

      if (onFetch) {
        onFetch()
      }else {
        LoadingModal.hide()
      }

    }, true);
  };

  onSettingItemTapped = (item) => {
    this._processTappedOption(item);
  };

  async _processTappedOption(item) {
    if ( optionIds.walletDetails === item.id ) {
      this.props.navigation.navigate('WalletDetails');
      return;
    } else if (item.id === optionIds.authorizeWithQR) {
      let cameraResult = await CameraPermissionsApi.requestPermission('camera');
      if ((cameraResult == 'denied' || cameraResult == 'restricted')) {
        LoadingModal.showFailureAlert("Allow access to your camera to scan QR", '', 'Enable Camera Access', (isBtnTapped) => {
          if (isBtnTapped) {
            this.enableAccess();
          }
        });
        return;
      }
    }
    this._perfromWorkflow(item)
  }

  _perfromWorkflow(item) {
    let workflowInfo = walletSettingController.perform(item.id);
    if ( workflowInfo ) {
      this.onWorkflowStarted( workflowInfo );
    } else {
      //Some coding error occurred.
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
    // Show loader.
    //LoadingModal.show('');

    // Subscribe to events.
    walletSettingController.setUIDelegate(this);
  };

  requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
    // LoadingModal.show(this._getRequestAcknowledgedText())
  };

  flowComplete = (ostWorkflowContext , ostContextEntity) => {
    this.refreshList(() => {
      if (this.canShowAlert(ostWorkflowContext)) {
        let text = this._getFlowCompleteText();
        // LoadingModal.showSuccessAlert(text);
      }else {
        // LoadingModal.hide()
      }

    });
  };

  onUnauthorized = (ostWorkflowContext , ostError) => {
    LoadingModal.showFailureAlert("Device is not authorized. Please authorize device again.", null, "Logout", () => {
      CurrentUser.logout({
        device_id: DeviceInfo.getUniqueID()
      });
    })
  };

  saltFetchFailed = (ostWorkflowContext , ostError) => {
    LoadingModal.showFailureAlert("There is some issue while fetching salt. Please retry", null, "Retry", (isButtonTapped) => {
      if (isButtonTapped) {
        let retryItem = walletSettingController.optionsMap[this.workflowInfo.workflowOptionId];
        this.onSettingItemTapped(retryItem);
      }
    })
  };

  userCancelled = (ostWorkflowContext , ostError) => {
    LoadingModal.hide();
  };

  deviceTimeOutOfSync = (ostWorkflowContext , ostError) => {
    this.workflowFailed(ostWorkflowContext, ostError);
  };

  workflowFailed = (ostWorkflowContext , ostError) => {
    let text = this._getFlowFailedText(ostWorkflowContext, ostError);
    // LoadingModal.showFailureAlert(text, null, "Dismiss");
  };

  canShowAlert(workflowContext) {
    if (workflowContext.WORKFLOW_TYPE === 'GET_DEVICE_MNEMONICS') {
      return false
    }

    return true
  }

  _keyExtractor = (item, index) => `id_${item.id}`;

  _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onSettingItemTapped(item)}>
        <View style={inlineStyle.listComponent}>
        <Text style={inlineStyle.title}>{item.heading}</Text>
        <Text style={inlineStyle.subtitle}>{item.description}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <View style= {inlineStyle.list}>
        <FlatList
          data={this.state.list}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          visible={false}
        />
      </View>
    );
  }
}

export default WalletSettingList;
