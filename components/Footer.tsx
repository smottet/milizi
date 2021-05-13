import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Icon, Divider} from 'react-native-elements'

import {DARK_ORGANGE} from '../styles/Common'
import {SCREEN} from './Constants'

const Footer = ({changeScreen, selectedScreen}) => {
    return (
        <View style={{flex:1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {changeScreen(SCREEN.LIST)}}>
                <Icon
                    name='list'
                    type='feather'
                    size={30}
                    style={{marginBottom: 3}}
                />
                {selectedScreen === SCREEN.LIST ? <Divider style={{height: 3, backgroundColor: DARK_ORGANGE, width: 45}}/> : <View style={{height: 3}}/>}
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onPress={() => {changeScreen(SCREEN.RECIPE)}}>
                <Icon
                    name='book-open'
                    type='feather'
                    size={30}
                    style={{marginBottom: 3}}
                />
                {selectedScreen === SCREEN.RECIPE ? <Divider style={{height: 3, backgroundColor: DARK_ORGANGE, width: 45}}/> : <View style={{height: 3}}/>}
            </TouchableOpacity>
        </View>
    );

};

export default Footer;
