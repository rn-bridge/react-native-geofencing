package com.rnbridge.geofencing

import android.annotation.SuppressLint
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.location.Location
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableArray
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.Geofence.GEOFENCE_TRANSITION_ENTER
import com.google.android.gms.location.Geofence.GEOFENCE_TRANSITION_EXIT
import com.google.android.gms.location.GeofencingRequest
import com.google.android.gms.location.LocationServices
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken

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

  companion object {
    const val TAG = "GeofenceManager"
  }
}
