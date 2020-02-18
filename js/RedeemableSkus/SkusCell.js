import React from 'react';
import { View, Image } from 'react-native';

import Logo from '../../assets/logo.png';
import styles from './styles';

export default SkusCell = (props)=> {
    return (
        <View style={{flex: 1}}>
             <Image source={Logo} resizeMode={'cover'} style={styles.logoSkipFont} />
        </View>
    );
}