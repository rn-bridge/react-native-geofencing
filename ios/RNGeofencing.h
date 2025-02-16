#import <React/RCTEventEmitter.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <geofencing/geofencing.h>
#else
#import <React/RCTBridgeModule.h>
#endif

NS_ASSUME_NONNULL_BEGIN

#ifdef RCT_NEW_ARCH_ENABLED
@interface RNGeofencing : RCTEventEmitter <NativeGeofencingSpec>
#else
@interface RNGeofencing : RCTEventEmitter <RCTBridgeModule>
#endif
@end

NS_ASSUME_NONNULL_END
