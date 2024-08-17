import { AppRegistry } from 'react-native';
import { App } from './src/App';
import { name as appName } from './app.json';
import { Geofence, Events } from '@rn-bridge/react-native-geofencing';

Geofence.onEnter((ids: string[]) => {
	console.log(Events.Enter, ids);
});

Geofence.onExit((ids: string[]) => {
	console.log(Events.Exit, ids);
});

AppRegistry.registerComponent(appName, () => App);
