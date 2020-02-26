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
        paddingHorizontal: 50,
        marginBottom: 10
    },
    description : {
        marginTop: 5,
        paddingHorizontal: 50,
        textAlign: 'center',
        marginBottom: 30
    },
    item:{
        flex: 1, 
        margin:10,
        backgroundColor: '#DBDBDB', 
        alignItems:'center', 
        justifyContent: 'center'
    },
    itemWrapper: {
        flex: 0.5, 
        aspectRatio:1
    },
    list:{
        marginHorizontal:10,
        marginBottom : 10
    },
    noDataWrapper : {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderWidth: 1,
        borderColor: '#2a293b',
        padding:10,
        borderRadius:8,
        borderStyle: 'dashed'
    }
});

export default styles = stylesMap;


