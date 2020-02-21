import React,{PureComponent} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import HeaderRight from "../CommonComponents/HeaderRight";
import BackArrow from '../CommonComponents/BackArrow';
import OstJsonApi from "../../OstJsonApi";
import OstRedemptionTransactionHelper from "../RedemptionTransactionHelper";
import RedemptionController from "../RedemptionController";
import OstThemeConfigHelper from '../../helpers/OstThemeConfigHelper';
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import OstRedmptionConfig from "../ost-redemption-config";
import tokenHelper from "../TokenHelper";
import AlertBox from "../CommonComponents/AlertBox";
import msgIcon from '../../../assets/msg-icon.png';
import downArrow from '../../../assets/down-arrow.png';
import multipleClickHandler from '../MultipleClickHandler';

import {stylesMap} from './styles';

const errorMsgs = {
  unauthorized: "Device unathorized, please authorized the device.",
  generalError: "Something went wrong.",
  emailRequired: "Email Id is required."
}

function __getParam(navigation ,  paramName) {
  if(navigation && navigation.getParam){
    return navigation.getParam(paramName);
  }
  return null;
}


class OstRedeemableSkuDetails extends PureComponent{
  static navigationOptions = ({ navigation }) => {
    const balance =  __getParam(navigation , "balance") || 0 ,
         isCustomBack = !!OstRedemableCustomConfig.getBackArrowUri()
    ;
    let navigationOption = {
      title: __getParam(navigation , "navTitle") || "",
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
      headerBackTitle: null,
      headerRight: <HeaderRight balance={balance}/>
    };
    if( isCustomBack ){
      navigationOption["headerBackImage"] = <BackArrow/>; 
    }
    return Object.assign(navigationOption, OstThemeConfigHelper.getNavigationHeaderConfig());
  };

  constructor(props){
    super(props);
    this.navigation = props.navigation ;
    this.ostUserId = props.ostUserId || __getParam(props.navigation, "ostUserId") ;
    this.ostWalletUIWorkflowCallback = props.ostWalletUIWorkflowCallback || __getParam(props.navigation, "ostWalletUIWorkflowCallback");
    this.skuDetails = __getParam(props.navigation, "redemptionSku") || {};

    if(!this.skuDetails) return;

    this.inputRefs = {
      countryPicker : null,
      currencyPicker : null,
      emailIdInput : null
    };

    this.state={
      refreshing : true ,
      selectedAvailability : null,
      selectedDenomination : null,
      transactionSuccess: false,
      errorText : "",
      isPurchasing: false,
      emailId : ""
    };
  }

  __setState = (state={}) => {
    this.setState(state);
  };

  componentDidMount(){
    this.init();
  }

  componentWillUnmount (){
    this.__setState = () =>{};
    this.inputRefs.countryPicker = null;
    this.inputRefs.currencyPicker = null;
    this.inputRefs.emailIdInput = null;
    this.navigation = null ;
  }

  init(){
    if(!tokenHelper.token){
      tokenHelper.init(this.ostUserId).then(()=>{
        this.updateBalance();
      }).catch(()=> {});
    }else{
      this.updateBalance();
    }
    this.fetchDetails();   
  }

  updateBalance(){
    OstJsonApi.getBalanceForUserId(this.ostUserId, (res) => {
      let balance = res.balance && res.balance.available_balance;
      balance = tokenHelper.toBtPrecision(tokenHelper.fromDecimal(balance));
      this.navigation && this.navigation.setParams && this.navigation.setParams({
        balance
      })
    }, () => {});
  }

  fetchDetails = () => {
    OstJsonApi.getRedeemableSkuDetails(this.ostUserId, this.skuDetails.id ,{}, this.onDetailsSuccess ,  this.onDetailsError)
  };

  onDetailsSuccess = (data={}) =>{
    const resultType = data["result_type"] || {};
    this.skuDetails = data[resultType] || {};
    this.setInitialAvailabilityAndDenomination();
    this.__setState({
      refreshing : false,
    })
  };

  onDetailsError =( error)=> {
    this.__setState({
      refreshing : false,
      errorText : errorMsgs.generalError
    })
  };

  getBtnText = () => {
    if(this.state.isPurchasing){
      return "Processing";
    }else{
      return `Purchase for ${this.getSelectedAmountInBT()} ${tokenHelper.getTokenSymbol()}`  
    }
  };

  setInitialAvailabilityAndDenomination = () => {
    this.state.selectedAvailability =  this.skuDetails.availability && this.skuDetails.availability[0] || {} ;
    const denominations = this.state.selectedAvailability["denominations"] || [];
    this.state.selectedDenomination =  denominations[0] || {};
  }

  getAvailableCountryList = () =>{
    let availabilityData = (this.skuDetails && this.skuDetails.availability) || [],
        countryData      = [];
    if(!availabilityData) return countryData;
    for(let cnt = 0; cnt< availabilityData.length ; cnt++){
      let country = availabilityData[cnt] || {} ,
          countryName = country &&  country.country;
      countryData.push({label: countryName, value: country});
    }
    return countryData;
  };

