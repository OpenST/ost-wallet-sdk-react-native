import React,{PureComponent} from 'react';
import {View, Text, Image, ScrollView, Platform, TextInput, TouchableOpacity, Alert,ActivityIndicator} from 'react-native';
import OstRedmptionConfig from "../ost-redemption-config";

import OstRedemptionTransactionHelper from "../RedemptionTransactionHelper";
import RedemptionController from "../RedemptionController";
import OstJsonApi from "../../OstJsonApi";
import RNPickerSelect from 'react-native-picker-select';

import {stylesMap} from './styles';
import msgIcon from '../../../assets/msg-icon.png';
import downArrow from '../../../assets/down-arrow.png';
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import OstThemeConfigHelper from '../../helpers/OstThemeConfigHelper';
import HeaderRight from "../CommonComponents/HeaderRight";
import tokenHelper from "../TokenHelper";

class OstRedeemableSkuDetails extends PureComponent{
  static navigationOptions = ({ navigation }) => {
    const balance = navigation && navigation.getParam("balance") || 0 ,
         isCustomBack = !!OstRedemableCustomConfig.getBackArrowUri()
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
      headerBackTitle: null,
      headerRight: <HeaderRight balance={balance}/>
    };
    if( isCustomBack ){
      navigationOption["headerBackImage"] = ""; //TODO @Preshita
    }

