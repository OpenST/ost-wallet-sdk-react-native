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
  wrapperPicker:{
    marginBottom:20
  },
  errorText:{
    justifyContent:'center',
    alignItems:'center',
    fontSize:13,
    height : 15,
    color:'red'
  },
  purchaseBtn:{
    marginTop:20,
    alignItems:'center',
    justifyContent : 'center',
    width:'100%',
    height:46,
    flex:1,
    flexDirection:'column',
    marginBottom:50,
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