  getAvailableCurrencyData = ( ) =>{
    if(!this.state.selectedAvailability) return [];
    let denominationsArray = this.state.selectedAvailability.denominations || [],
        currencyIsoCode   = this.state.selectedAvailability.currency_iso_code,
        currencyItems     = []
        ;
    for(let cnt = 0 ; cnt < denominationsArray.length ; cnt ++){
      let currentDenomination = denominationsArray[cnt] || {},
          label = `${currentDenomination.amount_in_fiat} ${currencyIsoCode}`,
          value = currentDenomination ;
      currencyItems.push({label, value})
    }
   return currencyItems;
  }


  onCountryChange = (value) =>{
    this.__setState({
      selectedAvailability: value
    });
    this.onFormChange();
  }

  onDenominationChange = ( value ) =>{
    this.__setState({
      selectedDenomination : value
    })
    this.onFormChange();
  }

  onEmailChange = (text) =>{
    this.__setState({
      emailId:text
    })
    this.onFormChange();
  }

  onPurchaseClick = () =>{
    if(this.isInputValid()){
      this.showConfirmationAlert();
    }
  };

  showConfirmationAlert = () =>{
    let config ={
      title : "",
      Message : `Confirm email address: ${this.state.emailId}`,
      cancelBtnText : "Cancel",
      successBtnText : "Confirm",
      cancelCallback : this.onAlertCancel,
      successCallback : this.onAlertConfirm,
      cancelStyle : 'cancel'
    }
    let alertBox = new AlertBox(config);
    alertBox.showAlert();
  }

  isInputValid = () =>{
    if(this.state.emailId == '' ){
      this.__setState({
        errorText: errorMsgs.emailRequired
      });
      return false;
    }
    return true
  }

  onAlertCancel = () => {}

  onAlertConfirm = () => {
    this.__setState({
      isPurchasing: true
    })
    this.executeTranscaction();
  }

  onTransactionSuccess = () => {
    this.__setState({
      isPurchasing: false,
      transactionSuccess :true
    })
  }

  onTransactionError =( error)=> {
    this.__setState({
      isPurchasing: false,
      errorText : error,
      transactionSuccess :false
    })
  }

  onFormChange = () => {
    this.__setState({
      isPurchasing: false,
      errorText : "",
      transactionSuccess : false
    });
  }

  setCountryPickerRef = (ref) =>{
    this.inputRefs.countryPicker = ref;
  }

  setDenominationPickerRef = (ref) =>{
    this.inputRefs.currencyPicker = ref;
  }

  setEmailINputPickerRef = (ref) =>{
    this.inputRefs.emailIdInput = ref;
  }

  onDownArrowClickCountry = () =>{
    this.inputRefs.currencyPicker && this.inputRefs.currencyPicker.togglePicker();
  }

  onDownArrowClickCurrency = () =>{
    this.inputRefs.emailIdInput && this.inputRefs.emailIdInput.focus();
  }

  onUpArrowClickCurrency = () =>{
    this.inputRefs.countryPicker && this.inputRefs.countryPicker.togglePicker();
  }

  getPickerIcon = () =>{
    return <Image source={downArrow} style={stylesMap.downArrow}/>;
  }

  getImage = () =>{
    if(this.skuDetails.images && this.skuDetails.images.detail && this.skuDetails.images.detail.original && this.skuDetails.images.detail.original.url){
      return this.skuDetails.images.detail.original.url;
    }
  }

  getDescription = () =>{
    if(this.skuDetails.description && this.skuDetails.description.text){
      return this.skuDetails.description.text;
    }
  }

  getName = () =>{
    if(this.skuDetails.name){
      return this.skuDetails.name;
    }
  }

  getRNPickerStyles = () => {
    let styles = {...stylesMap.input, ...OstThemeConfigHelper.getNativeSelectConfig()};
    return {
      inputIOS : styles,
      inputAndroid : styles
    }
  }

