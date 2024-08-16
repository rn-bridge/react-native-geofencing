#import <React/RCTBridgeModule.h>
#import <CoreLocation/CoreLocation.h>
#import <React/RCTConvert.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(Geofencing, RCTEventEmitter)

RCT_EXTERN_METHOD(getLocationAuthorizationStatus:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(requestLocation:(NSDictionary *)params
                  withSuccessCallback:(RCTResponseSenderBlock)successCallback)

RCT_EXTERN_METHOD(getRegisteredGeofences:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(addGeofence:(NSDictionary *)params
                  withResolve:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeGeofence:(NSString *)id
                  withResolve:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(removeAllGeofence:(RCTPromiseResolveBlock)resolve
                  withReject:(RCTPromiseRejectBlock)reject)

@end

