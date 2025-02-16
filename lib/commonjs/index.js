"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Events = exports.Authorization = void 0;
var _reactNative = require("react-native");
const RNGeofencingModule = require("./NativeGeofencing").default ?? _reactNative.NativeModules.RNGeofencing;
const LINKING_ERROR = `The package '@rn-bridge/react-native-geofencing' doesn't seem to be linked. Make sure: \n\n` + _reactNative.Platform.select({
  ios: "- You have run 'pod install'\n",
  default: ''
}) + '- You rebuilt the app after installing the package\n' + '- You are not using Expo Go\n';
const RNGeofencing = RNGeofencingModule ? RNGeofencingModule : new Proxy({}, {
  get() {
    throw new Error(LINKING_ERROR);
  }
});
const emitterModule = _reactNative.Platform.select({
  ios: RNGeofencingModule,
  android: null
});
const geofencingEventEmitter = new _reactNative.NativeEventEmitter(emitterModule);
const Events = exports.Events = {
  Enter: 'onEnter',
  Exit: 'onExit'
};
const Authorization = exports.Authorization = {
  Always: 'Always',
  WhenInUse: 'WhenInUse',
  Restricted: 'Restricted',
  Denied: 'Denied',
  NotDetermined: 'NotDetermined',
  Unknown: 'Unknown'
};
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
_reactNative.AppRegistry.registerHeadlessTask('onGeofenceTransition', () => onGeofenceTransition);
async function requestAndroidPermissions(params) {
  let granted = await _reactNative.PermissionsAndroid.request(
  //@ts-ignore
  _reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  if (granted === _reactNative.PermissionsAndroid.RESULTS.GRANTED && params.allowAlways) {
    granted = await _reactNative.PermissionsAndroid.request(
    //@ts-ignore
    _reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
  }
  const location = await getLocationAuthorizationStatusAndroid();
  return {
    success: _reactNative.PermissionsAndroid.RESULTS.GRANTED === granted,
    location
  };
}
async function requestLocation(params = {}) {
  const requestParams = {
    allowWhileUsing: params.allowWhileUsing ?? false,
    allowAlways: params.allowAlways ?? false
  };
  if (_reactNative.Platform.OS === 'android') {
    return requestAndroidPermissions(requestParams);
  }
  return new Promise(resolve => {
    RNGeofencing.requestLocation(requestParams, response => {
      resolve(response);
    });
  });
}
async function getLocationAuthorizationStatusAndroid() {
  let location = 'Denied';
  const whenInUse = await _reactNative.PermissionsAndroid.check(
  //@ts-ignore
  _reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  const background = await _reactNative.PermissionsAndroid.check(
  //@ts-ignore
  _reactNative.PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION);
  if (whenInUse) {
    location = 'WhenInUse';
  }
  if (background) {
    location = 'Always';
  }
  return location;
}
async function getLocationAuthorizationStatus() {
  if (_reactNative.Platform.OS === 'android') {
    return await getLocationAuthorizationStatusAndroid();
  }
  return RNGeofencing.getLocationAuthorizationStatus();
}
async function getCurrentLocation() {
  return RNGeofencing.getCurrentLocation();
}
async function addGeofence(params = {}) {
  if (!params.id || !params.latitude || !params.longitude || !params.radius) {
    return Promise.reject('invalid parameters');
  }
  return RNGeofencing.addGeofence(params);
}
async function removeGeofence(id) {
  if (!id) {
    return Promise.reject('id cannot be null or undefined');
  }
  return RNGeofencing.removeGeofence(id);
}
async function getRegisteredGeofences() {
  return RNGeofencing.getRegisteredGeofences();
}
async function removeAllGeofence() {
  return RNGeofencing.removeAllGeofence();
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
var _default = exports.default = {
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
  isOnExitListenerAdded
};
//# sourceMappingURL=index.js.map