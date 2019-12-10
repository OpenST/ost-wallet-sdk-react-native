import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({

  list: {
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    color: "#888888",
    fontSize: 13,
    marginTop: 15
  },
  text: {
    color: "#2A293B",
    fontSize: 15,
    marginBottom: 15
  },

  statusText: {
    color: "#8000FF",
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15
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
    flexWrap: 'wrap'
  },

  listComponent: {
    flex: 1,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ECECEC"
  }
});
export default styles = stylesMap;