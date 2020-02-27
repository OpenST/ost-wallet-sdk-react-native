import React from 'react';
import {View , Image } from "react-native";
import OstThemeConfigHelper from "../../helpers/OstThemeConfigHelper";
import inlineStyle from "./styles";

export default () => (
    <View style={inlineStyle.backArrowImageWrapper}>
        <Image source={OstThemeConfigHelper.getBackArrowSource()} style={inlineStyle.backArrowStyle} />
    </View>
);
