/* eslint-disable prettier/prettier */
/**
 * @format
 */

import React, {useState, useEffect} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {buttonStyle} from './../../styles/Common';

const Button = ({text, buttonCustomStyle={}, textCustomStyle={}, disabled, ...props}) => {

    const [buttonFullStyle, setButtonFullStyle] = useState({});
    const [textFullStyle, setTextFullStyle] = useState({});
    useEffect(() => {
        const buttonDisabledStyle = disabled ? buttonStyle.primaryDisabled : {};
        setButtonFullStyle({...buttonStyle.primary, ...buttonCustomStyle, ...buttonDisabledStyle});
        setTextFullStyle({...buttonStyle.textPrimary, ...textCustomStyle});
    }, [disabled]);

    return (
        <TouchableOpacity 
            style={buttonFullStyle}
            disabled={disabled}
            {...props}   
        >
            <Text style={textFullStyle}>{text}</Text>
        </TouchableOpacity>
    );

};

export default Button;
