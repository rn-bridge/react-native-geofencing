package com.rnbridge.geofencing

import android.Manifest
import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.location.Address
import android.location.Geocoder
import android.location.Location
import android.os.Build
import android.util.Log
import androidx.core.app.ActivityCompat
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.Geofence.GEOFENCE_TRANSITION_ENTER
import com.google.android.gms.location.Geofence.GEOFENCE_TRANSITION_EXIT
import com.google.android.gms.location.GeofencingRequest
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.android.gms.tasks.CancellationTokenSource
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import java.util.Locale
import java.util.TimeZone

private const val REQUEST_CODE = 1729

class GeofenceManager(private val context: Context) {

    private val client = LocationServices.getGeofencingClient(context)

    private val geofencingPendingIntent: PendingIntent by lazy {
        PendingIntent.getBroadcast(
            context,
            REQUEST_CODE,
            Intent(context, GeofenceBroadcastReceiver::class.java),
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) {
                PendingIntent.FLAG_UPDATE_CURRENT
            } else {
                PendingIntent.FLAG_MUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
            }
        )
    }

    @SuppressLint("MissingPermission")
    fun getCurrentLocation(promise: Promise) {
        if (!isForegroundLocationAuthorized()) {
            promise.reject(Error("Location permission not given"))
            return
        }
        val response = Arguments.createMap()
        val activity = (context as ReactApplicationContext).currentActivity ?: return
        val fusedLocationClient = LocationServices.getFusedLocationProviderClient(activity)
        fusedLocationClient.getCurrentLocation(
            Priority.PRIORITY_HIGH_ACCURACY,
            CancellationTokenSource().token
        ).addOnSuccessListener { location: Location? ->
            if (location == null) {
                promise.reject(Error("Location is undefined"))
                return@addOnSuccessListener
            }
            response.putDouble("latitude", location.latitude)
            response.putDouble("longitude", location.longitude)
            response.putDouble("altitude", location.altitude)

            val geocoder = Geocoder(context, Locale.getDefault())
            geocoder.getAddress(location.latitude, location.longitude) { address ->
                if (address == null) {
                    promise.resolve(response)
                    return@getAddress
                }

                response.putString("city", address.locality)
                response.putString("state", address.adminArea)
                response.putString("country", address.countryName)
                response.putString("isoCountryCode", address.countryCode)
                response.putString("name", address.featureName)
                response.putString("postalCode", address.postalCode)
                response.putString("timeZone", TimeZone.getDefault().id)

                promise.resolve(response)
            }
        }
    }

    fun getRegisteredGeofences(promise: Promise) {
        val ids = readFromSharedPreferences()
        promise.resolve(ids.toWritableArray())
    }

    @SuppressLint("MissingPermission")
    fun addGeofence(
        id: String,
        location: Location,
        radiusInMeters: Float,
        promise: Promise
    ) {
        if (!isBackgroundLocationAuthorized()) {
            promise.reject(Error("Background location permission not given"))
            return
        }
        val geofence = listOf(createGeofence(id, location, radiusInMeters))
        client.addGeofences(createGeofencingRequest(geofence), geofencingPendingIntent)
            .addOnSuccessListener {
                addToSharedPreferences(id)
                val map = Arguments.createMap().apply {
                    putBoolean("success", true)
                    putString("id", geofence[0].requestId)
                }
                promise.resolve(map)
            }.addOnFailureListener { exception ->
                Log.d(TAG, "registerGeofence: Failure\n$exception")
                val map = Arguments.createMap().apply {
                    putBoolean("success", false)
                    putString("id", geofence[0].requestId)
                    putString("error", exception.message)
                }
                promise.resolve(map)
            }
    }

    fun removeGeofence(id: String, promise: Promise) {
        client.removeGeofences(listOf(id))
            .addOnSuccessListener {
                removeFromSharedPreferences(id)
                val map = Arguments.createMap().apply {
                    putBoolean("success", true)
                    putString("id", id)
                }
                promise.resolve(map)
            }.addOnFailureListener { exception ->
                Log.d(TAG, "deregisterGeofence: Failure\n$exception")
                val map = Arguments.createMap().apply {
                    putBoolean("success", false)
                    putString("id", id)
                    putString("error", exception.message)
                }
                promise.resolve(map)
            }
    }

    fun removeAllGeofence(promise: Promise) {
        client.removeGeofences(geofencingPendingIntent)
            .addOnSuccessListener {
                resetSharedPreferences()
                val map = Arguments.createMap().apply {
                    putBoolean("success", true)
                }
                promise.resolve(map)
            }.addOnFailureListener { exception ->
                Log.d(TAG, "deregisterGeofence: Failure\n$exception")
                val map = Arguments.createMap().apply {
                    putBoolean("success", false)
                    putString("error", exception.message)
                }
                promise.resolve(map)
            }
    }

    private fun createGeofencingRequest(geofence: List<Geofence>): GeofencingRequest {
        return GeofencingRequest.Builder().apply {
            setInitialTrigger(GEOFENCE_TRANSITION_ENTER)
            addGeofences(geofence)
        }.build()
    }

    private fun createGeofence(
        id: String,
        location: Location,
        radiusInMeters: Float,
    ): Geofence {
        return Geofence.Builder()
            .setRequestId(id)
            .setCircularRegion(location.latitude, location.longitude, radiusInMeters)
            .setExpirationDuration(Geofence.NEVER_EXPIRE)
            .setTransitionTypes(GEOFENCE_TRANSITION_ENTER or GEOFENCE_TRANSITION_EXIT)
            .build()
    }

    private fun addToSharedPreferences(id: String) {
        removeFromSharedPreferences(id)
        val ids = readFromSharedPreferences()
        val newIds = ids.toMutableList()
        newIds.add(id)
        writeToSharedPreferences(newIds)
    }

    private fun removeFromSharedPreferences(id: String) {
        val ids = readFromSharedPreferences()
        writeToSharedPreferences(ids.toMutableList().filter { it != id })
    }

    private fun resetSharedPreferences() {
        val sharedPreferences = context.getSharedPreferences(TAG, Context.MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("ids", "[]")
            apply()
        }
    }

    private fun readFromSharedPreferences(): List<String> {
        val sharedPreferences = context.getSharedPreferences(TAG, Context.MODE_PRIVATE)
        val ids = sharedPreferences.getString("ids", "[]")

        val gson = Gson()

        return gson.fromJson(ids, object : TypeToken<List<String?>?>() {}.type)
    }

    private fun writeToSharedPreferences(ids: List<String>) {
        val sharedPreferences = context.getSharedPreferences(TAG, Context.MODE_PRIVATE)
        with(sharedPreferences.edit()) {
            putString("ids", Gson().toJson(ids))
            apply()
        }
    }

    private fun List<String>.toWritableArray(): WritableArray {
        return Arguments.fromArray(this.toTypedArray())
    }

    @Suppress("DEPRECATION")
    fun Geocoder.getAddress(
        latitude: Double,
        longitude: Double,
        address: (Address?) -> Unit
    ) {

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            getFromLocation(latitude, longitude, 1) { address(it.firstOrNull()) }
            return
        }

        try {
            address(getFromLocation(latitude, longitude, 1)?.firstOrNull())
        } catch (e: Exception) {
            address(null)
        }
    }

    private fun isForegroundLocationAuthorized(): Boolean {
        return ActivityCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED
    }

    private fun isBackgroundLocationAuthorized(): Boolean {
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            ActivityCompat.checkSelfPermission(
                context,
                Manifest.permission.ACCESS_BACKGROUND_LOCATION
            ) == PackageManager.PERMISSION_GRANTED
        } else {
            return true
        }
    }

    companion object {
        const val TAG = "GeofenceManager"
    }
}