  render(){
    return(
      <KeyboardAvoidingView style={stylesMap.container} behavior={Platform.OS == 'android' ?'padding' :''} enabled>
      <ScrollView>
        <Text style={[stylesMap.heading, OstThemeConfigHelper.getH2Config()]}>{this.getName()}</Text>
        <Image
          style={stylesMap.imageStyle}
          source={{uri:this.getImage()}}>
        </Image>
        <Text style={[stylesMap.descText, OstThemeConfigHelper.getH3Config()]}>
          {this.getDescription()}
        </Text>

        <ActivityIndicator
          animating = {this.state.refreshing}
        />
        {this.skuDetails.availability && (
          <React.Fragment>
            <View style={stylesMap.wrapperPicker}>
              <Text style={[stylesMap.labelStyle, OstThemeConfigHelper.getC2Config()]}> Select Country </Text>
              <RNPickerSelect
                ref={this.setCountryPickerRef}
                onDownArrow={this.onDownArrowClickCountry}
                style={this.getRNPickerStyles()}
                placeholder={{}}
                onValueChange={this.onCountryChange}
                items={this.getAvailableCountryList()}
                useNativeAndroidPickerStyle={false}
                Icon={this.getPickerIcon}
                disabled = {this.state.isPurchasing}
              />
            </View>

            <View style={stylesMap.wrapperPicker}>
              <Text style={[stylesMap.labelStyle, OstThemeConfigHelper.getC2Config()]}> Card Amount </Text>
              <RNPickerSelect
                ref={this.setDenominationPickerRef}
                onUpArrow={this.onUpArrowClickCurrency}
                onDownArrow={this.onDownArrowClickCurrency}
                style={this.getRNPickerStyles()}
                placeholder={{}}
                value = {this.state.selectedDenomination}
                onValueChange={this.onDenominationChange}
                items={this.getAvailableCurrencyData()}
                useNativeAndroidPickerStyle={false}
                Icon={this.getPickerIcon}
                disabled = {this.state.isPurchasing}
              />
            </View>

            <View>
              <Text style={[stylesMap.labelStyle, OstThemeConfigHelper.getC2Config()]}> Your mail id</Text>
              <TextInput
                ref={this.setEmailINputPickerRef}
                returnKeyType="done"
                enablesReturnKeyAutomatically
                style={[stylesMap.input, OstThemeConfigHelper.getTextFieldConfig()]}
                blurOnSubmit={false}
                value = {this.state.emailId}
                onChangeText={this.onEmailChange}
                editable = {!this.state.isPurchasing}
              />
            </View>
            <Text style={[stylesMap.errorText, ]}>{this.state.errorText}</Text>
            {this.state.transactionSuccess &&
              <View style={stylesMap.successMessageWrapper}>
                <Image source={msgIcon} style={stylesMap.imageSuccessMessage}/>
                <Text style={stylesMap.successText}>
                  We have received your order and will send an email shortly to {this.state.emailId}
                </Text>
              </View>
            }

            <TouchableOpacity
              onPress={multipleClickHandler(() => {
                this.onPurchaseClick()
              })}
              style={[stylesMap.purchaseBtn, OstThemeConfigHelper.getB1Config()]}
              disabled = {this.state.isPurchasing}>
              <Text style={stylesMap.purchaseBtnText}>
                {this.getBtnText()}
              </Text>
            </TouchableOpacity>

          </React.Fragment>)}
      </ScrollView>
      </KeyboardAvoidingView>
    )
  }

  getSelectedAmountInBT() {
    return tokenHelper.toBtPrecision( tokenHelper.fromDecimal(this.getSelectedAmountInWei()),  2);
  }

  getSelectedAmountInWei(){
    return this.state.selectedDenomination && this.state.selectedDenomination["amount_in_wei"] || 0;
  }

  getSelectedAmountInFiat(){
    return this.state.selectedDenomination && this.state.selectedDenomination["amount_in_fiat"] || 0;
  }

  getSelectedCountryISOCode(){
    return this.state.selectedAvailability && this.state.selectedAvailability["country_iso_code"] || "";
  }

  getSelectedCurrencyISOCode(){
    return this.state.selectedAvailability && this.state.selectedAvailability["currency_iso_code"] || "";
  }

  getTxMeta(){
    const config  = JSON.parse(JSON.stringify(OstRedmptionConfig)) || {};
    return config["transactionMeta"] || {};
  }

  getRedemptionMeta(){
    return  {
       "redeemable_sku_id": this.skuDetails.id,
       "amount_in_fiat": this.getSelectedAmountInFiat(),
       "country_iso_code": this.getSelectedCountryISOCode(),
       "currency_iso_code": this.getSelectedCurrencyISOCode(),
       "email": this.state.emailId
    }
  }

  executeTranscaction = () => {
    const controller = new RedemptionController(this.ostUserId, this, this.ostWalletUIWorkflowCallback) ;
    const delegate = controller.getWorkflowDelegate() ,
          amounts = [this.getSelectedAmountInWei()] ,
          address = [tokenHelper.getTokenHolderAdresses()]
    ;
    OstRedemptionTransactionHelper.executeDirectTransfer( this.ostUserId,
                                                          amounts,
                                                          address,
                                                          this.getTxMeta(),
                                                          this.getRedemptionMeta(),
                                                          delegate);
  }

  requestAcknowledged = () => {
    this.onTransactionSuccess();
    this.updateBalance();
  }

  flowInterrupt = () => {
    this.onTransactionError( errorMsgs.generalError);
  }

  onUnauthorized =( ) => {
    this.onTransactionError( errorMsgs.unauthorized);
  }

  saltFetchFailed =() => {
    this.onTransactionError( errorMsgs.generalError);
  }

  deviceTimeOutOfSync = () => {
    this.onTransactionError( errorMsgs.generalError);
  }

  workflowFailed = () => {
    this.onTransactionError( errorMsgs.generalError);
  }

}

export default OstRedeemableSkuDetails;

