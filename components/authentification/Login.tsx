/* eslint-disable prettier/prettier */
/**
 * @format
 */

import auth from '@react-native-firebase/auth';

import React, { useState, useRef, useEffect } from 'react';
import {View,  KeyboardAvoidingView, ScrollView, Text, TouchableOpacity} from 'react-native';

import Button from './../common/Button';
import { Input, Icon } from 'react-native-elements'

import {textStyle, ERROR, BLACK, LIGHT_GRAY} from './../../styles/Common';
import {SCREEN, WINDOW} from '../Constants'

const Login = ({changeScreen}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [emailBorderColor, setEmailBorderColor] = useState(LIGHT_GRAY);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [passwordBorderColor, setPasswordBorderColor] = useState(LIGHT_GRAY);
    const [errorMessage, setErrorMessage] = useState('');
    const passwordInputRef = useRef(null);

    useEffect(() => {
        if (passwordFocused) {
            setPasswordBorderColor(BLACK);
        } else if (passwordError) {
            setPasswordBorderColor(ERROR);
        } else {
            setPasswordBorderColor(LIGHT_GRAY);
        }
    }, [passwordError, passwordFocused]);

    useEffect(() => {
        if (emailFocused) {
            setEmailBorderColor(BLACK);
        } else if (emailError) {
            setEmailBorderColor(ERROR);
        } else {
            setEmailBorderColor(LIGHT_GRAY);
        }
    }, [emailError, emailFocused]);

    const login = () => {
        setLoginLoading(true);
        setPasswordError(password === '');
        setEmailError(email === '');
        setErrorMessage('');
        if (password && email) {
            auth().signInWithEmailAndPassword(email, password).then(() => {
                setLoginLoading(false);
            }).catch((reason) => {
                if (reason.code === 'auth/invalid-email') {
                    setEmailError(true);
                    setErrorMessage('invalid email');
                } else if (reason.code === 'auth/user-disabled') {
                    setEmailError(true);
                    setErrorMessage('invalid email');
                } else if (reason.code === 'auth/user-not-found') {
                    setEmailError(true);
                    setErrorMessage('invalid email');
                } else if (reason.code === 'auth/wrong-password') {
                    setPasswordError(true);
                    setErrorMessage('wrong password');
                } else {
                    setErrorMessage('An unknown error occured');
                }
                setLoginLoading(false);
            });
        } else {
            setLoginLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView style={{flex: 1}}>
            <ScrollView>
                <View style={{flex: 1,  padding: '10%', height: WINDOW.height}}>
                    <View style={{flex: 3, justifyContent: 'flex-start', alignItems: 'flex-end'}}>
                        <TouchableOpacity 
                            style={{flexDirection: 'row', alignItems: 'center'}} 
                            onPress={() => changeScreen(SCREEN.SIGNUP)}
                        >
                            <Text style={{...textStyle.h3, marginRight: 8}}>Create Account</Text>
                            <Icon
                                name='arrow-right'
                                type='feather'
                                size={20}
                                solid={false}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex: 7, justifyContent: 'center'}}>
                        <Input
                            onChangeText={(text) => {setEmail(text); setEmailError(false)}}
                            onFocus={() => {setEmailFocused(true)}}
                            onBlur={() => {setEmailFocused(false)}}
                            autoCompleteType='email'
                            keyboardType='email-address'
                            placeholder='example@mail.com'
                            textAlign='center'
                            inputContainerStyle={{borderBottomColor: emailBorderColor}}
                            onSubmitEditing={() => {passwordInputRef.current.focus()}}
                            returnKeyType={'next'}
                            leftIcon={{ type: 'feather', name: 'mail', solid: true }}
                            value={email}
                        />
                        <Input
                            ref={passwordInputRef}
                            onChangeText={(text) => {setPassword(text), setPasswordError(false)}}
                            onFocus={() => {setPasswordFocused(true)}}
                            onBlur={() => {setPasswordFocused(false)}}
                            autoCompleteType='password'
                            secureTextEntry={true}
                            placeholder='Password'
                            textAlign='center'
                            inputContainerStyle={{borderBottomColor: passwordBorderColor} }
                            returnKeyType={'done'}
                            leftIcon={{ type: 'feather', name: 'lock' }}
                            value={password}
                        />
                    </View>
                    <View style={{flex: 3, justifyContent: 'flex-end'}}>
                        <Text style={{...textStyle.error, textAlign: 'center', marginBottom: 5}}>{errorMessage}</Text>
                        <Button disabled={loginLoading} onPress={login} text={'Cook Time!'}/>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );

};

export default Login;
