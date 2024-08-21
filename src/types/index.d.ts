import { NativeEventEmitter, type EventSubscription } from 'react-native';
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
declare function requestLocation(params?: requestLocationParamsType): Promise<requestLocationResponseType>;
declare function getLocationAuthorizationStatus(): Promise<string>;
export type locationType = {
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
declare function getCurrentLocation(): Promise<locationType>;
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
declare function addGeofence(params?: paramsType): Promise<returnType>;
declare function removeGeofence(id: string): Promise<returnType>;
declare function getRegisteredGeofences(): Promise<string[]>;
type removeAllGeofenceReturnType = {
    success: boolean;
    type: string;
};
declare function removeAllGeofence(): Promise<removeAllGeofenceReturnType>;
declare function onEnter(callback: (ids: string[]) => void): EventSubscription;
declare function onExit(callback: (ids: string[]) => void): EventSubscription;
declare function removeOnEnterListener(): void;
declare function removeOnExitListener(): void;
declare function isOnEnterListenerAdded(): boolean;
declare function isOnExitListenerAdded(): boolean;
declare const _default: {
    requestLocation: typeof requestLocation;
    getLocationAuthorizationStatus: typeof getLocationAuthorizationStatus;
    getCurrentLocation: typeof getCurrentLocation;
    addGeofence: typeof addGeofence;
    removeGeofence: typeof removeGeofence;
    getRegisteredGeofences: typeof getRegisteredGeofences;
    removeAllGeofence: typeof removeAllGeofence;
    onEnter: typeof onEnter;
    onExit: typeof onExit;
    removeOnEnterListener: typeof removeOnEnterListener;
    removeOnExitListener: typeof removeOnExitListener;
    isOnEnterListenerAdded: typeof isOnEnterListenerAdded;
    isOnExitListenerAdded: typeof isOnExitListenerAdded;
    geofencingEventEmitter: NativeEventEmitter;
};
export default _default;