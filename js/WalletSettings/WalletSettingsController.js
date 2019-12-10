import OstWalletSdk from '../OstWalletSdk';
import OstWalletSdkUI from '../OstWalletSdkUI';
import OstJsonApi from '../OstJsonApi';
import OstUserStatus from "../constants/UserStatus";
import OstDeviceStatus from "../constants/DeviceStatus";
import OstWalletSettings from "./OstWalletSettings";
import OstWalletSdkHelper from '../helpers/OstWalletSdkHelper';
import OstWalletUIWorkflowCallback from '../OstWalletUIWorkflowCallback';
import InternalWorkflowDelegate from "../delegates/InternalWorkflowDelegate"

const optionIds = {
  walletDetails: "wallet-details",
  recoverDevice: "recover-device",
  abortRecovery: "abort-recovery",
  addSession: "add-session",
  resetPin: "reset-pin",
  viewMnemonics: "show-mnemonics",
  authorizeWithMnemonics: "authorize-device-with-mnemonics",
  authorizeWithQR: "add-another-device",
  showQR: "show-device-qr-code",
  enableBiometrics: "enable-biometrics",
  disableBiometrics: "disable-biometrics"
};

class WalletSettingsController {

  constructor(ostUserId, ostWalletUIWorkflowCallback) {
    this.userId = ostUserId;
    this._initialize();
    this.optionsOrdering = OstWalletSettings.getDisplayOrder();
    this.userStatusMap = OstUserStatus;
    this.deviceStatusMap = OstDeviceStatus;
    this.currentWorkflow = null;
    this.uiDelegate = null;
    if ( !ostWalletUIWorkflowCallback || !(ostWalletUIWorkflowCallback instanceof OstWalletUIWorkflowCallback) ) {
      let err = new Error("ostWalletUIWorkflowCallback can not be null and must be an instanceof OstWalletUIWorkflowCallback");
      throw err;
    }

    if ( !ostUserId ) {
      let err = new Error("ostUserId can not be null and must be a String");
      throw err;
    }
    this.externalDelegate = ostWalletUIWorkflowCallback;
  }

  _initialize(ostUserId) {
    this.optionsMap = {};
    this._initializeOptions();
  }

  _initializeOptions() {
    for( optionId in optionIds ) {
      this._createOptionsData( optionIds[optionId] );
    }
  }

  refresh( callback, onlyPerformable ) {
    this._ensureUserIdValidity();
    onlyPerformable = onlyPerformable || false;

    if ( !this.userId ) {
      //Ost user id is null.
      setTimeout(() => {
        let data = this._getData(onlyPerformable);
        callback( data );
      }, 0);

      // Done.
      return;
    }

    this.refreshCallback = callback;
    this.onlyPerformable = onlyPerformable;

    OstWalletSdk.getUser(this.userId, (userData) => {
      if ( !userData ) {
        // What to do here?
      }

      // Store user data.
      this.ostUser = userData;

      // Get the device.

      this._fetchBiometricPreference();
    });
  }

  _fetchBiometricPreference() {
    OstWalletSdk.isBiometricEnabled(this.userId, (isBiometricEnabled) => {
      this.isBiometricEnabled = isBiometricEnabled;
      this._fetchDevice();
    });
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
    OstJsonApi.getCurrentDeviceForUserId(this.userId,( device ) => {

      this._onDeviceFetch(device)

    }, ( error ) => {
      let ostError = OstWalletSdkHelper.jsonToOstRNError(error);
      //ToDo: Show the error and close the wallet settings.
      this._onDeviceFetch({
        "local_device": localDevice,
        "resut_type": "local_device"
      });
    });
  }

  _onDeviceFetch(device) {
    if ( null == device) {

    }
    let resultType = device["result_type"]
      , data = device[resultType]
    ;

    this.ostDevice = data;

    this._fetchPendingRecovery();
  }

  _fetchPendingRecovery() {
    OstJsonApi.getPendingRecoveryForUserId(this.userId, ( data ) => {
      this._onPendingRecoveryFetch(data)
    }, ( error ) => {
      this._onPendingRecoveryFetch()
    })
  }

