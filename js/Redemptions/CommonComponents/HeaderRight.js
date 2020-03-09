import React from 'react';
import { View, Image, Text } from 'react-native';

import OstRedemableCustomConfig from "../RedemableCustomConfig";
import OstThemeConfigHelper from "../../helpers/OstThemeConfigHelper";
import styles from './styles';

export default (props) => {
    const walletIcon = OstRedemableCustomConfig.getWalletIconUri()
    return (
        <View style={styles.headerRightWrapper}>
             {walletIcon ? <Image source={walletIcon} style={styles.walletImgSkipFont} /> : <React.Fragment/>}
             <Text style={[ OstThemeConfigHelper.getC1Config(), styles.balanceText]}>{props.balance}</Text>
        </View>
    )
}