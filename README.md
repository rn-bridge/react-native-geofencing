[![npm](https://img.shields.io/npm/v/@rn-bridge/react-native-geofencing.svg)](https://npmjs.com/@rn-bridge/react-native-geofencing) [![React Native](https://img.shields.io/badge/React_Native-21232a?style=flat&logo=react&logoColor=0a7ea4&logoSize=small.svg)]() [![Android](https://img.shields.io/badge/Android-green?style=flat&logo=android&logoColor=white)]() [![iOS](https://img.shields.io/badge/iOS-21232a?style=flat&logo=ios&logoColor=white)]()

# @rn-bridge/react-native-geofencing

React native module to determine if a location is within defined geographical boundaries. Geofencing combines awareness of the user's current location with awareness of the user's proximity to locations that may be of interest. To mark a location of interest, you specify its latitude and longitude. To adjust the proximity for the location, you add a radius. The latitude, longitude, and radius define a geofence, creating a circular area, or fence, around the location of interest.

Fully compatible with TypeScript & Turbomodules.

Required React Native Version >=0.72.0

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

<img width="743" alt="xcode" src="https://github.com/user-attachments/assets/70b0d892-f22b-4df8-95d9-954c54d28a7e">

<br></br>
Your `Info.plist` should look like this, Explain why the background location is required!!

```xml
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

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

  <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
  <uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
  <uses-permission android:name="android.permission.WAKE_LOCK" />

</manifest>
```

## Summary

### Methods

* [`requestLocation`](#requestLocation)
* [`getLocationAuthorizationStatus`](#getLocationAuthorizationStatus)
* [`getCurrentLocation`](#getCurrentLocation)
* [`addGeofence`](#addGeofence)
* [`removeGeofence`](#removeGeofence)
* [`getRegisteredGeofences`](#getRegisteredGeofences)

### Listeners

* [`onEnter`](#onEnter)
* [`onExit`](#onExit)
* [`removeOnEnterListener`](#removeOnEnterListener)
* [`removeOnExitListener`](#removeOnExitListener)
* [`isOnEnterListenerAdded`](#isOnEnterListenerAdded)
* [`isOnExitListenerAdded`](#isOnExitListenerAdded)

---

## Usage

### requestLocation
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.requestLocation({ allowWhileUsing: true });
```
Response:
```json
{
  "success": true,
  "location": "WhenInUse"
}
```

To request background location:
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.requestLocation({ allowAlways: true });
```
Response:
```json
{
  "success": true,
  "location": "Always"
}
```
Supported options:
* `allowWhileUsing` (Boolean) - App can use all location services and receive events while the app is in use.
* `allowAlways` (Boolean) - App can use all location services and receive events even if the user is not aware that your app is running. If your app isn’t running, the system launches your app and delivers the event.

> [!WARNING]
> Android needs background location for geofencing to work. You must request location `Allow all the time` from the user. While iOS works with both `while using` and `always`

### getLocationAuthorizationStatus
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.getLocationAuthorizationStatus();
```
Response: `WhileInUse` `Always` `Denied`

### getCurrentLocation
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.getCurrentLocation();
```
Reponse: 
```json
{
  "altitude": 0,
  "city": "Coimbatore",
  "country": "India",
  "isoCountryCode": "IN",
  "latitude": 10.9314,
  "longitude": 76.9781,
  "name": "Eachanari", 
  "postalCode": "641021",
  "state": "TN",
  "timeZone": "Asia/Kolkata"
}
```

### addGeofence
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.addGeofence({
        id: 'a9957259-8036-4dcb-974c-34eae9b44bdb',
        latitude: 16.153062,
        longitude: 100.281585,
        radius: 500
    })
```
Response:
```json
{
  "success": true,
  "id": "a9957259-8036-4dcb-974c-34eae9b44bdb"
}
```
Supported options:
* `id` (String) - Set the ID of the geofence. This is a string to identify this geofence.
* `latitude` (Double) - The latitude and longitude are used to define the precise geographical location of the geofence’s center. This ensures accurate detection when a device enters or exits the geofenced area.
* `longitude` (Double) - The latitude and longitude are used to define the precise geographical location of the geofence’s center. This ensures accurate detection when a device enters or exits the geofenced area.
* `radius` (Integer) - The radius defines the boundary of the geofence around the central point (latitude and longitude). It allows for flexibility in creating different-sized geofences

### removeGeofence
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.removeGeofence(id)
```
Response:
```json
{
  "success": true,
  "id": "a9957259-8036-4dcb-974c-34eae9b44bdb"
}
```
Supported options:
* `id` (String) - The ID uniquely identifies a geofence, enabling precise and efficient removal by referencing the specific geofence without ambiguity.

### getRegisteredGeofences
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

const response = await Geofencing.getRegisteredGeofences()
```
Response:
```json
["id1", "id2", "..."]
```

## Constants
```javascript
import { Events } from '@rn-bridge/react-native-geofencing';
```
| Constant  |  Value |
|---|---|
| Events.onEnter  |  "onEnter" |
| Events.onExit  |  "onExit" |

<br/>

```javascript
import { Authorization } from '@rn-bridge/react-native-geofencing';
```
| Constant  |  Value |
|---|---|
| Authorization.Always  |  "Always" |
| Authorization.WhenInUse  |  "WhenInUse" |
| Authorization.Restricted  |  "Restricted" |
| Authorization.Denied  |  "Denied" |
| Authorization.NotDetermined  |  "NotDetermined" |
| Authorization.Unknown  |  "Unknown" |

<br/>

> [!IMPORTANT]
> ## Listening for location transitions

### onEnter
```javascript
import Geofencing, { Events } from '@rn-bridge/react-native-geofencing';

Geofencing.onEnter((ids: string[]) => {
  console.log(Events.Enter, ids);
});
```
Response:
```json
["id1", "id2", "..."]
```

### onExit
```javascript
import Geofencing, { Events } from '@rn-bridge/react-native-geofencing';

Geofencing.onExit((ids: string[]) => {
  console.log(Events.Exit, ids);
});
```
Response:
```json
["id1", "id2", "..."]
```

### removeOnEnterListener
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

Geofencing.removeOnEnterListener()
```

### removeOnExitListener
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

Geofencing.removeOnExitListener()
```

### isOnEnterListenerAdded
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

Geofencing.isOnEnterListenerAdded() // true or false
```

### isOnExitListenerAdded
```javascript
import Geofencing from '@rn-bridge/react-native-geofencing';

Geofencing.isOnExitListenerAdded() // true or false
```

## How To Run Example App ?

To run example app, follow the below steps

1. Clone the repository
2. Do `yarn install`
3. For android`yarn example android`
4. For iOS `cd ios` and do `bundle exec pod install` and run the iOS app from XCode

## Demo Video

[Android](https://drive.google.com/file/d/1mEtklNayhUlHxdvW9XB6KYmAgh9zeXUc/preview) 
<br/>
[iOS](https://drive.google.com/file/d/1xT3MtUZT8u4nfxe_dM0vuCD-2rrUryH4/preview)

