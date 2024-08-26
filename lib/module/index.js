"use strict";

import { NativeModules, Platform, AppRegistry, NativeEventEmitter, PermissionsAndroid } from 'react-native';
const LINKING_ERROR = `The package '@rn-bridge/react-native-geofencing' doesn't seem to be linked. Make sure: \n\n` + Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const Geofencing = NativeModules.Geofencing ? NativeModules.Geofencing : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
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
const nativeModule = Platform.OS === 'ios' ? Geofencing : null;
const geofencingEventEmitter = new NativeEventEmitter(nativeModule);
async function delay(duration) {
  return new Promise(resolve => setTimeout(() => resolve(true), duration));
}
async function onGeofenceTransition(params) {
  if (!isOnEnterListenerAdded() || !isOnExitListenerAdded()) {
    console.log('Listeners not added, waiting for 5sec...');
    await delay(5000);
  }
  geofencingEventEmitter.emit(params.event, params.ids);
}
AppRegistry.registerHeadlessTask('onGeofenceTransition', () => onGeofenceTransition);
async function requestAndroidPermissions(params) {
  let granted = await PermissionsAndroid.request(
  //@ts-ignore
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  if (granted === PermissionsAndroid.RESULTS.GRANTED && params.allowAlways) {
    granted = await PermissionsAndroid.request(
    //@ts-ignore
    PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
  }
  const location = await getLocationAuthorizationStatusAndroid();
  return {
    success: PermissionsAndroid.RESULTS.GRANTED === granted,
    location
  };
}
async function requestLocation(params = {}) {
  const requestParams = {
    allowWhileUsing: params.allowWhileUsing ?? false,
    allowAlways: params.allowAlways ?? false
  };
  if (Platform.OS === 'android') {
    return requestAndroidPermissions(requestParams);
  }
  return new Promise(resolve => {
    Geofencing.requestLocation(requestParams, response => {
      resolve(response);
    });
  });
}
async function getLocationAuthorizationStatusAndroid() {
  let location = 'Denied';
  const whenInUse = await PermissionsAndroid.check(
  //@ts-ignore
  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  const background = await PermissionsAndroid.check(
  //@ts-ignore
  PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
  if (whenInUse) {
    location = 'WhenInUse';
  }
  if (background) {
    location = 'Always';
  }
  return location;
}
async function getLocationAuthorizationStatus() {
  if (Platform.OS === 'android') {
    return await getLocationAuthorizationStatusAndroid();
  }
  return await Geofencing.getLocationAuthorizationStatus();
}
async function getCurrentLocation() {
  return await Geofencing.getCurrentLocation();
}
async function addGeofence(params = {}) {
  if (!params.id || !params.latitude || !params.longitude || !params.radius) {
    return Promise.reject('invalid parameters');
  }
  return await Geofencing.addGeofence(params);
}
async function removeGeofence(id) {
  if (!id) {
    return Promise.reject('id cannot be null or undefined');
  }
  return await Geofencing.removeGeofence(id);
}
async function getRegisteredGeofences() {
  return await Geofencing.getRegisteredGeofences();
}
async function removeAllGeofence() {
  return await Geofencing.removeAllGeofence();
}
function onEnter(callback) {
  return geofencingEventEmitter.addListener(Events.Enter, callback);
}
function onExit(callback) {
  return geofencingEventEmitter.addListener(Events.Exit, callback);
}
function removeOnEnterListener() {
  geofencingEventEmitter.removeAllListeners(Events.Enter);
}
function removeOnExitListener() {
  geofencingEventEmitter.removeAllListeners(Events.Exit);
}
function isOnEnterListenerAdded() {
  return geofencingEventEmitter.listenerCount(Events.Enter) > 0;
}
function isOnExitListenerAdded() {
  return geofencingEventEmitter.listenerCount(Events.Exit) > 0;
}
export default {
  requestLocation,
  getLocationAuthorizationStatus,
  getCurrentLocation,
  addGeofence,
  removeGeofence,
  getRegisteredGeofences,
  removeAllGeofence,
  onEnter,
  onExit,
  removeOnEnterListener,
  removeOnExitListener,
  isOnEnterListenerAdded,
  isOnExitListenerAdded,
  geofencingEventEmitter
};
//# sourceMappingURL=index.js.map