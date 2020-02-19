import React from 'react';
import { View, Image, Text } from 'react-native';
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import styles from './styles'; //TODO @Preshita create a common style

export default (props) => {
    const walletIcon = OstRedemableCustomConfig.getWalletIconUri()
    return (
        <View style={styles.headerRightWrapper}>
             {walletIcon ? <Image source={walletIcon} style={styles.walletImgSkipFont} /> : <React.Fragment/>}
             <Text style={styles.balanceText}>{props.balance}</Text>
        </View>
    )
}