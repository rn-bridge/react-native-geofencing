import { type EventSubscription } from 'react-native';
import { type LocationType, type RequestLocationParamsType, type RequestLocationResponseType } from "./NativeGeofencing";
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
declare function requestLocation(params?: RequestLocationParamsType): Promise<RequestLocationResponseType>;
declare function getLocationAuthorizationStatus(): Promise<string>;
declare function getCurrentLocation(): Promise<LocationType>;
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
declare function removeAllGeofence(): Promise<{
    success: boolean;
    type: string;
}>;
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
};
export default _default;
//# sourceMappingURL=index.d.ts.map