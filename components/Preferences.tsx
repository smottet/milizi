import React, { FC, useState } from "react";
import { Image, Picker, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-elements";
import { Languages } from "../api/Constants";
import { textStyle } from "../styles/Common";
import { HEADER_HEIGHT, MainScreens, Screens, WINDOW } from "./Constants";

interface PreferencesInterface {
    /** Dispatcher to change the screen  */
    setVisibleScreen: React.Dispatch<MainScreens>
    /** Screen to go back to when clicking the return button */
    mainScreen: MainScreens
}



const Preferences: FC<PreferencesInterface> = ({ setVisibleScreen, mainScreen }) => {
    const [selectedLanguage, setSelectedLanguage]: [Languages, React.Dispatch<string>] = useState(undefined);
    const [units, setUnits]: [string, React.Dispatch<string>] = useState(undefined);


    return (
        <View >
            <TouchableOpacity style={{ marginLeft: 0 }} onPress={() => setVisibleScreen(mainScreen)} >

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
                    <View style={{ flexDirection: 'column' }}>
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

            <Text>{"\n\n"}</Text>
            <Text style={{ ...textStyle.h2 }}>Language</Text>
            <Text style={{ ...textStyle.h4 }}>Pre-defined ingredients will be translated too.</Text>

            <View >
                <Picker
                    selectedValue={selectedLanguage}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => setSelectedLanguage(itemValue)}
                >
                    <Picker.Item label="English" value='en' />
                    <Picker.Item label="Français" value="fr" />
                    <Picker.Item label="Nederlands" value="nl" />

                </Picker>
            </View>

            <Text>{"\n"}</Text>
            <Text style={{ ...textStyle.h2 }}>Units</Text>
            <Text style={{ ...textStyle.h4 }}>Your recipes' units will be converted too.</Text>
            <View >
                <Picker
                    selectedValue={units}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => setUnits(itemValue)}
                >
                    <Picker.Item label="Metric" value='metric' />
                    <Picker.Item label="Imperial" value="imperial" />
                </Picker>
            </View>

            <Text>{"\n"}</Text>
            <Text style={{ ...textStyle.h3 }}>Change password </Text>

            <Text>{"\n"}</Text>
            <Text style={{ ...textStyle.h3 }}>Delete account</Text>


        </View>
    );
}

export default Preferences;