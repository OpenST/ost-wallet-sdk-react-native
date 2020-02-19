import React from 'react';
import {View , Image } from "react-native";
import OstRedemableCustomConfig from "../RedemableCustomConfig";
import inlineStyle from "./styles";

export default () => (
    <View style={inlineStyle.backArrowImageWrapper}>
        <Image source={OstRedemableCustomConfig.getBackArrowUri()} style={inlineStyle.backArrowStyle} />
    </View>
);
