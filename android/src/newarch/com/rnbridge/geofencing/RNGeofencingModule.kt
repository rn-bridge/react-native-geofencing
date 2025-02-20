package com.rnbridge.geofencing

import android.location.Location
import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReadableMap

class RNGeofencingModule(reactContext: ReactApplicationContext) :
    NativeGeofencingSpec(reactContext) {

    private val geofenceManager = GeofenceManager(reactApplicationContext)

    override fun getName(): String {
        return NAME
    }

    override fun getCurrentLocation(promise: Promise) {
        geofenceManager.getCurrentLocation(promise)
    }

    override fun getRegisteredGeofences(promise: Promise) {
        geofenceManager.getRegisteredGeofences(promise)
    }

    override fun addGeofence(params: ReadableMap, promise: Promise) {
        val id = params.getString("id") as String
        val latitude = params.getDouble("latitude")
        val longitude = params.getDouble("longitude")
        val radius = params.getDouble("radius")

        val location = Location("").apply {
            this.latitude = latitude
            this.longitude = longitude
        }

        geofenceManager.addGeofence(id, location, radius.toFloat(), promise)
    }

    override fun removeGeofence(id: String, promise: Promise) {
        geofenceManager.removeGeofence(id, promise)
    }

    override fun removeAllGeofence(promise: Promise) {
        geofenceManager.removeAllGeofence(promise)
    }

    override fun requestLocation(params: ReadableMap, response: Callback) {}

    override fun getLocationAuthorizationStatus(promise: Promise) {}

    override fun addListener(eventType: String) {}

    override fun removeListeners(count: Double) {}
    
    companion object {
        const val NAME = "RNGeofencing"
    }
}
