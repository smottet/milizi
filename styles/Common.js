import {StyleSheet} from 'react-native';

// COLORS
export const PRIMARY = '#F94144';
export const ERROR = '#DC4141';
export const DARK_ORGANGE = '#F3722C';
export const LIGHT_ORANGE = '#F8961E';
export const YELLOW = '#F8961E';
export const LIGHT_GREEN = '#90BE6D';
export const DARK_GREEN = '#43AA8B';
export const BLUE = '#577590';

export const BLACK = '#000000';
export const DARK_GRAY = 'rgba(0, 0, 0, 0.5)';
export const LIGHT_GRAY = 'rgba(0, 0, 0, 0.25)';
export const VERY_LIGHT_GRAY = 'rgba(0, 0, 0, 0.125)';
export const WHITE = '#FFFFFF'

export const commonStyle = StyleSheet.create({
	container: {
		height: '100%',
		backgroundColor: PRIMARY,
	},
});

export const buttonStyle = StyleSheet.create({
	primary: {
		justifyContent: 'center',
		backgroundColor: DARK_ORGANGE,
		height: 50,
		borderRadius: 8,
	},
	primaryDisabled: {
		justifyContent: 'center',
		backgroundColor: LIGHT_GRAY,
		height: 50,
		borderRadius: 8,
	},
	textPrimary: {
		textAlign: 'center',
		fontSize: 20,
		color: WHITE,
	}
});

export const inputStyle = StyleSheet.create({
	primary: {
		borderBottomColor: BLACK,
		borderBottomWidth: 1,
		color: BLACK,
	},
});

export const textStyle = StyleSheet.create({
	h1: {
		fontSize: 36,
	},
	h2: {
		fontSize: 32,
	},
	h3: {
		fontSize: 24,
	},
	h4: {
		fontSize: 20,
	},
	error: {
		color: ERROR,
	},
});