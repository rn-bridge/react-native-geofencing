import CoreLocation
import React

@objc(Geofencing)
class Geofencing: RCTEventEmitter, CLLocationManagerDelegate {
    
    private var locationManager: CLLocationManager
    private var hasListeners = false
    
    override init() {
        locationManager = CLLocationManager()
        super.init()
        locationManager.delegate = self
    }
    
    override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    
    @objc(getRegisteredGeofences:withReject:)
    func getRegisteredGeofences(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if !isLocationAlwaysEnabled() {
            reject("Permission", "Needed Authorization always but got \(getLocationNeededErrorString())", NSError(domain: "getRegisteredGeofences", code: 200))
            return
        }
        
        let regions = locationManager.monitoredRegions
        let geofences: [String] = regions.map { region in region.identifier }
        resolve(geofences)
    }
    
    
    @objc(addGeofence:withResolve:withReject:)
    func addGeofence(params: NSDictionary, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if !isLocationAlwaysEnabled() {
            locationManager.requestWhenInUseAuthorization()
            reject("Permission", "Needed Authorization always but got \(getLocationNeededErrorString())", NSError(domain: "addGeofence", code: 200))
            return
        }
        
        if !locationManager.allowsBackgroundLocationUpdates {
            locationManager.allowsBackgroundLocationUpdates = true
            reject("Permission", "Background location not enabled", NSError(domain: "addGeofence", code: 200))
            return
        }
        
        guard let id = params["id"] as? String,
              let latitude = params["latitude"] as? Double,
              let longitude = params["longitude"] as? Double,
              let radius = params["radius"] as? Double else {
            reject("Invalid", "Invalid input", NSError(domain: "addGeofence", code: 200))
            return
        }
        
        let center = CLLocationCoordinate2D(latitude: latitude, longitude: longitude)
        let region = CLCircularRegion(center: center, radius: radius, identifier: id)
        locationManager.startMonitoring(for: region)
        resolve(["success": true, "id": id, "type": "add"])
    }
    
    @objc(removeGeofence:withResolve:withReject:)
    func removeGeofence(id: String, resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        if removeGeofence(id) {
            resolve(["success": true, "id": id, "type": "remove"])
        } else {
            reject("Invalid", "Geofence is not registered with the provided id", NSError(domain: "removeGeofence", code: 200))
        }
    }
    
    @objc(removeAllGeofence:withReject:)
    func removeAllGeofence(resolve: @escaping RCTPromiseResolveBlock, reject: @escaping RCTPromiseRejectBlock) {
        do {
            try removeAll()
            resolve(["success": true, "type": "removeAll"])
        } catch let error {
            reject("Error", "Failed to remove", error as NSError)
        }
    }
    
    private func removeAll() throws {
        for region in locationManager.monitoredRegions {
            locationManager.stopMonitoring(for: region)
        }
    }
    
    private func removeGeofence(_ id: String) -> Bool {
        for region in locationManager.monitoredRegions {
            if region.identifier == id {
                locationManager.stopMonitoring(for: region)
                return true
            }
        }
        return false
    }
    
    override func supportedEvents() -> [String]! {
        return ["onEnter", "onExit"]
    }
    
    override func startObserving() {
        hasListeners = true
    }
    
    override func stopObserving() {
        hasListeners = false
    }
    
    func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) {
        if hasListeners {
            sendEvent(withName: "onEnter", body: [region.identifier])
        } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                // wait for the react native to add listener
                self.sendEvent(withName: "onEnter", body: [region.identifier])
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) {
        if hasListeners {
            sendEvent(withName: "onExit", body: [region.identifier])
        } else {
            DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                // wait for the react native to add listener
                self.sendEvent(withName: "onExit", body: [region.identifier])
            }
        }
    }
    
    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status == .authorizedAlways {
            locationManager.allowsBackgroundLocationUpdates = true
        } else if status == .authorizedWhenInUse {
            locationManager.requestAlwaysAuthorization()
        }
    }
    
    private func isLocationAlwaysEnabled() -> Bool {
        return CLLocationManager.authorizationStatus() == .authorizedAlways
    }
    
    private func getLocationNeededErrorString() -> String {
        let authorizationStatus = CLLocationManager.authorizationStatus()
        var message: String
        
        switch authorizationStatus {
        case .notDetermined:
            message = "Not determined"
        case .restricted:
            message = "Restricted"
        case .denied:
            message = "Denied"
        case .authorizedWhenInUse:
            message = "Authorized when in use"
        default:
            message = "Unknown"
        }
        
        return message
    }
    
}

