import {
  NativeModules,
  Platform,
  AppRegistry,
  NativeEventEmitter,
  type EventSubscription,
} from 'react-native';

const LINKING_ERROR =
  `The package '@rn-bridge/react-native-geofencing' doesn't seem to be linked. Make sure: \n\n` +
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

export const Events = {
  Enter: 'onEnter',
  Exit: 'onExit',
};

export const Authorization = {
  Always: 'Always',
  WhenInUse: 'When In Use',
  Restricted: 'Restricted',
  Denied: 'Denied',
  Unknown: 'Unknown',
};

const nativeModule = Platform.OS === 'ios' ? Geofencing : null;
const geofencingEventEmitter = new NativeEventEmitter(nativeModule);

async function delay(duration: number): Promise<boolean> {
  return new Promise((resolve) => setTimeout(() => resolve(true), duration));
}

async function onGeofenceTransition(params: { event: string; ids: string[] }) {
  if (!Geofence.isOnEnterListenerAdded() || !Geofence.isOnExitListenerAdded()) {
    console.log('Listeners not added, waiting for 5sec...');
    await delay(5000);
  }

  geofencingEventEmitter.emit(params.event, params.ids);
}

AppRegistry.registerHeadlessTask(
  'onGeofenceTransition',
  () => onGeofenceTransition
);

type requestLocationParamsType = {
  allowWhileUsing?: boolean;
  allowAlways?: boolean;
};

type requestLocationResponseType = {
  success: boolean;
  location: string;
};

export async function requestLocation(
  params: requestLocationParamsType = {}
): Promise<requestLocationResponseType> {
  const requestParams = {
    allowWhileUsing: params.allowWhileUsing ?? false,
    allowAlways: params.allowAlways ?? false,
  };
  return new Promise((resolve) => {
    Geofencing.requestLocation(
      requestParams,
      (response: requestLocationResponseType) => {
        resolve(response);
      }
    );
  });
}

export async function getLocationAuthorizationStatus(): Promise<string> {
  return await Geofencing.getLocationAuthorizationStatus();
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
  onEnter: (callback: (ids: string[]) => void): EventSubscription => {
    return geofencingEventEmitter.addListener(Events.Enter, callback);
  },

  onExit: (callback: (ids: string[]) => void): EventSubscription => {
    return geofencingEventEmitter.addListener(Events.Exit, callback);
  },

  removeOnEnterListener: (): void => {
    geofencingEventEmitter.removeAllListeners(Events.Enter);
  },

  removeOnExitListener: (): void => {
    geofencingEventEmitter.removeAllListeners(Events.Exit);
  },
  isOnEnterListenerAdded: (): boolean => {
    return geofencingEventEmitter.listenerCount(Events.Enter) > 0;
  },
  isOnExitListenerAdded: (): boolean => {
    return geofencingEventEmitter.listenerCount(Events.Exit) > 0;
  },
};
