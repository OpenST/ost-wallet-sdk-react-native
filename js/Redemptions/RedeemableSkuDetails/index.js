import React,{PureComponent} from 'react';
import {View, Text, Image, ScrollView, Platform, TextInput, TouchableOpacity} from 'react-native';
import OstJsonApi from "../../OstJsonApi";
import RNPickerSelect from 'react-native-picker-select';

import {stylesMap,inputBoxStyles} from './styles';
import msgIcon from '../../../assets/msg-icon.png';
import downArrow from '../../../assets/down-arrow.png';

class OstRedeemableSkuDetails extends PureComponent{
  constructor(props){
    super(props);
    this.navigation = this.props.navigation ;
    this.userId = this.props.userId ||  this.navigation.getParam('userId');
    this.skuDetails =this.navigation.getParam('redemptionSku');
    this.tokenSymbol = 'DCT';
    this.purchaseValue = 60;
    this.denominationData = [];
    this.countrydata = [];
    this.btnText = "";
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
      error : null,
      isPurchasing: false
    };

    this.setBtnText();


  }

  __setState = (state={}) => {
    this.__setState(state);
  };
  componentDidMount(){
    this.fetchDetails();
  }

  //TODO @Sharaddha in componnent unmount clear refs,   this.navigation ,  set __setState to blank function

  fetchDetails = () => {
    OstJsonApi.getRedeemableSkuDetails(this.userId, this.skuDetails.id ,{}, this.onDetailsSuccess ,  this.onDetailsError)
  };

  onDetailsSuccess = (data={}) =>{
    const resultType = data["result_type"] ;
    this.skuDetails = data[resultType];
    //get first country and
    this.countrydata = this.getAvailableCountryList();
    //get first Denomination of selected country
    this.getFirstDenomination();
    // this.getFirstDenomination();
    //Set state refeshing false here
    this.__setState({
      refreshing : false,
    })

  };

  onDetailsError =( error)=> {
    //TODO lets discuss
    console.log("in error ----",error);
  };

  setBtnText = () => {
    //Logic
    //If purchaing -  text to processing
    //If not show value text
    if(this.state.isPurchasing){
        this.btnText= 'Processing';
    }else{
      this.btnText=`Purchase for ${this.purchaseValue} ${this.tokenSymbol}`
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
    })
  }

  onDenominationChange = ( value ) =>{
    this.__setState({
      selectedCurrency : value
    })
  }

  onEmailChange = () => {

  }

  onPurchaseClick = () =>{
    //Validate inputs
    //Show Alert
  };

  onAlertCancel = () => {

  }

  onAlertConfrim = () => {
    //Change button text to processing
    //Disable form
  }

  excequteTranscaction = () => {
    //@Ashutosh
  }

  onTransactionSuccess = () => {
    //State change to show success message
    //Enable form
  }

  onTransactionError =( )=> {
    //Set state for error , enale form
  }

  onFormChange = () => {
    //Clear state error
    //Any value change in from Show button and hide success message //set state transactoion success false
  }

  onTransactionError = () => {
    //Display error set state
  }


  render(){
    return(
      <ScrollView style={stylesMap.container}>
        <Text style={stylesMap.heading}>{this.skuDetails.name}</Text>
        <Image
          style={stylesMap.imageStyle}
          source={{uri:this.skuDetails.images.product.original.url}}>
        </Image>
        <Text style={stylesMap.descText}>
          {this.skuDetails.description}
        </Text>

        {/*//TODO if not availablity Dont render anything below */}
        {this.skuDetails.availability && (
          <React.Fragment>
            <View style={stylesMap.wrapperPicker}>
              <Text style={stylesMap.labelStyle}> Select Country </Text>
              <RNPickerSelect
                ref={ref => {
                  this.inputRefs.countryPicker = ref;
                }}
                onDownArrow={() => {
                  this.inputRefs.currencyPicker.togglePicker();
                }}
                style={inputBoxStyles}
                placeholder={{}}
                onValueChange={(value) => this.onCountryChange(value)}
                items={this.getAvailableCountryList()}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return <Image source={downArrow} style={stylesMap.downArrow}/>;
                }}
              />
            </View>

            <View style={stylesMap.wrapperPicker}>
              <Text style={stylesMap.labelStyle}> Card Amount </Text>
              <RNPickerSelect
                ref={ref => {
                  this.inputRefs.currencyPicker = ref;
                }}
                onUpArrow={() => {
                  this.inputRefs.countryPicker.togglePicker();
                }}
                onDownArrow={() => {
                  this.inputRefs.emailIdInput.focus();
                }}
                style={inputBoxStyles}
                placeholder={{}}
                value = {this.state.selectedDenomination}
                onValueChange={(value) => this.onDenominationChange(value)}
                items={this.denominationData}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return <Image source={downArrow} style={stylesMap.downArrow}/>;
                }}
              />
            </View>

            <View>
              <Text style={stylesMap.labelStyle}> Your mail id</Text>
              <TextInput
                ref={ref => {
                  this.inputRefs.emailIdInput = ref;
                }}
                returnKeyType="done"
                enablesReturnKeyAutomatically
                style={inputBoxStyles.inputIOS}
                blurOnSubmit={false}
              />
            </View>
            <Text style={stylesMap.errorText}> error text will be seen here</Text>
            <TouchableOpacity
              onPress={this.onPurchaseClick}
              style={stylesMap.purchaseBtn}>
              <Text style={stylesMap.purchaseBtnText}>
                {this.btnText}
              </Text>
            </TouchableOpacity>

          </React.Fragment>)}
      </ScrollView>
    )
  }
}

export default OstRedeemableSkuDetails;

