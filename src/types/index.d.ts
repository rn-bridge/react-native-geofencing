import { type EventSubscription } from 'react-native';
export declare const Events: {
	Enter: string;
	Exit: string;
};
export declare const Authorization: {
	Always: string;
	WhenInUse: string;
	Restricted: string;
	Denied: string;
	NotDetermined: string;
	Unknown: string;
};
type requestLocationParamsType = {
	allowWhileUsing?: boolean;
	allowAlways?: boolean;
};
type requestLocationResponseType = {
	success: boolean;
	location: string;
};
export declare function requestLocation(
	params?: requestLocationParamsType
): Promise<requestLocationResponseType>;
export declare function getLocationAuthorizationStatus(): Promise<string>;
type locationType = {
	latitude: number;
	longitude: number;
	altitude: number;
	name: string;
	city: string;
	state: string;
	country: string;
	postalCode: string;
	isoCountryCode: string;
	timeZone: string;
};
export declare function getCurrentLocation(): Promise<locationType>;
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
export declare function addGeofence(params?: paramsType): Promise<returnType>;
export declare function removeGeofence(id: string): Promise<returnType>;
export declare function getRegisteredGeofences(): Promise<string[]>;
type removeAllGeofenceReturnType = {
	success: boolean;
	type: string;
};
export declare function removeAllGeofence(): Promise<removeAllGeofenceReturnType>;
export declare const Geofence: {
	onEnter: (callback: (ids: string[]) => void) => EventSubscription;
	onExit: (callback: (ids: string[]) => void) => EventSubscription;
	removeOnEnterListener: () => void;
	removeOnExitListener: () => void;
	isOnEnterListenerAdded: () => boolean;
	isOnExitListenerAdded: () => boolean;
};
export {};
//# sourceMappingURL=index.d.ts.map
