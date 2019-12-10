import OstDeviceStatus from "../constants/DeviceStatus";

export default {
  "canDeviceMakeApiCall": ( device ) => {
    if (!device) {
      return false;
    }

    switch( device.status ) {
      case DeviceStatus.REGISTERED:
      case DeviceStatus.AUTHORIZING:
      case DeviceStatus.AUTHORIZED:
      case DeviceStatus.REVOKING:
      case DeviceStatus.RECOVERING:
        return true;
      default:
        return false;
    }
  },

  "jsonToOstRNError": ( ostErrorJson ) => {
    if ( ostErrorJson instanceof OstWalletError ) {
      return ostErrorJson;
    }
    let ostError = new OstWalletError( ostErrorJson );
    if ( ostError.isApiError() ) {
      ostError = new OstWalletApiError( ostErrorJson );
    }
    return ostError;
  }
  
};