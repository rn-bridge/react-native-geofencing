#import <RNGeofencing.h>
#import <CoreLocation/CoreLocation.h>

#if __has_include("RNGeofencing-Bridging-Header.h")
#import "RNGeofencing-Bridging-Header.h"
#else
#import "react-native-geofencing/RNGeofencing-Bridging-Header.h"
#endif

#if __has_include("react_native_geofencing-Swift.h")
#import "react_native_geofencing-Swift.h"
#else
#import "react_native_geofencing/react_native_geofencing-Swift.h"
#endif

@implementation RNGeofencing

RCT_EXPORT_MODULE()

RNGeofencingImpl *rnGeofencingImpl = [[RNGeofencingImpl alloc] init];

+ (BOOL)requiresMainQueueSetup
{
    return YES;
}

- (instancetype)init {
    self = [super init];
    if (self) {
        [rnGeofencingImpl setEventEmitter: self];
    }
    return self;
}

- (NSArray<NSString *> *)supportedEvents {
    return [rnGeofencingImpl supportedEvents];
}

- (void)startObserving {
    return [rnGeofencingImpl startObserving];
}

- (void)stopObserving {
    return [rnGeofencingImpl stopObserving];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:(const facebook::react::ObjCTurboModule::InitParams &)params {
    return std::make_shared<facebook::react::NativeGeofencingSpecJSI>(params);
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (NSDictionary *)convertGeofenceParamsToDictionary:(JS::NativeGeofencing::SpecAddGeofenceParams &)params {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    
    dict[@"id"] = params.id_();
    dict[@"latitude"] = params.latitude() ? @(params.latitude()) : 0;
    dict[@"longitude"] = params.longitude() ? @(params.longitude()) : 0;
    dict[@"radius"] = params.radius() ? @(params.radius()) : 0;
    
    return [dict copy];
}
#endif

#ifdef RCT_NEW_ARCH_ENABLED
- (void)addGeofence:(JS::NativeGeofencing::SpecAddGeofenceParams &)params resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject {
    NSDictionary *mutableParams = [self convertGeofenceParamsToDictionary:params];
    return [rnGeofencingImpl addGeofence: mutableParams withResolve: resolve withReject: reject];
}
#else
RCT_EXPORT_METHOD(addGeofence:(NSDictionary *)params resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl addGeofence: params withResolve: resolve withReject: reject];
}
#endif

RCT_EXPORT_METHOD(getCurrentLocation:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl getCurrentLocation: resolve withReject: reject];
}

RCT_EXPORT_METHOD(isLocationServicesEnabled:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl isLocationServicesEnabled: resolve withReject: reject];
}

RCT_EXPORT_METHOD(getLocationAuthorizationStatus:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl getLocationAuthorizationStatus: resolve withReject: reject];
}

RCT_EXPORT_METHOD(getRegisteredGeofences:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl getRegisteredGeofences: resolve withReject: reject];
}

RCT_EXPORT_METHOD(removeAllGeofence:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl removeAllGeofence: resolve withReject: reject];
}

RCT_EXPORT_METHOD(removeGeofence:(nonnull NSString *)id resolve:(nonnull RCTPromiseResolveBlock)resolve reject:(nonnull RCTPromiseRejectBlock)reject) {
    return [rnGeofencingImpl removeGeofence: id withResolve: resolve withReject: reject];
}

#ifdef RCT_NEW_ARCH_ENABLED
- (void)requestLocation:(JS::NativeGeofencing::RequestLocationParamsType &)params response:(nonnull RCTResponseSenderBlock)response {
    NSMutableDictionary *dict = [NSMutableDictionary dictionary];
    dict[@"allowWhileUsing"] = @(params.allowWhileUsing() ? params.allowWhileUsing().value() : NO);
    dict[@"allowAlways"] = @(params.allowAlways() ? params.allowAlways().value() : NO);

    return [rnGeofencingImpl requestLocation: dict withSuccessCallback: response];
}

#else
RCT_EXPORT_METHOD(requestLocation:(NSDictionary *)params response:(nonnull RCTResponseSenderBlock)response) {
    return [rnGeofencingImpl requestLocation: params withSuccessCallback: response];
}

#endif

@end
