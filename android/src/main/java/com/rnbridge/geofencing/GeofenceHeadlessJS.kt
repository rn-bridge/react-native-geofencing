package com.rnbridge.geofencing

import android.content.Intent
import com.facebook.react.HeadlessJsTaskService
import com.facebook.react.bridge.Arguments
import com.facebook.react.jstasks.HeadlessJsTaskConfig

class GeofenceHeadlessJS : HeadlessJsTaskService() {
    override fun getTaskConfig(intent: Intent?): HeadlessJsTaskConfig? {
        return intent?.extras?.let {
            HeadlessJsTaskConfig(
                "onGeofenceTransition",
                Arguments.fromBundle(it),
                10000,
                true
            )
        }
    }
}
