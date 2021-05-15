import React, { FC, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-elements";
import { textStyle } from "../styles/Common";
import { HEADER_HEIGHT, MainScreens, Screens, WINDOW } from "./Constants";


interface PreferencesInterface {
    /** Dispatcher to change the screen  */
    setVisibleScreen: React.Dispatch<MainScreens>
    /** Screen to go back to when clicking the return button */
    mainScreen: MainScreens
}

const Preferences: FC<PreferencesInterface> = ({setVisibleScreen, mainScreen}) => {
    return (
        <View style={{ height: HEADER_HEIGHT, flexDirection: 'row', paddingHorizontal: '5%' }}>
            <TouchableOpacity style={{marginLeft: WINDOW.width*0.05}} onPress={() => setVisibleScreen(mainScreen)} >
            <Icon
                name='chevron-left'
                type='feather'
                color='black'
                size={40}
                style={{ alignContent: 'flex-start' }}

            />
            </TouchableOpacity>
            <Text style={{ ...textStyle.h1, textAlign: 'center' }}>Preferences</Text>
        </View>
    );
}

export default Preferences;