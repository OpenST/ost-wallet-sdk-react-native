import { StyleSheet } from 'react-native';

let stylesMap = StyleSheet.create({
    backArrowImageWrapper : {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: 10
    },
    backArrowStyle : {
        width: 10, 
        height: 18,
        aspectRatio: 1
    },
    walletImgSkipFont : {
        width: 20, 
        height: 18,
        aspectRatio: 1,
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