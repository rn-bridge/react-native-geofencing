package com.rnbridge.geofencing

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.util.Log
import com.facebook.react.HeadlessJsTaskService
import com.google.android.gms.location.Geofence
import com.google.android.gms.location.GeofenceStatusCodes
import com.google.android.gms.location.GeofencingEvent

class GeofenceBroadcastReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent == null || context == null) {
            return
        }

        val geofencingEvent = GeofencingEvent.fromIntent(intent)
        if (geofencingEvent != null && geofencingEvent.hasError()) {
            val errorMessage = GeofenceStatusCodes
                .getStatusCodeString(geofencingEvent.errorCode)
            Log.e(TAG, errorMessage)
            return
        }

        val geofenceTransition = geofencingEvent?.geofenceTransition

        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER || geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {

            val triggeringGeofences = geofencingEvent.triggeringGeofences

            val event =
                if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER) "onEnter" else "onExit"
            val ids = triggeringGeofences?.map { it.requestId }?.toTypedArray().orEmpty()
            val headlessJSIntent = Intent(context, GeofenceHeadlessJS::class.java)
            headlessJSIntent.putExtra("event", event)
            headlessJSIntent.putExtra("ids", ids)
            context.startService(headlessJSIntent)
            HeadlessJsTaskService.acquireWakeLockNow(context)
        } else {
            Log.e(TAG, "Error in GeofenceBroadcastReceiver")
        }
    }

    companion object {
        const val TAG = "GeofenceBroadcast"
    }
}
