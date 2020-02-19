import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({
  container:{
    padding:20,
    flex:1,
    flexDirection:'column'
  },
  imageStyle:{
    width:"100%",
    height : 150,
    marginBottom:20
  },
  heading:{
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16,
    color:"#000",
    fontWeight: "900",
    marginBottom:20

  },
  descText:{
    color: "#2e2e2e",
    fontFamily: 'Avenir-Medium',
    fontSize: 12,
    fontWeight: "500",
    marginBottom:50
  },
  labelStyle:{
    color:"#34445b",
    fontSize:13,
    fontWeight:"300",
    fontFamily:'Avenir-Book',
    marginBottom:5
  },
  inputIOS :{
    fontSize: 15,
    paddingVertical: 13,
    paddingHorizontal: 21,
    borderWidth: 1,
    borderColor: '#2a293b',
    borderRadius: 4,
    color: '#4a4a4a',
  },
  wrapperPicker:{
    marginBottom:30
  },
  errorText:{
    color:'red',
    fontSize:13,
    fontFamily:'Avenir-Book',
    fontWeight:"300",
    justifyContent:'center',
    alignItems:'center'
  },
  purchaseBtn:{
    marginTop:20,
    alignItems:'center',
    justifyContent : 'center',
    backgroundColor:'#ff5566',
    width:'100%',
    height:46,
    flex:1,
    flexDirection:'column'
  },
  purchaseBtnText:{
    color:'#ffffff'

  }
});

export default styles = stylesMap;