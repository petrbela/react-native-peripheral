#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBUUID)

+ (CBUUID *)CBUUID:(id)json {
  return [CBUUID UUIDWithString:json];
}

@end
