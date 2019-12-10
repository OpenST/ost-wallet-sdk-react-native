import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {

  list: {
    flex: 1,
    backgroundColor: Colors.white
  },
  title: {
    color: Colors.grey,
    fontSize: 13,
    marginTop: 15,
    fontFamily: 'AvenirNext-DemiBold'
  },
  text: {
    color: Colors.valhalla,
    fontSize: 15,
    marginBottom: 15,
    fontFamily: 'AvenirNext-Regular'
  },

  statusText: {
    color: Colors.green,
    fontSize: 15,
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'AvenirNext-Regular'
  },

  linkView: {
    marginTop: 5,
    flex: 2,
    marginRight: 0,
  },

  linkText: {
    color: Colors.azureBlue,
    marginBottom: 15,
    fontSize: 15,
    flexWrap: 'wrap',
    fontFamily: 'AvenirNext-Regular'
  },

  listComponent: {
    flex: 1,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whisper
  }
};
export default styles = DefaultStyleGenerator.generate(stylesMap);

