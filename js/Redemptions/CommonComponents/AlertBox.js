import { Alert } from "react-native";

class AlertBox{

  constructor(config){
    this.config = config || {};
  }

  showAlert(){
    Alert.alert(
      this.config.title,
      this.config.Message,
      [
        {
          text: this.config.cancelBtnText,
          onPress: () => {this.config.cancelCallBack && this.config.cancelCallBack()},
          style: this.config.cancelStyle,
        },
        {
          text: this.config.successBtnText,
          onPress: () => {this.config.successCallback && this.config.successCallback()}
        },
      ],
      {cancelable: false},
    )
  }

}

export default AlertBox;