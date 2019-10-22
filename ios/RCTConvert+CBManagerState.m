#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBManagerState)

+ (id)fromCBManagerState:(CBManagerState)state {
  switch (state) {
  case CBManagerStatePoweredOn:
    return @"poweredOn";
  case CBManagerStatePoweredOff:
    return @"poweredOff";
  case CBManagerStateResetting:
    return @"resetting";
  case CBManagerStateUnauthorized:
    return @"unauthorized";
  case CBManagerStateUnsupported:
    return @"unsupported";
  default:
    return nil;
  }
}

@end
