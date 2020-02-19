import React from 'react';
import { TouchableWithoutFeedback, Image } from 'react-native';
import { withNavigation } from 'react-navigation';

import Logo from '../../assets/logo.png';
import styles from './styles';

 SkusCell = (props)=> {
   obj ={
     name :"heading text",
     images : {
       purpose : {
         size:{
           url:"https://dummyimage.com/600x400/000/fff"
         }
       }
     },
     description:{
       text:"Order from the select restaurants on GrubHub and get 20% off on the order. T&C apply."
   },
     availability:[
       {
         country: "INDIA",
         country_iso_name: "INR",
         currency: "INR",
         currency_conversion: {country_iso_name: ""},
         options: [10,20,30,40]
       },
       {
         country: "INDIA1",
         country_iso_name: "INR1",
         currency: "INR1",
         currency_conversion: {country_iso_name: ""},
         options: [11,21,31,41]
       },
       {
         country: "INDIA2",
         country_iso_name: "INR2",
         currency: "INR2",
         currency_conversion: {country_iso_name: ""},
         options: [12,22,32,42]
       }
     ]
   }
    return (
        <TouchableWithoutFeedback style={{flex: 1}} onPress={()=>{props.navigation.push('RedeemableSkuDetails',{'obj':obj})}}>
             <Image source={Logo} resizeMode={'cover'} style={styles.logoSkipFont} />
        </TouchableWithoutFeedback>
    );
}

export default withNavigation(SkusCell)