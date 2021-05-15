import {Dimensions} from 'react-native';

export enum MainScreens {
    LIST = 'list',
    RECIPE = 'recipe',
};

export enum SubScreens {
    PREFERENCES = 'preferences'
}

export enum WelcomeScreens {
    LOGIN = 'login',
    SIGNUP = 'signup',
}

export const Screens = {
    ...SubScreens,
    ...MainScreens,
    ...WelcomeScreens
}
export type Screens = MainScreens | SubScreens | WelcomeScreens

export const isMainScreen = (screen: Screens): screen is MainScreens => {
    return Object.values(MainScreens).includes(screen as any)
}

export const WINDOW = Dimensions.get('window');

export const HEADER_HEIGHT = 80;
export const FOOTER_HEIGHT = 80;
export const TABS_HEIGHT = 75;
