import React,{PureComponent} from 'react';
import {View, Text, Image, ScrollView, Platform, TextInput, TouchableOpacity, Alert} from 'react-native';
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
      errorText : null,
      isPurchasing: false,
      emailId : null
    };

    this.setBtnText();


  }

  __setState = (state={}) => {
    this.setState(state);
  };
  componentDidMount(){
    this.fetchDetails();
  }

  componentWillUnmount (){
    //TODO @Sharaddha in componnent unmount clear refs,   this.navigation ,  set __setState to blank function
  }


  fetchDetails = () => {
    OstJsonApi.getRedeemableSkuDetails(this.userId, this.skuDetails.id ,{}, this.onDetailsSuccess ,  this.onDetailsError)
  };

  onDetailsError = (data={}) =>{
    const resultType = data["result_type"] ;
    // this.skuDetails = data[resultType]; TODO remove this once Api is ready
    this.skuDetails = {
       id : 1,
       name : "product name",
      description: {text: "some description"}
      ,images: {
      product: {
        original: {
          url:"https://dummyimage.com/600x400/000/fff"
        }
      }},
    availability: [
      {
        country: "INDIA",
        country_iso_code: "INR",
        currency_iso_code: "INR",
        denominations: [
          {
            amount_in_fiat: '10',
            amount_in_wei: '10',
          },
          {
            amount_in_fiat: '20',
            amount_in_wei: '20',
          }
        ]
      },
      {
        country: "INDIA1",
        country_iso_code: "INR1",
        currency_iso_code: "INR1",
        denominations: [
          {
            amount_in_fiat: '11',
            amount_in_wei: '11',
          },
          {
            amount_in_fiat: '21',
            amount_in_wei: '21',
          }
        ]
      }

    ]
    }
    //get first country and
    this.countrydata = this.getAvailableCountryList();
    //get first Denomination of selected country
    this.getFirstDenomination();
    //Set state refeshing false here
    this.__setState({
      refreshing : false,
    })

  };

  onDetailsSuccess =( error)=> {
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
    if(this.state.emailId == null ){
      this.__setState({
        errorText:'Email Id is required'
      })
      return false;
    }
    return true
  }

  onAlertCancel = () => {

  }

  onAlertConfirm = () => {
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

  onEmailChange = (text) =>{
    this.__setState({
      emailId:text
    })
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
          {this.skuDetails.description.text}
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
                value = {this.state.emailId}
                onChangeText={this.onEmailChange}
              />
            </View>
            <Text style={stylesMap.errorText}>{this.state.errorText}</Text>
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

