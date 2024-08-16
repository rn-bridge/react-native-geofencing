import {
  NativeModules,
  Platform,
  AppRegistry,
  NativeEventEmitter,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-geofencing' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const Geofencing = NativeModules.Geofencing
  ? NativeModules.Geofencing
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

const emitter = Platform.OS === 'ios' ? Geofencing : null;
const geofencingEventEmitter = new NativeEventEmitter(emitter);

async function onGeofenceTransition(params: { event: string; ids: string[] }) {
  geofencingEventEmitter.emit(params.event, params.ids);
}

AppRegistry.registerHeadlessTask(
  'onGeofenceTransition',
  () => onGeofenceTransition
);

export const Events = {
  Enter: 'onEnter',
  Exit: 'onExit',
};

type paramsType = {
  id: string;
  latitude: number;
  longitude: number;
  radius: number;
};

type returnType = {
  success: boolean;
  id: string;
  type: string;
};

export async function addGeofence(
  params: paramsType = {} as paramsType
): Promise<returnType> {
  if (!params.id || !params.latitude || !params.longitude || !params.radius) {
    return Promise.reject('invalid parameters');
  }
  return await Geofencing.addGeofence(params);
}

export async function removeGeofence(id: string): Promise<returnType> {
  if (!id) {
    return Promise.reject('id cannot be null or undefined');
  }
  return await Geofencing.removeGeofence(id);
}

export async function getRegisteredGeofences(): Promise<string[]> {
  return await Geofencing.getRegisteredGeofences();
}

type removeAllGeofenceReturnType = {
  success: boolean;
  type: string;
};

export async function removeAllGeofence(): Promise<removeAllGeofenceReturnType> {
  return await Geofencing.removeAllGeofence();
}

export const Geofence = {
  onEnter: (callback: (ids: string[]) => void) => {
    return geofencingEventEmitter.addListener(Events.Enter, callback);
  },

  onExit: (callback: (ids: string[]) => void) => {
    return geofencingEventEmitter.addListener(Events.Exit, callback);
  },

  removeOnEnterListener: () => {
    return geofencingEventEmitter.removeAllListeners(Events.Enter);
  },

  removeOnExitListener: () => {
    return geofencingEventEmitter.removeAllListeners(Events.Exit);
  },
};
