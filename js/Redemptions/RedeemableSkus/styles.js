import { StyleSheet } from 'react-native';

//@TODO cleanup

let stylesMap = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 4,
        marginTop: 10
    },
    headingWrapper : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
        marginBottom: 50
    },
    walletImgSkipFont : {
        width: 10, 
        height: 18,
        marginRight: 8
    },
    balanceText :{
        color: '#535353',
        fontFamily: 'AvenirNext-Medium',
        fontSize: 14,
        fontWeight: '500'
    },
    headerRightWrapper : {
        paddingRight: 15,
        flexDirection: 'row'
    },
    logoSkipFont : {
        width: 100, 
        height: 100
    },
    title : {
        alignSelf: 'center',
        paddingHorizontal: 50,
        color: '#424242',
        fontFamily: 'Avenir-Book',
        fontSize: 20,
        fontWeight: '300'
    },
    description : {
        marginTop: 5,
        alignSelf: 'center',
        paddingHorizontal: 50,
        textAlign: 'center',
        color: '#606060',
        fontFamily: 'AvenirNext-Regular',
        fontSize: 14,
        marginBottom: 40
    },
    item:{
        flex: 1, 
        margin: 10, 
        backgroundColor: '#B3B3B3', 
        alignItems:'center', 
        justifyContent: 'center'
    },
    itemWrapper: {
        flex: 0.5, 
        width: 160, 
        height: 160
    }
});

export default styles = stylesMap;


