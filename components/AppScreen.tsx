import React, {useState, useEffect} from 'react';
import {View, KeyboardAvoidingView} from 'react-native';

import auth from '@react-native-firebase/auth';

import List from './List';
import Recipe from './Recipe';
import Header from './Header';
import Footer from './Footer';
import MenuModal, {MenuModalItem} from './MenuModal';

import {SCREEN, HEADER_HEIGHT, FOOTER_HEIGHT, WINDOW} from './Constants';


const AppScreen = () => {

    const [userScreen, seUserScreen] = useState(SCREEN.LIST);
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [screenMenuItems, setScreenMenuItems]: [MenuModalItem[], React.Dispatch<MenuModalItem[]>] = useState([]);
    const [menuItems, setMenuItems]: [MenuModalItem[], React.Dispatch<MenuModalItem[]>] = useState([]);

    const commonMenuItems: MenuModalItem[] = [
        {text: 'Preferences', iconName: 'sliders', action: () => {}},
        {text: 'Disconnect', iconName: 'log-out', action: () => {auth().signOut()}},            
    ];

    useEffect(() => {
        setMenuItems([...screenMenuItems, ...commonMenuItems]);
    }, [screenMenuItems]);

    const screenData = {}

    screenData[SCREEN.LIST] = {
        headerTitle: 'My Lists',
    }
    
    screenData[SCREEN.RECIPE] = {
        headerTitle: 'My Recipes',
    }

    const body = userScreen === SCREEN.LIST ? <List setMenuItems={setScreenMenuItems}/> : <Recipe setMenuItems={setScreenMenuItems}/>

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
                <View style={{height: WINDOW.height}}>
                    <MenuModal modalVisible={menuModalVisible} setModalVisible={setMenuModalVisible} items={menuItems}/>
                    <View style={{height: HEADER_HEIGHT}}>
                        <Header title={screenData[userScreen].headerTitle} displayMenu={setMenuModalVisible}/>
                    </View>
                    <View style={{height: WINDOW.height - (HEADER_HEIGHT + FOOTER_HEIGHT)}}>
                        {body}
                    </View>
                    <View style={{height: FOOTER_HEIGHT}}>
                        <Footer changeScreen={seUserScreen} selectedScreen={userScreen}/>
                    </View>
                </View>
        </KeyboardAvoidingView>
    );

};

export default AppScreen;
