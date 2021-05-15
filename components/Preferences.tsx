import React from "react";
import { View } from "react-native";
import { Text } from "react-native-elements";
import { textStyle } from "../styles/Common";



const Preferences = () => {
    return (
        <View style={{height: '100%', backgroundColor:'white'}}>
            <Text style={{...textStyle.h1, textAlign: 'center'}}>Preferences</Text>
        </View>
    );
}

export default Preferences;