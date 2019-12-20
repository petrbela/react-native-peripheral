#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBCharacteristicProperties)

RCT_MULTI_ENUM_CONVERTER(
    CBCharacteristicProperties, (@{
      @"broadcast" : @(CBCharacteristicPropertyBroadcast),
      @"read" : @(CBCharacteristicPropertyRead),
      @"writeWithoutResponse" : @(CBCharacteristicPropertyWriteWithoutResponse),
      @"write" : @(CBCharacteristicPropertyWrite),
      @"notify" : @(CBCharacteristicPropertyNotify),
      @"indicate" : @(CBCharacteristicPropertyIndicate),
      @"authenticatedSignedWrites" :
          @(CBCharacteristicPropertyAuthenticatedSignedWrites),
      @"extendedProperties" :
          @(CBCharacteristicPropertyExtendedProperties),
      @"notifyEncryptionRequired" :
          @(CBCharacteristicPropertyNotifyEncryptionRequired),
      @"indicateEncryptionRequired" :
          @(CBCharacteristicPropertyIndicateEncryptionRequired),
    }),
    0, integerValue)

@end
