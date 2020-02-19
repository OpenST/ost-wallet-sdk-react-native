import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({
    container : {
        flex: 1,
        backgroundColor: 'white',
        padding: 4,
        marginTop: 10
    },
    headingWrapper : {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30
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
    cell : {
        
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
        fontSize: 14
    },
    list : {
        marginTop: 20,
        padding: 10
    }
});

export default styles = stylesMap;