  _onPendingRecoveryFetch(pendingRecovery) {
    this.pendingRecovery = pendingRecovery;

    this._onDataFetched()
  }

  _onDataFetched() {
    let deviceStatus = this._getDeviceStatus();
    let userStatus = this._getUserStatus();

    this._resetOptions();

    if (userStatus == this.userStatusMap.activated) {
      if (deviceStatus) {
        this._updateOptionsData(optionIds.walletDetails, false, true);
      }

      if (deviceStatus == this.deviceStatusMap.authorized) {
        this._updateOptionsData(optionIds.addSession, false, true);
        this._updateOptionsData(optionIds.viewMnemonics, false, true);
        this._updateOptionsData(optionIds.authorizeWithQR, false, true);
        this._updateOptionsData(optionIds.resetPin, false, true);

        let biometricMessage = (this.isBiometricEnabled || false) ? 'Disable Biometrics' : 'Enable Biometric';
        this._updateOptionsData(optionIds.updateBiometricPreference, false, true, biometricMessage);
      }

      if (deviceStatus == this.deviceStatusMap.registered) {
        this._updateOptionsData(optionIds.recoverDevice, false, true);
        this._updateOptionsData(optionIds.authorizeWithMnemonics, false, true);
        this._updateOptionsData(optionIds.showQR, false, true);
      }

      if (this.pendingRecovery) {
        this._updateOptionsData(optionIds.abortRecovery, false, true);
      }else {
        this._updateOptionsData(optionIds.abortRecovery, false, false);
      }

      if (deviceStatus == this.deviceStatusMap.revoked) {
        this._initializeOptions()
      }

    }else {
      this._initializeOptions()
    }

    let data = this._getData(this.onlyPerformable);
    this.refreshCallback(data)
  }

  _resetOptions() {
    let cnt = 0, len = this.optionsOrdering.length;
    for ( cnt=0; cnt< len; cnt++ ) {
      let optionKey = this.optionsOrdering[cnt];
      let option = this.optionsMap[optionKey];
      option.inProgress = false;
      option.canPerform = false;
    }
  }

  _getData(onlyPerformable) {
    let filteredData = [];
    let cnt = 0, len = this.optionsOrdering.length;
    for ( cnt=0; cnt< len; cnt++ ) {
      let optionKey = this.optionsOrdering[ cnt ];
      let option = this.optionsMap[optionKey];
      if (onlyPerformable) {
        if ( !option.canPerform || !option.shouldShow ){
          // Skip this.
          continue;
        }
      }

      filteredData.push(option);
    }

    return filteredData
  }

  _ensureUserIdValidity() {
    if ( !this._isUserIdValid() ) {
      this._initialize();
    }
  }

  _isUserIdValid() {
    let delegate = this.externalDelegate;
    if ( delegate && typeof delegate.getCurrentUserOstId === 'function' ) {
      let appOstUserId = delegate.getCurrentUserOstId();
      return appOstUserId === this.userId;
    }

    // Default to true.
    return true;
  }

  _createOptionsData(id){

    let itemConfig = OstWalletSettings.getItemConfig( id );
    if ( !itemConfig ) {
      const err = new Error(`Item configuration for itemId ${id} is not defined.`)
      throw err;
    }

    let contentConfig = OstWalletSettings.getItemContentConfig( id );
    if ( !contentConfig ) {
      const err = new Error(`Content configuration for itemId ${id} is not defined.`);
      throw err;
    }

    let optionsData = {
      id: id,

      // Heading
      heading: contentConfig.heading || "",

      // Description
      description: contentConfig.description || "",

      // Show this item be shown?
      shouldShow: itemConfig.shouldShow,

      // Does Item need Camera?
      needsCamera: itemConfig.needsCamera,

      // Is this workflow in progress?
      inProgress: false,

      // Can the action be performed?
      // False by default. Hide the view when false.
      canPerform: false
    };

    this.optionsMap[ id ] = optionsData;
    return optionsData;
  }

  _updateOptionsData(id, inProgress, canPerform, message = null) {
    let optionData = this.optionsMap[id];
    optionData.inProgress = inProgress || false;
    optionData.canPerform = canPerform || false;

    if (message) {
      optionData.heading = message;
    }
  }

