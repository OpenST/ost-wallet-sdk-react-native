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
    marginBottom:20
  },
  descText:{
    marginBottom:30
  },
  labelStyle:{
    marginBottom:5
  },
  wrapperPicker:{
    marginBottom:20
  },
  errorText:{
    justifyContent:'center',
    alignItems:'center',
    height : 13
  },
  purchaseBtn:{
    marginTop:20,
    alignItems:'center',
    justifyContent : 'center',
    width:'100%',
    height:46,
    flex:1,
    flexDirection:'column'
  },
  purchaseBtnText:{
   
  },
  downArrow : {
    height : 12,
    width :20,
    marginVertical : 17,
    marginRight : 17
  },
  successMessageWrapper : {
    borderWidth: 1,
    borderColor: '#2a293b',
    flex:1,
    flexDirection:'row',
    padding:10,
    borderRadius:8
  },
  imageSuccessMessage:{
    height:60,
    width:60,
    marginRight : 10
  },
  successText:{
    flex:1
  },
  input : {
    fontSize: 15,
    paddingVertical: 13,
    paddingHorizontal: 21,
    borderWidth: 1
  }
});

export {stylesMap};