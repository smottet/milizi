import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements'

import {textStyle} from './../styles/Common';

import {WINDOW} from './Constants';

const Header = ({title, displayMenu}) => {
    return (
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: WINDOW.width*0.05}}>
            <View style={{flex:1}}>
                <Text style={{...textStyle.h2}}>{title}</Text>
            </View>
            <View style={{flex: 1, justifyContent: 'flex-end', flexDirection: 'row'}}>
                <TouchableOpacity>
                    <Icon
                        name='bell'
                        type='feather'
                        size={30}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={{marginLeft: WINDOW.width*0.05}} onPress={() => displayMenu(true)}>
                    <Icon
                        name='menu'
                        type='feather'
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

};

export default Header;
