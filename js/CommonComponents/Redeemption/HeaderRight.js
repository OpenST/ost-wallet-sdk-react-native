import React from 'react';
import { View, Image, Text } from 'react-native';
import ImageConfig from "./ImageConfig";
import styles from '../../RedeemableSkus/styles'; //TODO @Preshita create a common style

export default (props) => {
    const walletIcon = ImageConfig.getWalletIconUri()
    return (
        <View style={styles.headerRightWrapper}>
             {walletIcon ? <Image source={walletIcon} style={styles.walletImgSkipFont} /> : <React.Fragment/>}
             <Text style={styles.balanceText}>{props.balance}</Text>
        </View>
    )
}