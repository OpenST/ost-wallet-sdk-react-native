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
      isPurchasing: false,
      btnText : this.getBtnText()
    };

    this.fetchDetails();

  }

  __setState = (state={}) => {
    this.__setState(state);
  };

  //TODO @Sharaddha in componnent unmount clear refs,   this.navigation ,  set __setState to blank function

  fetchDetails = () => {
    OstJsonApi.getRedemptionSkuDetails(this.userId, this.skuDetails.id , this.onDetailsSuccess ,  this.onDetailsError)
  };

  onDetailsSuccess = (data={}) =>{
    const resultType = data["result_type"] ;
    this.skuDetails = data[resultType];
    //get first country and
    //get first Denomination of selected country
    this.getFirstDenomination()
    //Set state refeshing false here
  };

  onDetailsError =( error)=> {
    //TODO lets discuss
  };

  getBtnText = () => {
    //Logic
    //If purchaing -  text to processing
    //If not show value text
  };

  getFirstCountry = () =>{
    let countryName = this.skuDetails.availability[0].country;
    return countryName ;
  };

  getFirstDenomination = (country) => {
    //TODO
  };

  getAvailableCountryList = () =>{
    let availabilityData = this.skuDetails.availability,
      countryData      = [];
    for(let cnt = 0; cnt< availabilityData.length ; cnt++){
      let country = availabilityData[cnt] ,
        countryName = country &&  country.country
      ;
      countryData.push({label: countryName, value: country});
    }
    return countryData;
  };


  getAvailableCurrencyData = ( country) =>{

    //Loop on state denomination
    //Create selector Obj

    let selectedCountry   = country,
        availabilityData  = this.skuDetails.availability,
        currencyDataArray = [],
        currencyItems     = [],
        currencyIsoCode   ='',
        firstItemCurrency =null;

    for(let cnt = 0; cnt< availabilityData.length ; cnt++){
      let item = availabilityData[cnt];
      if(item.country == selectedCountry){
        currencyDataArray = item.options;
        firstItemCurrency = item.options[0];
        currencyIsoCode    = item.currency_iso_code;
      }
    }
    this.setState({
      selectedCurrency:firstItemCurrency
    })


    for(let cnt = 0 ; cnt < currencyDataArray.length ; cnt ++){
      let label = `${currencyDataArray[cnt].toString()} ${currencyIsoCode}`;
      currencyItems.push({label:label, value:currencyDataArray[cnt].toString()})
    }
  return currencyItems;
  }


  onAvailabityChange = (value) =>{
    let currencyData = this.getAvailableCurrencyData(value);
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
          source={{uri:this.skuDetails.images.purpose.size.url}}>
        </Image>
        <Text style={stylesMap.descText}>
          {this.skuDetails.description.text}
        </Text>

        {/*//TODO if not availablity Dont render anything below */}

        {/* Country Selector */}
        <View style={stylesMap.wrapperPicker}>
          <Text style={stylesMap.labelStyle}> Select Country </Text>
          <RNPickerSelect
            ref={ref =>{
              this.inputRefs.countryPicker = ref;
            }}
            onDownArrow={() => {
              this.inputRefs.currencyPicker.togglePicker();
            }}
            style={inputBoxStyles}
            placeholder={{}}
            onValueChange={(value) => this.onValueChange(value) }
            items={this.getAvailableCountryList()}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Image source={downArrow} style={stylesMap.downArrow} />;
            }}
          />
        </View>
        {/* Country Selector ends */}
        {/* Currency Selector */}
        <View style={stylesMap.wrapperPicker}>
          <Text style={stylesMap.labelStyle}> Card Amount </Text>
          <RNPickerSelect
            ref={ref =>{
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
            onValueChange={(value) => this.onValueChangeCurrency(value)}
            items={this.getAvailableCurrencyData()}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Image source={downArrow} style={stylesMap.downArrow} />;
            }}
          />
        </View>
        {/* Currency Selector ends*/}

        {/* Email Id TextInput */}
        <View>
          <Text style={stylesMap.labelStyle}> Your mail id</Text>
          <TextInput
            ref={ref =>{
              this.inputRefs.emailIdInput = ref;
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            style={inputBoxStyles.inputIOS}
            blurOnSubmit={false}
          />
        </View>

        {/* Email Id TextInput ends */}

        {/* Error Text */}
        <Text style={stylesMap.errorText}> error text will be seen here</Text>
        {/* Error Text ends */}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={this.onPurchaseClick}
          style={stylesMap.purchaseBtn}
        >
          <Text style={stylesMap.purchaseBtnText}>
            Purchase
          </Text>
        </TouchableOpacity>
        {/* Submit Button ends */}

      </ScrollView>
    )
  }
}

export default OstRedeemableSkuDetails;

