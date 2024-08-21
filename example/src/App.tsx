import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import Geofencing from '@rn-bridge/react-native-geofencing';

const Button = ({
	title,
	style = {},
	textStyle = {},
	onPress
}: {
	title: string;
	style: any;
	textStyle: any;
	onPress: () => void;
}) => {
	return (
		<TouchableOpacity style={style} onPress={onPress}>
			<Text style={textStyle}>{title}</Text>
		</TouchableOpacity>
	);
};

export const App = () => {
	return (
		<View style={styles.container}>
			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Request Location While Using"
				onPress={async () => {
					const response = await Geofencing.requestLocation({ allowWhileUsing: true });
					console.log('requestLocation:', response);
					Alert.alert('', `Location: ${response.location}`);
				}}
			/>

			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Request Location Always"
				onPress={async () => {
					const response = await Geofencing.requestLocation({ allowAlways: true });
					console.log('requestLocation:', response);
					Alert.alert('', `Location: ${response.location}`);
				}}
			/>

			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Get Current Location"
				onPress={async () => {
					const response = await Geofencing.getCurrentLocation();
					console.log('getCurrentLocation:', response);
					Alert.alert(
						'',
						`Latitude: ${response.latitude}\nLongitude: ${response.longitude}\nName: ${response.name}\nCity: ${response.city}\nState: ${response.state}\nCountry: ${response.country}\nPostalCode: ${response.postalCode}`
					);
				}}
			/>

			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Add Geo Fence"
				onPress={async () => {
					const response = await Geofencing.addGeofence({
						id: 'a9957259-8036-4dcb-974c-34eae9b44bdb',
						latitude: 10.9314,
						longitude: 76.9781,
						radius: 500
					});

					console.log('addGeofence:', response);

					const message = response.success
						? 'Successfully added geofence!!'
						: 'Failed to add geofence!!';

					Alert.alert('', message);
				}}
			/>

			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Remove Geo Fence"
				onPress={async () => {
					const response = await Geofencing.removeGeofence(
						'a9957259-8036-4dcb-974c-34eae9b44bdb'
					);

					console.log('removeGeofence:', response);

					const message = response.success
						? 'Successfully removed geofence!!'
						: response.error;

					Alert.alert('', message);
				}}
			/>

			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Get Registered Geo Fences"
				onPress={async () => {
					const response = await Geofencing.getRegisteredGeofences();
					console.log('getRegisteredGeofences:', response);
					const ids = response.map((id: string, index: number) => `id${index+1}: ${id}`).join("\n")
					const message = response.length == 0 ? "No geofence registered" : ids
					Alert.alert('', message);
				}}
			/>

			<Button
				textStyle={styles.textStyle}
				style={styles.button}
				title="Get Authorization Status"
				onPress={async () => {
					const response = await Geofencing.getLocationAuthorizationStatus();
					console.log('getLocationAuthorizationStatus:', response);
					Alert.alert('', `Location: ${response}`);
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},
	button: {
		backgroundColor: 'black',
		width: 300,
		height: 50,
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginVertical: 10
	},
	textStyle: {
		color: 'white',
		fontSize: 18,
		fontWeight: '500'
	}
});
