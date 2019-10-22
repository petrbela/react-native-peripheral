#import "RCTConvert+CBAttributePermissions.m"
#import "RCTConvert+CBCharacteristicProperties.m"
#import "RCTConvert+CBUUID.m"
#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBMutableCharacteristic)

+ (CBMutableCharacteristic *)CBMutableCharacteristic:(id)json {
  return [[CBMutableCharacteristic alloc]
      initWithType:[RCTConvert CBUUID:json[@"uuid"]]
        properties:[RCTConvert CBCharacteristicProperties:json[@"properties"]]
             value:[RCTConvert NSData:json[@"data"]]
       permissions:[RCTConvert CBAttributePermissions:json[@"permissions"]]];
}

@end
