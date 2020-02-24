import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({
  container:{
    flex:1,
    flexDirection:'column'
  },
  scrollViewContainer:{
    padding:20,
  },
  imageStyle:{
    width:"100%",
    height : 150,
    marginBottom:20,
    backgroundColor:'#DBDBDB'
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
  wrapperFormInput:{
    marginBottom:20
  },
  errorContainer:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  errorText:{
    fontSize:13,
    color:'red',
    marginTop:10,
    marginBottom:50,
    textAlign:'center'
  },
  purchaseBtn:{
    alignItems:'center',
    justifyContent : 'center',
    width:'100%',
    height:46,
    flex:1,
    flexDirection:'column',
    borderRadius:5
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
    borderRadius:8,
    alignItems:'center',
    justifyContent:'center'
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
    borderWidth: 1,
    borderRadius:5
  }
});

export {stylesMap};