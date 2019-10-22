#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBCharacteristicProperties)

RCT_MULTI_ENUM_CONVERTER(
    CBCharacteristicProperties, (@{
      @"read" : @(CBCharacteristicPropertyRead),
      @"write" : @(CBCharacteristicPropertyWrite),
      @"notify" : @(CBCharacteristicPropertyNotify),
      @"indicate" : @(CBCharacteristicPropertyIndicate),
      @"indicateEncryptionRequired" :
          @(CBCharacteristicPropertyIndicateEncryptionRequired),
      @"authenticatedSignedWrites" :
          @(CBCharacteristicPropertyAuthenticatedSignedWrites),
    }),
    0, integerValue)

@end
