#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBATTError)

RCT_ENUM_CONVERTER(
    CBATTError, (@{
      @"invalidHandle" : @(CBATTErrorInvalidHandle),
      @"readNotPermitted" : @(CBATTErrorReadNotPermitted),
      @"writeNotPermitted" : @(CBATTErrorWriteNotPermitted),
      @"invalidPdu" : @(CBATTErrorInvalidPdu),
      @"insufficientAuthentication" : @(CBATTErrorInsufficientAuthentication),
      @"requestNotSupported" : @(CBATTErrorRequestNotSupported),
      @"invalidOffset" : @(CBATTErrorInvalidOffset),
      @"insufficientAuthorization" : @(CBATTErrorInsufficientAuthorization),
      @"prepareQueueFull" : @(CBATTErrorPrepareQueueFull),
      @"attributeNotFound" : @(CBATTErrorAttributeNotFound),
      @"attributeNotLong" : @(CBATTErrorAttributeNotLong),
      @"insufficientEncryptionKeySize" :
          @(CBATTErrorInsufficientEncryptionKeySize),
      @"invalidAttributeValueLength" : @(CBATTErrorInvalidAttributeValueLength),
      @"unlikelyError" : @(CBATTErrorUnlikelyError),
      @"insufficientEncryption" : @(CBATTErrorInsufficientEncryption),
      @"unsupportedGroupType" : @(CBATTErrorUnsupportedGroupType),
      @"insufficientResources" : @(CBATTErrorInsufficientResources),
    }),
    CBATTErrorSuccess, integerValue)

@end
