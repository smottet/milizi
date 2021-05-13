/* eslint-disable prettier/prettier */
/**
 * @format
 */

import React, { useState, useEffect, useContext } from 'react';
import {View, Text, Button} from 'react-native';
import auth from '@react-native-firebase/auth';
import {SCREEN} from './Constants'


import {UserContext} from '../App';


const Recipe = ({setMenuItems}) => {

    useEffect(() => {
        setMenuItems([]);
        return () => {setMenuItems([]);}
    }, [])

    return (
        <View>
        </View>
    );

};

export default Recipe;
