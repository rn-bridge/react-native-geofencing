import { NativeModules } from 'react-native';
import Geofencing, { Events } from "../"

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
			}
		},
		NativeEventEmitter: jest.fn().mockImplementation(() => {
			return {
				addListener: jest.fn(),
				removeAllListeners: jest.fn(),
				emit: jest.fn(),
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
			OS: 'android'
		},
		AppRegistry: {
			registerHeadlessTask: jest.fn()
		}
	};
});

describe('Geofencing Module', () => {

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
		const location = await Geofencing.getCurrentLocation();
		expect(location).toEqual(mockLocation);
	});

	it('should add a geofence', async () => {
		const mockResponse = { success: true, id: '1', error: '' };
		NativeModules.Geofencing.addGeofence.mockResolvedValueOnce(mockResponse);
		const response = await Geofencing.addGeofence({
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
		const response = await Geofencing.removeGeofence('1');
		expect(response).toEqual(mockResponse);
		expect(NativeModules.Geofencing.removeGeofence).toHaveBeenCalledWith('1');
	});

	it('should return registered geofences', async () => {
		const mockGeofences = ['1', '2'];
		NativeModules.Geofencing.getRegisteredGeofences.mockResolvedValueOnce(
			mockGeofences
		);
		const geofences = await Geofencing.getRegisteredGeofences();
		expect(geofences).toEqual(mockGeofences);
	});

	it('should remove all geofences', async () => {
		const mockResponse = { success: true, type: 'all' };
		NativeModules.Geofencing.removeAllGeofence.mockResolvedValueOnce(
			mockResponse
		);
		const response = await Geofencing.removeAllGeofence();
		expect(response).toEqual(mockResponse);
	});

	it('should handle geofence enter event', () => {
		const callback = jest.fn();
		Geofencing.onEnter(callback);
		expect(Geofencing.geofencingEventEmitter.addListener).toHaveBeenCalledWith(Events.Enter, callback);
	});

	it('should handle geofence exit event', () => {
		const callback = jest.fn();
		Geofencing.onExit(callback);
		expect(Geofencing.geofencingEventEmitter.addListener).toHaveBeenCalledWith(Events.Exit, callback);
	});

	it('should remove geofence enter listener', () => {
		Geofencing.removeOnEnterListener();
		expect(Geofencing.geofencingEventEmitter.removeAllListeners).toHaveBeenCalledWith(Events.Enter);
	});

	it('should remove geofence exit listener', () => {
		Geofencing.removeOnExitListener();
		expect(Geofencing.geofencingEventEmitter.removeAllListeners).toHaveBeenCalledWith(Events.Exit);
	});
});
