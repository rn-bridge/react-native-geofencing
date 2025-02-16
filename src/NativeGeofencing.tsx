import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type LocationType = {
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

export type RequestLocationParamsType = {
	allowWhileUsing?: boolean;
	allowAlways?: boolean;
};

export type RequestLocationResponseType = {
	success: boolean;
	location: string;
};

export interface Spec extends TurboModule {
	requestLocation(params: RequestLocationParamsType, response: (response: RequestLocationResponseType) => void): void;
	getLocationAuthorizationStatus(): Promise<string>;
	getCurrentLocation(): Promise<LocationType>;
	addGeofence(params: { id: string; latitude: number; longitude: number; radius: number }): Promise<{ success: boolean; id: string; error: string }>;
	removeGeofence(id: string): Promise<{ success: boolean; id: string; error: string }>;
	getRegisteredGeofences(): Promise<string[]>;
	removeAllGeofence(): Promise<{ success: boolean; type: string }>;
	addListener: (eventType: string) => void;
    removeListeners: (count: number) => void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('RNGeofencing');
