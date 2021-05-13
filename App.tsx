/* eslint-disable prettier/prettier */
/**
 * @format
 */

import React, { useState, useEffect, createContext} from 'react';
import auth from '@react-native-firebase/auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import Login from './components/authentification/Login';
import SignUp from './components/authentification/SignUp';

import AppScreen from './components/AppScreen';

import {SCREEN} from './components/Constants';


export const UserContext = createContext({
	user: undefined
});

const App = () => {

	const [user, setUser] = useState()
	const [userStateLoaded, setUserStateLoaded] = useState(false);
	const [authScreen, setAuthScreen] = useState(SCREEN.LOGIN);

	function onAuthStateChanged(user: any) {
		setUser(user)
		setUserStateLoaded(true);
	}

	useEffect(() => {
		const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
		return subscriber;
	}, []);

	if (!userStateLoaded) {
		return (
			<></>
		);
	}
	if (!user) {
		return (
			authScreen === SCREEN.LOGIN ? <Login changeScreen={setAuthScreen}/> : <SignUp changeScreen={setAuthScreen}/>
		);
	} else {
		return (
			<UserContext.Provider value={{user}}>
				<AppScreen/>
			</UserContext.Provider>
		);
	}
};

const AppSafeAreaProvider = () => {
	return (
		<SafeAreaProvider>
			<App/>
		</SafeAreaProvider>
	);
}
export default AppSafeAreaProvider;
