import React, {useState, useEffect} from 'react';
import {View, KeyboardAvoidingView} from 'react-native';

import auth from '@react-native-firebase/auth';

import List from './List';
import Preferences from './Preferences';

import Recipe from './Recipe';
import Header from './Header';
import Footer from './Footer';
import MenuModal, {MenuModalItem} from './MenuModal';

import {Screens, HEADER_HEIGHT, FOOTER_HEIGHT, WINDOW, MainScreens, isMainScreen} from './Constants';


const AppScreen = () => {

    const [visibleScreen, _setVisibleScreen] = useState(Screens.LIST as Screens);
    const [mainScreen, _setMainScreen] = useState(Screens.LIST as MainScreens);
    const setVisibleScreen = (screen: Screens) => {
        // Update mainScreen only if we are switching to a main screen!
        if (isMainScreen(screen)){ 
            _setMainScreen(screen)
        }
        _setVisibleScreen(screen)
    }

    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [screenMenuItems, setScreenMenuItems]: [MenuModalItem[], React.Dispatch<MenuModalItem[]>] = useState([]);
    const [menuItems, setMenuItems]: [MenuModalItem[], React.Dispatch<MenuModalItem[]>] = useState([]);

    const commonMenuItems = [
        {text: 'Preferences', iconName: 'sliders', action: ()=>{setVisibleScreen(Screens.PREFERENCES)}},
        {text: 'Disconnect', iconName: 'log-out', action: () => {auth().signOut()}},            
    ];

    useEffect(() => {
        setMenuItems([...screenMenuItems, ...commonMenuItems]);
    }, [screenMenuItems]);

    const screenData = {}

    screenData[Screens.LIST] = {
        headerTitle: 'My Lists',
    }
    
    screenData[Screens.RECIPE] = {
        headerTitle: 'My Recipes',
    }

    const body = visibleScreen === Screens.LIST ? <List setMenuItems={setScreenMenuItems} /> : <Recipe setMenuItems={setScreenMenuItems} />

    return (visibleScreen === Screens.PREFERENCES ?
        <Preferences mainScreen={mainScreen} setVisibleScreen={setVisibleScreen}></Preferences> :
        <KeyboardAvoidingView style={{ flex: 1 }}>
            <View style={{ height: WINDOW.height }}>
                <MenuModal modalVisible={menuModalVisible} setModalVisible={setMenuModalVisible} items={menuItems} />
                <View style={{ height: HEADER_HEIGHT }}>
                    <Header title={screenData[visibleScreen].headerTitle} displayMenu={setMenuModalVisible} />
                </View>
                <View style={{ height: WINDOW.height - (HEADER_HEIGHT + FOOTER_HEIGHT) }}>
                    {body}
                </View>
                <View style={{ height: FOOTER_HEIGHT }}>
                    <Footer changeScreen={setVisibleScreen} selectedScreen={visibleScreen} />
                </View>
            </View>
        </KeyboardAvoidingView>
    );

};

export default AppScreen;
