import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({

  closeContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center'
  },

  closeText: {
    color: '#2A293B',
    fontSize: 24
  },

  navigationBar:{
    borderBottomWidth: 1,
    borderBottomColor: "#DBDBDB",

    paddingLeft: 10,
    justifyContent: 'flex-end'
  },

  list: {
    flex: 1,
    backgroundColor: "#fff"
  },

  listComponent: {
    flex: 1,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15
  },

  title: {
    marginBottom: 8
  },

  text: {
    color: "#2A293B",
    fontSize: 15,
  },

  linkText: {
    color: "#007aff",
    fontSize: 15
  }
});
export default styles = stylesMap;