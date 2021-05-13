/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {database} from './Config';

database.setPersistenceEnabled(true);

AppRegistry.registerComponent(appName, () => App);
