import { StyleSheet, View, TouchableOpacity, Text, Alert } from 'react-native';
import {
  addGeofence,
  removeGeofence,
  getRegisteredGeofences,
  requestLocation,
  getLocationAuthorizationStatus,
  getCurrentLocation,
} from '@rn-bridge/react-native-geofencing';

const Button = ({
  title,
  style = {},
  textStyle = {},
  onPress,
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
          const response = await requestLocation({ allowWhileUsing: true });
          console.log('requestLocation:', response);
          Alert.alert('Status', `Location: ${response.location}`);
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Request Location Always"
        onPress={async () => {
          const response = await requestLocation({ allowAlways: true });
          console.log('requestLocation:', response);
          Alert.alert('Status', `Location: ${response.location}`);
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Get Current Location"
        onPress={async () => {
          const response = await getCurrentLocation();
          console.log('getCurrentLocation:', response);
          Alert.alert(
            'Status',
            `Latitude: ${response.latitude}\nLongitude: ${response.longitude}`
          );
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Add Geo Fence"
        onPress={async () => {
          const response = await addGeofence({
            id: 'a9957259-8036-4dcb-974c-34eae9b44bdb',
            latitude: 10.9314,
            longitude: 76.9781,
            radius: 500,
          });

          console.log('addGeofence:', response);

          const message = response.success
            ? 'Successfully added geofence!!'
            : 'Failed to add geofence!!';

          Alert.alert('Status', message);
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Remove Geo Fence"
        onPress={async () => {
          const response = await removeGeofence(
            'a9957259-8036-4dcb-974c-34eae9b44bdb'
          );

          console.log('removeGeofence:', response);

          const message = response.success
            ? 'Successfully removed geofence!!'
            : response.error;

          Alert.alert('Status', message);
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Get Registered Geo Fences"
        onPress={async () => {
          const response = await getRegisteredGeofences();
          console.log('getRegisteredGeofences:', response);
          Alert.alert('Status', JSON.stringify(response));
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Get Authorization Status"
        onPress={async () => {
          const response = await getLocationAuthorizationStatus();
          console.log('getLocationAuthorizationStatus:', response);
          Alert.alert('Status', `Location: ${response}`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'black',
    width: 300,
    height: 50,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  textStyle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
  },
});
