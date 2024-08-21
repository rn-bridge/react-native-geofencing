import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import Geofencing, { Events } from '@rn-bridge/react-native-geofencing';

Geofencing.onEnter((ids) => {
	console.log(Events.Enter, ids);
});

Geofencing.onExit((ids) => {
	console.log(Events.Exit, ids);
});

AppRegistry.registerComponent(appName, () => App);
