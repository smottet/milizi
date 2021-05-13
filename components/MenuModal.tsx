/* eslint-disable prettier/prettier */
/**
 * @format
 */

import React from 'react';
import {Modal, Text, View, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements'

import {WHITE} from '../styles/Common';
import {HEADER_HEIGHT} from './Constants';

import {textStyle} from '../styles/Common'

const MenuModalItem = ({text, iconName, iconType='feather', action, setModalVisible}) => {
    return (
        <TouchableOpacity
            style={{marginVertical: 8, width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}
            onPress={() => {setModalVisible(false); action();}}>
            <Text style={{...textStyle.h3, marginRight: 30}}>{text}</Text>
            <Icon
                name={iconName}
                type={iconType}
                size={30}
            />
        </TouchableOpacity>
    );
}

const MenuModal = ({modalVisible, setModalVisible, items}) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <TouchableOpacity style={{flex: 1, backgroundColor: WHITE, opacity: 0.9}} onPress={() => {setModalVisible(false)}}>
                <View style={{height: HEADER_HEIGHT, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: '5%'}}>
                    <Text style={{...textStyle.h4}}>Menu</Text>
                    <Icon
                        name='chevron-down'
                        type='feather'
                        color='black'
                        size={40}
                        style={{marginLeft: 30}}
                    />
                </View>
                <View style={{paddingHorizontal: '5%'}}>
                    {items.map((item, key) => <MenuModalItem {...item} setModalVisible={setModalVisible} key={key}/>)}
                </View>
            </TouchableOpacity>
        </Modal>
    );

};

export default MenuModal;
