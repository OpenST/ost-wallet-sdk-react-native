import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({
    balanceText :{
        color: '#535353',  
        fontSize: 14
    },
    backArrowImageWrapper : {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10
    },
    backArrowStyle : {
        width: 10, 
        height: 18
    },
    walletImgSkipFont : {
        width: 40, 
        height: 30,
        marginRight: 8
    },
    headerRightWrapper : {
        paddingRight: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    balanceText: {
        alignSelf: 'center'
    }
});

export default styles = stylesMap;