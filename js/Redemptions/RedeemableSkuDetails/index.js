import React,{PureComponent} from 'react';
import {View, Text, Image, ScrollView, Platform, TextInput, TouchableOpacity} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import inlineStyes from './styles';

class OstRedeemableSkuDetails extends PureComponent{
  constructor(props){
    super(props);
    this.skuDetails = this.props.navigation.getParam('obj');
    this.inputRefs = {
      countryPicker : null,
      currencyPicker : null,
      emailIdInput : null
    }

    this.state={
      selectedCountry : this.getFirstCountry(),
      countrydata     : this.getAvailableCountryList(),
      currencyData    : this.getAvailableCurrencyData()
    }

  }
  getFirstCountry = () =>{
    let countryName = this.skuDetails.availability[0].country;
    return{
      label :countryName , value : countryName , color:"#9EA0A4"
    }
  }

  getAvailableCurrencyData = () =>{
    let selectedCountry   = this.getFirstCountry().value,
        availabilityData  = this.skuDetails.availability,
        currencyDataArray      = [],
        currencyData      = [];

    for(let cnt = 0; cnt< availabilityData.length ; cnt++){
      let item = availabilityData[cnt];
      if(item.country == selectedCountry){
        currencyDataArray = item.options
      }
    }

    for(let cnt = 0 ; cnt < currencyDataArray.length ; cnt ++){
      currencyData.push({label:currencyDataArray[cnt].toString(), value:currencyDataArray[cnt].toString()})
    }
  return currencyData;
  }

  getAvailableCountryList = () =>{
    let availabilityData = this.skuDetails.availability,
        countryData      = [];
    for(let cnt = 0; cnt< availabilityData.length ; cnt++){
      let country = availabilityData[cnt].country;
      countryData.push({label: country, value: country});
    }
    return countryData;
  }

  onValueChange = (value) =>{
    this.setState({
      selectedCountry : value
    });

  }

  onPurchaseClick = () =>{

  }

  render(){
    return(
      <ScrollView style={inlineStyes.container}>
        <Text style={inlineStyes.heading}>{this.skuDetails.name}</Text>
        <Image
          style={inlineStyes.imageStyle}
          source={{uri:this.skuDetails.images.purpose.size.url}}>
        </Image>
        <Text style={inlineStyes.descText}>
          {this.skuDetails.description.text}
        </Text>

        {/* Country Selector */}
        <View style={inlineStyes.wrapperPicker}>
          <Text style={inlineStyes.labelStyle}> Select Country </Text>
          <RNPickerSelect
            ref={ref =>{
              this.inputRefs.countryPicker = ref;
            }}
            onDownArrow={() => {
              this.inputRefs.currencyPicker.togglePicker();
            }}
            style={Platform.OS == 'ios'? inlineStyes.inputIOS : inlineStyes.inputIOS}
            placeholder={{}}
            onValueChange={(value) => this.onValueChange}
            items={this.state.countrydata}
            useNativeAndroidPickerStyle={false}

          />
        </View>
        {/* Country Selector ends */}

        {/* Currency Selector */}
        <View style={inlineStyes.wrapperPicker}>
          <Text style={inlineStyes.labelStyle}> Card Amount </Text>
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
            style={Platform.OS == 'ios'? inlineStyes.inputIOS : inlineStyes.inputIOS}
            placeholder={{}}
            onValueChange={(value) => this.onValueChange}
            items={this.state.currencyData}
            useNativeAndroidPickerStyle={false}

          />
        </View>
        {/* Currency Selector ends*/}

        {/* Email Id TextInput */}
        <View>
          <Text style={inlineStyes.labelStyle}> Your mail id</Text>
          <TextInput
            ref={ref =>{
              this.inputRefs.emailIdInput = ref;
            }}
            returnKeyType="next"
            enablesReturnKeyAutomatically
            style={
              Platform.OS === 'ios'
                ? inlineStyes.inputIOS
                : inlineStyes.inputIOS
            }
            blurOnSubmit={false}
          />
        </View>

        {/* Email Id TextInput ends */}

        {/* Error Text */}
        <Text style={inlineStyes.errorText}> error text will be seen here</Text>
        {/* Error Text ends */}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={this.onPurchaseClick}
          style={inlineStyes.purchaseBtn}
        >
          <Text style={inlineStyes.purchaseBtnText}>
            Purchase
          </Text>
        </TouchableOpacity>
        {/* Submit Button ends */}

      </ScrollView>
    )
  }
}

export default OstRedeemableSkuDetails;

