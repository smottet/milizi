import React, { FC, useState } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-elements";
import { textStyle } from "../styles/Common";
import { HEADER_HEIGHT, MainScreens, Screens, WINDOW } from "./Constants";


interface PreferencesInterface {
    /** Dispatcher to change the screen  */
    setVisibleScreen: React.Dispatch<MainScreens>
    /** Screen to go back to when clicking the return button */
    mainScreen: MainScreens
}

const Preferences: FC<PreferencesInterface> = ({ setVisibleScreen, mainScreen }) => {
    return (
        <View >
            <TouchableOpacity style={{ marginLeft: WINDOW.width * 0.05 }} onPress={() => setVisibleScreen(mainScreen)} >

                <View style={{ height: HEADER_HEIGHT, flexDirection: 'row' }}>
                    <Icon
                        name='chevron-left'
                        type='feather'
                        color='black'
                        size={40}
                        style={{ alignContent: 'flex-start' }}

                    />
                    <Text style={{ ...textStyle.h1, textAlign: 'center' }}>Preferences</Text>

                </View>
            </TouchableOpacity>

            <TouchableOpacity>

                <View style={{ height: HEADER_HEIGHT, flexDirection: 'row' }}>
                    <Image source={require('./unicorn.png')} style={{
                        width: 100,
                        height: 100,
                        resizeMode: 'contain'
                    }} />
                    <View style={{ flexDirection:'column' }}>
                        <Text style={{ ...textStyle.h1, textAlign: 'center' }}>Tim Mottet</Text>
                        <Text style={{ ...textStyle.h3, textAlign: 'center' }}>View Profile</Text>

                    </View>
                    <Icon
                        name='chevron-right'
                        type='feather'
                        color='black'
                        size={40}
                        style={{ alignContent: 'flex-end' }}
                    />
                </View>
            </TouchableOpacity>

            <Text style={{ ...textStyle.h2 }}>Language</Text>

        </View>
    );
}

export default Preferences;