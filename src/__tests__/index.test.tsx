import { NativeEventEmitter, NativeModules } from 'react-native';

const mockedCallbacks: {
	onEnter: ((data: string[]) => void)[];
	onExit: ((data: string[]) => void)[];
} = {
	onEnter: [],
	onExit: []
};

jest.mock('react-native', () => {
	return {
		NativeModules: {
			Geofencing: {
				getCurrentLocation: jest.fn(),
				getLocationAuthorizationStatus: jest.fn(),
				addGeofence: jest.fn(),
				removeGeofence: jest.fn(),
				getRegisteredGeofences: jest.fn(),
				removeAllGeofence: jest.fn(),
				requestLocation: jest.fn(),
				Geofence: {
					onEnter: (callback: (data: string[]) => void) => {
						mockedCallbacks.onEnter.push(callback);
					},
					onExit: (callback: (data: string[]) => void) => {
						mockedCallbacks.onExit.push(callback);
					},
					removeOnEnterListener: jest.fn(),
					removeOnExitListener: jest.fn()
				}
			}
		},
		NativeEventEmitter: jest.fn().mockImplementation(() => {
			return {
				addListener: jest.fn(),
				removeAllListeners: jest.fn(),
				emit: (event: string, data: string[]) => {
					if (event === 'onEnter') {
						mockedCallbacks.onEnter.map(
							(callback: (data: string[]) => void) => {
								callback(data);
							}
						);

						mockedCallbacks.onEnter = [];
					} else if (event === 'onExit') {
						mockedCallbacks.onExit.map((callback: (data: string[]) => void) => {
							callback(data);
						});

						mockedCallbacks.onExit = [];
					}
				},
				listenerCount: jest.fn().mockReturnValue(1)
			};
		}),
		PermissionsAndroid: {
			request: jest.fn(),
			check: jest.fn(),
			RESULTS: {
				GRANTED: 'granted',
				DENIED: 'denied'
			},
			PERMISSIONS: {
				ACCESS_FINE_LOCATION: 'ACCESS_FINE_LOCATION',
				ACCESS_BACKGROUND_LOCATION: 'ACCESS_BACKGROUND_LOCATION'
			}
		},
		Platform: {
			select: jest.fn(),
			OS: 'android' // You can switch to 'ios' for testing iOS specific code
		},
		AppRegistry: {
			registerHeadlessTask: jest.fn()
		}
	};
});

describe('Geofencing Module', () => {
	const geofencingEventEmitter = new NativeEventEmitter();

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return current location', async () => {
		const mockLocation = {
			latitude: 10.0,
			longitude: 20.0,
			altitude: 100.0,
			name: 'Test Location',
			city: 'Test City',
			state: 'Test State',
			country: 'Test Country',
			postalCode: '12345',
			isoCountryCode: 'TC',
			timeZone: 'UTC'
		};
		NativeModules.Geofencing.getCurrentLocation.mockResolvedValueOnce(
			mockLocation
		);
		const location = await NativeModules.Geofencing.getCurrentLocation();
		expect(location).toEqual(mockLocation);
	});

	it('should add a geofence', async () => {
		const mockResponse = { success: true, id: '1', error: '' };
		NativeModules.Geofencing.addGeofence.mockResolvedValueOnce(mockResponse);
		const response = await NativeModules.Geofencing.addGeofence({
			id: '1',
			latitude: 10.0,
			longitude: 20.0,
			radius: 100
		});
		expect(response).toEqual(mockResponse);
		expect(NativeModules.Geofencing.addGeofence).toHaveBeenCalledWith({
			id: '1',
			latitude: 10.0,
			longitude: 20.0,
			radius: 100
		});
	});

	it('should remove a geofence', async () => {
		const mockResponse = { success: true, id: '1', error: '' };
		NativeModules.Geofencing.removeGeofence.mockResolvedValueOnce(mockResponse);
		const response = await NativeModules.Geofencing.removeGeofence('1');
		expect(response).toEqual(mockResponse);
		expect(NativeModules.Geofencing.removeGeofence).toHaveBeenCalledWith('1');
	});

	it('should return registered geofences', async () => {
		const mockGeofences = ['1', '2'];
		NativeModules.Geofencing.getRegisteredGeofences.mockResolvedValueOnce(
			mockGeofences
		);
		const geofences = await NativeModules.Geofencing.getRegisteredGeofences();
		expect(geofences).toEqual(mockGeofences);
	});

	it('should remove all geofences', async () => {
		const mockResponse = { success: true, type: 'all' };
		NativeModules.Geofencing.removeAllGeofence.mockResolvedValueOnce(
			mockResponse
		);
		const response = await NativeModules.Geofencing.removeAllGeofence();
		expect(response).toEqual(mockResponse);
	});

	it('should handle geofence enter event', () => {
		const callback = jest.fn();
		NativeModules.Geofencing.Geofence.onEnter(callback);
		geofencingEventEmitter.emit('onEnter', ['1', '2']);
		expect(callback).toHaveBeenCalledWith(['1', '2']);
	});

	it('should handle geofence exit event', () => {
		const callback = jest.fn();
		NativeModules.Geofencing.Geofence.onExit(callback);
		geofencingEventEmitter.emit('onExit', ['3', '4']);
		expect(callback).toHaveBeenCalledWith(['3', '4']);
	});

	it('should remove geofence enter listener', () => {
		NativeModules.Geofencing.Geofence.removeOnEnterListener();
		expect(
			NativeModules.Geofencing.Geofence.removeOnEnterListener
		).toHaveBeenCalled();
	});

	it('should remove geofence exit listener', () => {
		NativeModules.Geofencing.Geofence.removeOnExitListener();
		expect(
			NativeModules.Geofencing.Geofence.removeOnExitListener
		).toHaveBeenCalled();
	});
});
