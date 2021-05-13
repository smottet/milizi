import React, { useState, useRef } from 'react';
import {View, KeyboardAvoidingView, ScrollView, TouchableOpacity, Text} from 'react-native';
import Button from './../common/Button';

import { Icon, Input } from 'react-native-elements'

import auth from '@react-native-firebase/auth';

import {createUser} from '../../api/User';

import {textStyle, ERROR} from './../../styles/Common';
import {SCREEN, WINDOW} from '../Constants'

const SignUp = ({changeScreen}) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [signupLoading, setSignupLoading] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const passwordInputRef = useRef(null);
    const confirmPasswordInputRef = useRef(null);

    const signup = () => {
        setSignupLoading(true);
        setPasswordError(password === '');
        setConfirmPasswordError(confirmPassword === '');
        setEmailError(email === '');
        setErrorMessage('');
        if (confirmPassword && password && email) {
            if (confirmPassword !== password) {
                setErrorMessage('passwords must be the same');
                setSignupLoading(false);
            } else {
                auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
                    createUser(userCredential.user.uid, email);
                    setSignupLoading(false);
                }).catch((reason) => {
                    if (reason.code === 'auth/invalid-email') {
                        setEmailError(true);
                        setErrorMessage('invalid email');
                    } else if (reason.code === 'auth/email-already-in-use') {
                        setEmailError(true);
                        setErrorMessage('email already in use');
                    } else if (reason.code === 'auth/weak-password') {
                        setPasswordError(true);
                        setErrorMessage('weak password');
                    } else {
                        setErrorMessage('An unknown error occured');
                    }
                    setSignupLoading(false);
                });
            }
        } else {
            setSignupLoading(false);
        }
    };

    return (
            <KeyboardAvoidingView style={{flex: 1}}>
                <ScrollView>
                    <View style={{flex: 1, padding: '10%', height: WINDOW.height}}>
                        <View style={{flex: 3, justifyContent: 'flex-start', alignItems: 'flex-start'}}>
                            <TouchableOpacity 
                                style={{flexDirection: 'row', alignItems: 'center'}} 
                                onPress={() => changeScreen(SCREEN.LOGIN)}
                            >
                                <Icon
                                    name='arrow-left'
                                    type='feather'
                                    size={20}
                                    solid={false}
                                />
                                <Text style={{...textStyle.h3, marginLeft: 8}}>Oops I have an account</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 7, justifyContent: 'center'}}>
                            <Input
                                onChangeText={setEmail}
                                autoCompleteType='email'
                                keyboardType='email-address'
                                placeholder='example@mail.com'
                                textAlign='center'
                                inputContainerStyle={emailError ? {borderBottomColor: ERROR} : {}}
                                onSubmitEditing={() => {passwordInputRef.current.focus()}}
                                returnKeyType={'next'}
                                leftIcon={{ type: 'feather', name: 'mail', solid: true }}
                                value={email}
                            />
                            <Input
                                ref={passwordInputRef}
                                onChangeText={setPassword}
                                autoCompleteType='password'
                                secureTextEntry={true}
                                placeholder='Password'
                                textAlign='center'
                                inputContainerStyle={passwordError ? {borderBottomColor: ERROR} : {}}
                                onSubmitEditing={() => {confirmPasswordInputRef.current.focus()}}
                                returnKeyType={'next'}
                                leftIcon={{ type: 'feather', name: 'lock' }}
                                value={password}
                            />
                            <Input
                                ref={confirmPasswordInputRef}
                                onChangeText={setConfirmPassword}
                                autoCompleteType='password'
                                secureTextEntry={true}
                                placeholder='Gimme that again'
                                textAlign='center'
                                inputContainerStyle={confirmPasswordError ? {borderBottomColor: ERROR} : {}}
                                returnKeyType={'done'}
                                value={confirmPassword}
                            />
                        </View>
                        <View style={{flex: 3, justifyContent: 'flex-end'}}>
                            <Text style={{...textStyle.error, textAlign: 'center', marginBottom: 5}}>{errorMessage}</Text>
                            <Button disabled={signupLoading} onPress={signup} text={"Let's go"}/>
                        </View> 
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
    );
};

export default SignUp;