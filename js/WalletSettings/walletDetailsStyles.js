import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({

  navigationBar:{
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB"
  },
  list: {
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    marginTop: 15,
    marginLeft: 15
  },
  text: {
    color: "#2A293B",
    fontSize: 15,
    marginBottom: 15,
    marginLeft: 15
  },

  statusText: {
    color: "#0F9D58",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 15
  },

  linkView: {
    marginTop: 5,
    flex: 2,
    marginRight: 0,
  },

  linkText: {
    color: "#007aff",
    marginBottom: 15,
    fontSize: 15,
    flexWrap: 'wrap',
    marginLeft: 15
  },

  listComponent: {
    flex: 1,
    borderBottomWidth: 1,
  }
});
export default styles = stylesMap;