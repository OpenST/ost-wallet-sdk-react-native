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
    aspectRatio:16/9,
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
  iconWrapper:{
    paddingRight : 17,
    flex:1,
    marginTop: 17 // [(inputbBoxHeight /2 ) - (heightOfArrow/2 )] where inputbBoxHeight = 46 and heightOfArrow = 12
  },
  downArrow : {
    height : 12,
    width :20
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
    paddingLeft: 21,
    paddingRight: 54, // iconWidth(20) + iconPaddingRight(17) + iconPaddingLeft(17)
    borderWidth: 1,
    borderRadius:5,
    height:46,
  },
  emptyProductDetailsWrapper : {
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    borderWidth: 1,
    borderColor: '#2a293b',
    padding:10,
    borderRadius:8,
    borderStyle: 'dashed'
  }
});

export {stylesMap};