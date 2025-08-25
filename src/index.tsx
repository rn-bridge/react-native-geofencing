import {
	Platform,
	AppRegistry,
	NativeEventEmitter,
	type EventSubscription,
	PermissionsAndroid,
	type NativeModule,
	NativeModules
} from 'react-native';
import { type LocationType, type RequestLocationParamsType, type RequestLocationResponseType } from "./NativeGeofencing"

const RNGeofencingModule = require("./NativeGeofencing").default ?? NativeModules.RNGeofencing

const LINKING_ERROR =
	`The package '@rn-bridge/react-native-geofencing' doesn't seem to be linked. Make sure: \n\n` +
	Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
	'- You rebuilt the app after installing the package\n' +
	'- You are not using Expo Go\n';

const RNGeofencing = RNGeofencingModule
	? RNGeofencingModule
	: new Proxy(
		{},
		{
			get() {
				throw new Error(LINKING_ERROR);
			}
		}
	);

const emitterModule = Platform.select({
	ios: RNGeofencingModule,
	android: null
  }) as unknown as NativeModule | undefined
  
const geofencingEventEmitter = new NativeEventEmitter(emitterModule);

export const Events = {
	Enter: 'onEnter',
	Exit: 'onExit'
};

export const Authorization = {
	Always: 'Always',
	WhenInUse: 'WhenInUse',
	Restricted: 'Restricted',
	Denied: 'Denied',
	NotDetermined: 'NotDetermined',
	Unknown: 'Unknown'
};

async function delay(duration: number): Promise<boolean> {
	return new Promise((resolve) => setTimeout(() => resolve(true), duration));
}

async function onGeofenceTransition(params: { event: string; ids: string[] }) {
	if (!isOnEnterListenerAdded() || !isOnExitListenerAdded()) {
		console.log('Listeners not added, waiting for 5sec...');
		await delay(5000);
	}

	geofencingEventEmitter.emit(params.event, params.ids);
}

AppRegistry.registerHeadlessTask(
	'onGeofenceTransition',
	() => onGeofenceTransition
);

async function requestAndroidPermissions(
	params: RequestLocationParamsType
): Promise<RequestLocationResponseType> {
	let granted = await PermissionsAndroid.request(
		//@ts-ignore
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
	);

	if (granted === PermissionsAndroid.RESULTS.GRANTED && params.allowAlways) {
		granted = await PermissionsAndroid.request(
			//@ts-ignore
			PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
		);
	}

	const location = await getLocationAuthorizationStatusAndroid();

	return {
		success: PermissionsAndroid.RESULTS.GRANTED === granted,
		location
	};
}

async function requestLocation(
	params: RequestLocationParamsType = {}
): Promise<RequestLocationResponseType> {
	const requestParams = {
		allowWhileUsing: params.allowWhileUsing ?? false,
		allowAlways: params.allowAlways ?? false
	};
	if (Platform.OS === 'android') {
		return requestAndroidPermissions(requestParams);
	}
	return new Promise((resolve) => {
		RNGeofencing.requestLocation(
			requestParams,
			(response: RequestLocationResponseType) => {
				resolve(response);
			}
		);
	});
}

async function getLocationAuthorizationStatusAndroid(): Promise<string> {
	let location = 'Denied';
	const whenInUse = await PermissionsAndroid.check(
		//@ts-ignore
		PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
	);

	const background = await PermissionsAndroid.check(
		//@ts-ignore
		PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION
	);

	if (whenInUse) {
		location = 'WhenInUse';
	}

	if (background) {
		location = 'Always';
	}

	return location;
}

async function getLocationAuthorizationStatus(): Promise<string> {
	if (Platform.OS === 'android') {
		return await getLocationAuthorizationStatusAndroid();
	}
	return RNGeofencing.getLocationAuthorizationStatus();
}

async function getCurrentLocation(): Promise<LocationType> {
	return RNGeofencing.getCurrentLocation();
}

async function isLocationServicesEnabled(): Promise<boolean> {
	return RNGeofencing.isLocationServicesEnabled();
}

type paramsType = {
	id: string;
	latitude: number;
	longitude: number;
	radius: number;
};

type returnType = {
	success: boolean;
	id: string;
	error: string;
};

async function addGeofence(
	params: paramsType = {} as paramsType
): Promise<returnType> {
	if (!params.id || !params.latitude || !params.longitude || !params.radius) {
		return Promise.reject('invalid parameters');
	}
	return RNGeofencing.addGeofence(params);
}

async function removeGeofence(id: string): Promise<returnType> {
	if (!id) {
		return Promise.reject('id cannot be null or undefined');
	}
	return RNGeofencing.removeGeofence(id);
}

async function getRegisteredGeofences(): Promise<string[]> {
	return RNGeofencing.getRegisteredGeofences();
}

async function removeAllGeofence(): Promise<{success: boolean; type: string}> {
	return RNGeofencing.removeAllGeofence();
}

function onEnter(callback: (ids: string[]) => void): EventSubscription {
	return geofencingEventEmitter.addListener(Events.Enter, callback);
}

function onExit(callback: (ids: string[]) => void): EventSubscription {
	return geofencingEventEmitter.addListener(Events.Exit, callback);
}

function removeOnEnterListener(): void {
	geofencingEventEmitter.removeAllListeners(Events.Enter);
}

function removeOnExitListener(): void {
	geofencingEventEmitter.removeAllListeners(Events.Exit);
}

function isOnEnterListenerAdded(): boolean {
	return geofencingEventEmitter.listenerCount(Events.Enter) > 0;
}

function isOnExitListenerAdded(): boolean {
	return geofencingEventEmitter.listenerCount(Events.Exit) > 0;
}


export default {
	requestLocation,
	getLocationAuthorizationStatus,
	getCurrentLocation,
	isLocationServicesEnabled,
	addGeofence,
	removeGeofence,
	getRegisteredGeofences,
	removeAllGeofence,
	onEnter,
	onExit,
	removeOnEnterListener,
	removeOnExitListener,
	isOnEnterListenerAdded,
	isOnExitListenerAdded
}