  _getUserStatus() {
    let uStatus = '';
    if ( this.ostUser ) {
      uStatus = this.ostUser.status || uStatus;
    }
    return uStatus.toLowerCase();
  }

  _getDeviceStatus() {
    let dStatus = '';
    if ( this.ostDevice ) {
      dStatus = this.ostDevice.status || dStatus;
    }
    return dStatus.toLowerCase();
  }

  /**
   *
   * @param optionId
   *
   * @returns workflowInfo - Information of the workflow.
   */

  perform( optionId ) {
    if ( !this._isUserIdValid() ) {
      return null;
    }

    let activeWorkflow = this.getActiveWorkflowInfo();
    if ( activeWorkflow ) {
      return activeWorkflow;
    }

    let delegate = this._getWorkflowDelegate(),
        workflowId = null,
        userId = this.userId
    ;

    console.log("WalletSettings ost userId", userId);

    switch( optionId ) {
      case optionIds.addSession:
        workflowId = OstWalletSdkUI.addSession(userId, OstWalletSettings.getSessionExpirationTime() , OstWalletSettings.getSessionSpendingLimit(), delegate);
        break;

      case optionIds.recoverDevice:
        workflowId = OstWalletSdkUI.initiateDeviceRecovery(userId, null, delegate);
        break;

      case optionIds.abortRecovery:
        workflowId = OstWalletSdkUI.abortDeviceRecovery(userId, delegate);
        break;

      case optionIds.resetPin:
        workflowId = OstWalletSdkUI.resetPin(userId, delegate);
        break;

      case optionIds.viewMnemonics:
        workflowId = OstWalletSdkUI.getDeviceMnemonics(userId, delegate);
        break;

      case optionIds.authorizeWithMnemonics:
        workflowId = OstWalletSdkUI.authorizeCurrentDeviceWithMnemonics(userId, delegate);
        break;

      case optionIds.authorizeWithQR:
        workflowId = OstWalletSdkUI.scanQRCodeToAuthorizeDevice(userId, delegate);
        break;

      case optionIds.showQR:
        workflowId = OstWalletSdkUI.getAddDeviceQRCode(userId, delegate);
        break;

      case optionIds.updateBiometricPreference:
        workflowId = OstWalletSdkUI.updateBiometricPreference(userId, !this.isBiometricEnabled, delegate);
        break;

      default:
        return null;
    }

    this.currentWorkflow = this._createWorkflowInfo(workflowId, optionId);

    return this.currentWorkflow;
  }

  getActiveWorkflowInfo() {
    let  workflowInfo = this.currentWorkflow;
    if ( !workflowInfo ) {
      return null;
    }
    if ( workflowInfo.isFlowInterrupted || workflowInfo.isFlowComplete ) {
      return null;
    }
    return workflowInfo;
  }

  _createWorkflowInfo(workflowId, optionId) {
    return {
      workflowId: workflowId,
      workflowOptionId: optionId,
      isRequestAcknowledge: false,
      isFlowInterrupted: false,
      isFlowComplete: false
    };
  }

  setUIDelegate( uiDelegate ) {
    this.uiDelegate = uiDelegate;
  }

  _getWorkflowDelegate() {
    console.trace();
    let delegate = new InternalWorkflowDelegate( this.userId, this.externalDelegate);
    //
    delegate.requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.requestAcknowledged(ostWorkflowContext, ostContextEntity);
      }

      this.currentWorkflow.isRequestAcknowledge = true
    };

    delegate.flowComplete = (ostWorkflowContext , ostContextEntity) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.flowComplete(ostWorkflowContext, ostContextEntity);
      }
      this.currentWorkflow.isFlowComplete = true
    };

    delegate.onUnauthorized = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.onUnauthorized(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.saltFetchFailed = () => {
      if ( this.uiDelegate ) {
        this.uiDelegate.saltFetchFailed();
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.userCancelled = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.userCancelled(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.deviceTimeOutOfSync = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.deviceTimeOutOfSync(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.workflowFailed = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.workflowFailed(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    return delegate;
  }

};

export  {WalletSettingsController , optionIds}