    return Object.assign(navigationOption, OstThemeConfigHelper.getNavigationHeaderConfig());
};
  constructor(props){
    super(props);
    this.navigation = props.navigation ;
    this.ostUserId = props.ostUserId || props.navigation.getParam("ostUserId");
    this.ostWalletUIWorkflowCallback = props.ostWalletUIWorkflowCallback ||  props.navigation.getParam("ostWalletUIWorkflowCallback");
    this.skuDetails = this.navigation.getParam('redemptionSku');
    this.tokenSymbol = 'DCT';
    this.purchaseValue = 60;
    this.denominationData = [];
    this.countrydata = [];


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
      emailId : "",
      btnText : ""
    };

    this.init();
  }

  init(){
    if(!tokenHelper.token){
      tokenHelper.init(this.ostUserId).then(()=>{
        this.updateBalance();
      }).catch(()=> {});
    }else{
      this.updateBalance();
    }
  }

  updateBalance(){
    OstJsonApi.getBalanceForUserId(this.ostUserId, (res) => {
      let balance = res.balance && res.balance.available_balance;
      balance = tokenHelper.toBtPrecision(tokenHelper.fromDecimal(balance));
      this.props.navigation && this.props.navigation.setParams && this.props.navigation.setParams({
        balance
      })
    }, () => {});
  }

  __setState = (state={}) => {
    this.setState(state);
  };

  componentDidMount(){
    this.fetchDetails();
    this.setBtnText();
  }

  componentWillUnmount (){
    this.inputRefs.countryPicker = null;
    this.inputRefs.currencyPicker = null;
    this.inputRefs.emailIdInput = null;
    this.navigation = null ;
    this.__setState = () =>{};
  }


  fetchDetails = () => {
    OstJsonApi.getRedeemableSkuDetails(this.ostUserId, this.skuDetails.id ,{}, this.onDetailsSuccess ,  this.onDetailsError)
  };

  onDetailsSuccess = (data={}) =>{
    const resultType = data["result_type"] ;
    this.skuDetails = data[resultType];
    console.log("this.skuDetails product details ------",this.skuDetails);
    //get first country and
    this.countrydata = this.getAvailableCountryList();
    //get first Denomination of selected country
    this.getFirstDenomination();
    //Set state refeshing false here
    this.__setState({
      refreshing : false,
    })

  };

  onDetailsError =( error)=> {
    //TODO lets discuss
    console.log("in error ----",error);
    this.__setState({
      refreshing : false,
    })
  };

  setBtnText = () => {
    //Logic
    //If purchaing -  text to processing
    //If not show value text
    if(this.state.isPurchasing){
      this.__setState({
        btnText:'Processing'
      });

    }else{
      this.__setState({
        btnText:`Purchase for ${this.purchaseValue} ${this.tokenSymbol}`
      });
    }
  };

  getFirstCountry = () =>{
    let countryName = this.skuDetails.availability[0].country;
    return countryName ;
  };

  getFirstDenomination = () => {
    let availabilityData = this.skuDetails && this.skuDetails.availability && this.skuDetails.availability[0]
    this.denominationData = this.getAvailableCurrencyData(availabilityData);
  };

  getAvailableCountryList = () =>{
    let availabilityData = this.skuDetails.availability || [],
      countryData      = [];
    if(!availabilityData) return;
    for(let cnt = 0; cnt< availabilityData.length ; cnt++){
      let country = availabilityData[cnt] ,
        countryName = country &&  country.country
      ;
      countryData.push({label: countryName, value: country});
    }
    return countryData;
  };


  getAvailableCurrencyData = ( availabilityData ) =>{

    //Loop on state denomination
    //Create selector Obj
    if(!availabilityData) return;
    let selectedCountry   = availabilityData.country,
        denominationsArray = availabilityData.denominations,
        currencyItems     = [],
        currencyIsoCode   =availabilityData.currency_iso_code;

    for(let cnt = 0 ; cnt < denominationsArray.length ; cnt ++){
      let label = `${denominationsArray[cnt].amount_in_fiat} ${currencyIsoCode}`;
      currencyItems.push({label:label, value:denominationsArray[cnt].amount_in_fiat})
    }
  return currencyItems;
  }


  onCountryChange = (value) =>{
    let currencyData = this.getAvailableCurrencyData(value);
    this.denominationData = currencyData;
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
    //Validate inputs
    if(this.isInputValid()){
      //Show Alert
      this.showConfirmationAlert();
    }

  };

  showConfirmationAlert = () =>{
    Alert.alert(
      '',
      `We have received your order and will send an email shortly to ${this.state.emailId}`,
      [
        {
          text: 'Cancel',
          onPress: () => {this.onAlertCancel()},
          style: 'cancel',
        },
        {text: 'Confirm', onPress: () => {this.onAlertConfirm()}},
      ],
      {cancelable: false},
    );
  }

  isInputValid = () =>{
    if(this.state.emailId == '' ){
      this.__setState({
        errorText:'Email Id is required'
      });
      return false;
    }
    return true
  }

  onAlertCancel = () => {

  }

  onAlertConfirm = () => {
    //Change button text to processing
    // isPurchasing flag takes care of disabling form
    this.__setState({
      isPurchasing: true
    })
    this.setBtnText();
    this.executeTranscaction();
  }

  onTransactionSuccess = () => {
    //State change to show success message
    //Enable form
    this.__setState({
      isPurchasing: false,
      transactionSuccess :true
    })
  }

  onTransactionError =( )=> {
    //Set state for error , enable form
    this.__setState({
      isPurchasing: false,
      errorText : "Transaction Error",
      transactionSuccess :false
    })
  }

  onFormChange = () => {
    //Clear state error
    //Any value change in form Show button and hide success message
    // set state transaction success false
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
    this.inputRefs.currencyPicker.togglePicker();
  }

  onDownArrowClickCurrency = () =>{
    this.inputRefs.emailIdInput.focus();
  }

  onUpArrowClickCurrency = () =>{
    this.inputRefs.countryPicker.togglePicker();
  }

  showDownArrow = () =>{
    return ;
  }

  getImage = () =>{
    if(this.skuDetails && this.skuDetails.images && this.skuDetails.images.product && this.skuDetails.images.product.original && this.skuDetails.images.product.original.url){
      return this.skuDetails.images.product.original.url;
    }
  }
  getDescription = () =>{
    if(this.skuDetails && this.skuDetails.description && this.skuDetails.description.text){
      return this.skuDetails.description.text;
    }
  }

  getName = () =>{
    if(this.skuDetails && this.skuDetails.name){
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
      <ScrollView style={stylesMap.container}>
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
        {/*//TODO if not availablity Dont render anything below */}
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
                Icon={() => {
                  return <Image source={downArrow} style={stylesMap.downArrow}/>;
                }}
                disabled = {this.state.isPurchasing}
              />
            </View>

            <View style={stylesMap.wrapperPicker}>
              <Text style={[stylesMap.labelStyle, OstThemeConfigHelper.getC2Config()]}> Card Amount </Text>
              <RNPickerSelect
                ref={this.setDenominationPickerRef}
                onUpArrow={() => {
                  this.inputRefs.countryPicker.togglePicker();
                }}
                onDownArrow={() => {
                  this.inputRefs.emailIdInput.focus();
                }}
                style={this.getRNPickerStyles()}
                placeholder={{}}
                value = {this.state.selectedDenomination}
                onValueChange={(value) => this.onDenominationChange(value)}
                items={this.denominationData}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return <Image source={downArrow} style={stylesMap.downArrow}/>;
                }}
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
              onPress={this.onPurchaseClick}
              style={[stylesMap.purchaseBtn, OstThemeConfigHelper.getB1Config()]}
              disabled = {this.state.isPurchasing}>
              <Text style={stylesMap.purchaseBtnText}>
                {this.state.btnText}
              </Text>
            </TouchableOpacity>

          </React.Fragment>)}
      </ScrollView>
    )
  }

  getSelectedAmountInWei(){
    return this.state.selectedDenomination && this.state.selectedDenomination["amount_in_wei"] || 0;
  }

  getSelectedAmountInFiat(){
    return this.state.selectedDenomination && this.state.selectedDenomination["amount_in_fiat"] || 0;
  }

  getSelectedCountry(){
    return this.state.selectedAvailability && this.state.selectedAvailability["country_iso_code"] || "";
  }

  getTxMeta(){
    const config  = JSON.parse(JSON.stringify(OstRedmptionConfig)) || {};
    return config["transactionMeta"] || {};
  }

  getRedeemableDetails(){
    return  {
       "redeemable_sku_id": this.skuDetails.id,
       "amount": this.getSelectedAmountInFiat(),
       "country": this.getSelectedCountry(),
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
                                                          this.getRedeemableDetails(),
                                                          delegate);
  }



}

export default OstRedeemableSkuDetails;

