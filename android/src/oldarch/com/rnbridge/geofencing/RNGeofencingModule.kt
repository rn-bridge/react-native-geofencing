package com.rnbridge.geofencing

import android.location.Location
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap

class RNGeofencingModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private val geofenceManager = GeofenceManager(reactApplicationContext)

    override fun getName(): String {
        return NAME
    }

    @ReactMethod
    fun getCurrentLocation(promise: Promise) {
        geofenceManager.getCurrentLocation(promise)
    }

    @ReactMethod
    fun isLocationServicesEnabled(promise: Promise) {
        geofenceManager.isLocationServicesEnabled(promise)
    }

    @ReactMethod
    fun getRegisteredGeofences(promise: Promise) {
        geofenceManager.getRegisteredGeofences(promise)
    }

    @ReactMethod
    fun addGeofence(params: ReadableMap, promise: Promise) {
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

    @ReactMethod
    fun removeGeofence(id: String, promise: Promise) {
        geofenceManager.removeGeofence(id, promise)
    }

    @ReactMethod
    fun removeAllGeofence(promise: Promise) {
        geofenceManager.removeAllGeofence(promise)
    }

    companion object {
        const val NAME = "RNGeofencing"
    }
}
