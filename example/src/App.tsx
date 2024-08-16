import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {
  addGeofence,
  removeGeofence,
  getRegisteredGeofences,
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
  React.useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request('android.permission.ACCESS_FINE_LOCATION');
    }
  }, []);

  return (
    <View style={styles.container}>
      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Add Geo Fence"
        onPress={() => {
          addGeofence({
            id: 'a9957259-8036-4dcb-974c-34eae9b44bdb',
            latitude: 10.9314,
            longitude: 76.9781,
            radius: 500,
          })
            .then(console.log)
            .catch(console.log);
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Remove Geo Fence"
        onPress={() => {
          removeGeofence('a9957259-8036-4dcb-974c-34eae9b44bdb')
            .then(console.log)
            .catch(console.log);
        }}
      />

      <Button
        textStyle={styles.textStyle}
        style={styles.button}
        title="Get Registered Geo Fences"
        onPress={() => {
          getRegisteredGeofences().then(console.log).catch(console.log);
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
