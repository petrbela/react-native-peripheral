#import "RCTConvert+CBMutableCharacteristic.m"
#import "RCTConvert+CBUUID.m"
#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTConvert.h>

@implementation RCTConvert (CBMutableService)

+ (CBMutableService *)CBMutableService:(id)json {
  CBMutableService *service =
      [[CBMutableService alloc] initWithType:[RCTConvert CBUUID:json[@"uuid"]]
                                     primary:[RCTConvert BOOL:json[@"primary"]]];

  if (json[@"characteristics"]) {
    NSMutableArray<CBMutableCharacteristic *> *characteristics = [[NSMutableArray alloc] init];
    for (id characteristic in json[@"characteristics"]) {
      [characteristics
          addObject:[RCTConvert CBMutableCharacteristic:characteristic]];
    }
    service.characteristics = characteristics;
  }

  if (json[@"services"]) {
    NSMutableArray<CBMutableService *> *services = [[NSMutableArray alloc] init];
    for (id service in json[@"services"]) {
      [services addObject:[RCTConvert CBMutableService:service]];
    }
    service.includedServices = services;
  }

  return service;
}

@end
