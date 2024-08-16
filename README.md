# @rn-bridge/react-native-geofencing

> [!NOTE]
> Native module to determine if a location is within defined geographical boundaries. Geofencing combines awareness of the user's current location with awareness of the user's proximity to locations that may be of interest. To mark a location of interest, you specify its latitude and longitude. To adjust the proximity for the location, you add a radius. The latitude, longitude, and radius define a geofence, creating a circular area, or fence, around the location of interest.

Fully compatible with TypeScript.

## Supported platforms

| Platform  |  Support |
|---|---|
| iOS  |  ✅ |
| Android  |  ✅ |
| Web  |  ❌ |
| Windows  |  ❌ |
| macOS  |  ❌ |

## Installation

```sh
npm install @rn-bridge/react-native-geofencing
```
or

```sh
yarn add @rn-bridge/react-native-geofencing
```

## Configuration and Permissions

### iOS

To enable geofence in your app, you need to add the `NSLocationWhenInUseUsageDescription` and `NSLocationAlwaysAndWhenInUseUsageDescription` keys to your `Info.plist` file. If your app supports iOS 10 or earlier, you must also include the `NSLocationAlwaysUsageDescription` key. Without these keys, geofence requests will fail.

To enable geofence while the app runs in the background, add the `NSLocationAlwaysUsageDescription` key to `Info.plist`.

It’s important to ensure you’ve enabled the necessary background modes. Here’s how to do so:

- Go to your Xcode project settings.
- Select your target.
- Go to the `Signing & Capabilities` tab.
- Enable `Background Modes` capability.
- Check `Location updates`

<img width="743" alt="Screenshot 2024-08-15 at 7 27 40 PM" src="https://github.com/user-attachments/assets/87d0215e-e1c9-45b0-9488-4f0e9509a21b">

<br></br>
Your `Info.plist` should look like this, Explain why the background location is required!!

```java
<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>This app need your location to provide best feature based on location</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app need your location to provide best feature based on location</string>
<key>NSLocationAlwaysUsageDescription</key>
<string>This app need your location to provide best feature based on location in background</string>
<key>UIBackgroundModes</key>
<array>
  <string>location</string>
</array>
```

### Android

The first step in requesting geofence monitoring is to request the necessary permissions. To use geofencing, your app must request the following:

- `ACCESS_FINE_LOCATION`
- `ACCESS_BACKGROUND_LOCATION` if your app targets Android 10 (API level 29) or higher

Your `AndroidManifest.xml` should look liks this

```java
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
  <uses-permission android:name="android.permission.WAKE_LOCK" />

</manifest>
```

## Summary

### Methods

* [`addGeofence`](#addGeofence)
* [`removeGeofence`](#removeGeofence)
* [`getRegisteredGeofences`](#getRegisteredGeofences)

### Listeners

* [`onEnter`](#onEnter)
* [`onExit`](#onExit)
* [`removeOnEnterListener`](#removeOnEnterListener)
* [`removeOnExitListener`](#removeOnExitListener)

---

## Usage

### addGeofence
```js
import { addGeofence } from '@rn-bridge/react-native-geofencing';

const response = await addGeofence({
        id: 'a9957259-8036-4dcb-974c-34eae9b44bdb',
        latitude: 16.153062,
        longitude: 100.281585,
        radius: 500
    })
console.log(response) // { success: true, id, type: "add" }
```
Supported options:
* `id` (String) - Set the ID of the geofence. This is a string to identify this geofence.
* `latitude` (Double) - The latitude and longitude are used to define the precise geographical location of the geofence’s center. This ensures accurate detection when a device enters or exits the geofenced area.
* `longitude` (Double) - The latitude and longitude are used to define the precise geographical location of the geofence’s center. This ensures accurate detection when a device enters or exits the geofenced area.
* `radius` (Integer) - The radius defines the boundary of the geofence around the central point (latitude and longitude). It allows for flexibility in creating different-sized geofences

### removeGeofence
```javascript
import { removeGeofence } from '@rn-bridge/react-native-geofencing';

const response = await removeGeofence(id)
console.log(response) // { success: true, id, type: "remove" }
```
Supported options:
* `id` (String) - The ID uniquely identifies a geofence, enabling precise and efficient removal by referencing the specific geofence without ambiguity.

### getRegisteredGeofences
```javascript
import { getRegisteredGeofences } from '@rn-bridge/react-native-geofencing';

const response = await getRegisteredGeofences()
console.log(response) // [id, ...]
```

> [!IMPORTANT]
> ## Listening for location transitions

### onEnter
```javascript
import { Geofence, Events } from '@rn-bridge/react-native-geofencing';

Geofence.onEnter((ids: string[]) => {
  console.log(Events.Enter, ids);
});
```

### onExit
```javascript
import { Geofence, Events } from '@rn-bridge/react-native-geofencing';

Geofence.onExit((ids: string[]) => {
  console.log(Events.Exit, ids);
});
```

### removeOnEnterListener
```javascript
import { Geofence } from '@rn-bridge/react-native-geofencing';

Geofence.removeOnEnterListener()
```

### removeOnExitListener
```javascript
import { Geofence } from '@rn-bridge/react-native-geofencing';

Geofence.removeOnExitListener()
```

