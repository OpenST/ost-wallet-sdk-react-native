import { StyleSheet } from 'react-native';

//@TODO cleanup

let stylesMap = StyleSheet.create({
    container : {
        flex: 1,
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
    logoSkipFont : {
        // width: 100, 
        // height: 100,
        alignSelf: 'center'
    },
    title : {
        alignSelf: 'center',
        paddingHorizontal: 50
    },
    description : {
        marginTop: 5,
        paddingHorizontal: 50,
        textAlign: 'center',
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


