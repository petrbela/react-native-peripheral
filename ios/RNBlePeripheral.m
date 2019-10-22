#import "RCTConvert+CBMutableService.m"
#import "RCTConvert+CBManagerState.m"
#import "RNBlePeripheral.h"
#import <PromisesObjC/FBLPromise+All.h>
#import <PromisesObjC/FBLPromise+Catch.h>
#import <PromisesObjC/FBLPromise+Then.h>

@implementation RNBlePeripheral {
  CBPeripheralManager *manager;
  FBLPromise *startAdvertisingPromise;
  NSMutableDictionary<CBUUID *, FBLPromise *> *addingServicePromises;
  NSMutableDictionary<NSString *, CBATTRequest *> *pendingRequests;
  NSMutableDictionary<CBUUID *, CBMutableService *> *services;
  NSMutableDictionary<CBUUID *, CBMutableCharacteristic *> *characteristics;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (instancetype)init {
  if (self = [super init]) {
    manager = [[CBPeripheralManager alloc] initWithDelegate:self queue:nil];
    pendingRequests = [[NSMutableDictionary alloc] init];
    services = [[NSMutableDictionary alloc] init];
    characteristics = [[NSMutableDictionary alloc] init];
    addingServicePromises = [[NSMutableDictionary alloc] init];
  }
  return self;
}

- (NSDictionary *)constantsToExport {
  return @{
    @"READ_REQUEST" : READ_REQUEST,
    @"STATE_CHANGED" : STATE_CHANGED,
    @"WRITE_REQUEST" : WRITE_REQUEST
  };
}

- (NSArray<NSString *> *)supportedEvents {
  return @[ READ_REQUEST, STATE_CHANGED, WRITE_REQUEST ];
}

RCT_REMAP_METHOD(getState,
                 getStateWithResolver: (RCTPromiseResolveBlock) resolve
                 rejecter: (RCTPromiseRejectBlock) reject) {
  resolve([RCTConvert fromCBManagerState:[manager state]]);
}

RCT_EXPORT_METHOD(addService: (CBMutableService *)service
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
  NSMutableArray<FBLPromise *> *promises = [[NSMutableArray alloc] init];

  for (CBMutableService *includedService in service.includedServices) {
    FBLPromise<NSString *> *promise = [FBLPromise pendingPromise];

    [self addService:includedService resolver:^(id result) {
      [promise fulfill:result];
    } rejecter:^(NSString *code, NSString *message, NSError *error) {
      [promise reject:error];
    }];
    
    [promises addObject:promise];
  }

  // wait until all included services have been added
  [[[[FBLPromise all:promises] then:^id _Nullable(id  _Nullable value) {
    // then add the current service, registering a promise for when it's added
    FBLPromise *promise = [FBLPromise pendingPromise];
    [self->addingServicePromises setObject:promise forKey:service.UUID];
    [self->manager addService:service];
    return promise;
  }] then:^id _Nullable(id  _Nullable value) {
    [self->services setObject:service forKey:service.UUID];
    for (CBMutableCharacteristic *ch in service.characteristics) {
      [self->characteristics setObject:ch forKey:ch.UUID];
    }
    resolve(value);
    return nil;
  }] catch:^(NSError * _Nonnull error) {
    reject(@"AddingServiceFailed", @"Adding service failed", error);
  }];
}

RCT_EXPORT_METHOD(removeService: (CBMutableService *) serviceToRemove
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject) {
  CBMutableService *service = services[serviceToRemove.UUID];
  
  if (service == nil) return
    
  [manager removeService:service];
  [services removeObjectForKey:service.UUID];
  for (CBMutableCharacteristic *ch in service.characteristics) {
    [characteristics removeObjectForKey:ch.UUID];
  }
  
  resolve(nil);
}

RCT_REMAP_METHOD(removeAllServices,
                 removeAllServicesWithResolver: (RCTPromiseResolveBlock) resolve
                 rejecter: (RCTPromiseRejectBlock) reject) {
  [manager removeAllServices];
  [services removeAllObjects];
  [characteristics removeAllObjects];
  
  resolve(nil);
}

RCT_EXPORT_METHOD(startAdvertising: (id)data
                  resolver: (RCTPromiseResolveBlock) resolve
                  rejecter: (RCTPromiseRejectBlock) reject) {
  NSMutableArray<CBUUID *> *serviceUUIDs = [[NSMutableArray alloc] init];
  for (id serviceUuid in data[@"serviceUuids"]) {
    [serviceUUIDs addObject:[RCTConvert CBUUID:serviceUuid]];
  }

  startAdvertisingPromise = [FBLPromise pendingPromise];
  [[startAdvertisingPromise then:^id _Nullable(id  _Nullable value) {
    resolve(nil);
    return nil;
  }] catch:^(NSError * _Nonnull error) {
    reject(@"AdvertisingFailed", @"Advertising failed", error);
  }];
  
  [self->manager startAdvertising:@{
    CBAdvertisementDataLocalNameKey: [RCTConvert NSString:data[@"name"]],
    CBAdvertisementDataServiceUUIDsKey: serviceUUIDs
  }];
}

RCT_REMAP_METHOD(stopAdvertising,
                 stopAdvertisingWithResolver: (RCTPromiseResolveBlock) resolve
                 rejecter: (RCTPromiseRejectBlock) reject) {
  [manager stopAdvertising];
  
  [manager removeAllServices];
  
  resolve(nil);
}

RCT_EXPORT_METHOD(respond: (NSString *)requestId
                  status: (CBATTError)status
                  value: (nullable NSData *)value
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
  CBATTRequest *request = [pendingRequests objectForKey:requestId];
  
  if (request == nil) return reject(@"invalid_request", @"Request with the given id does not exist.", nil);
    
  if (value != nil) request.value = value;
  
  [manager respondToRequest:request withResult:status];
  
  [pendingRequests removeObjectForKey:requestId];
  
  resolve(nil);
}

RCT_EXPORT_METHOD(notify: (CBUUID *)characteristicUuid
                  value: (NSData *)value
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject) {
  CBMutableCharacteristic *characteristic = characteristics[characteristicUuid];
  
  if (characteristic == nil) return reject(@"NoCharacteristic", @"Characteristic does not exist", nil);
  
  BOOL sent = [manager updateValue:value forCharacteristic:characteristic onSubscribedCentrals:nil];
  
  if (sent) {
    resolve(nil);
  } else {
    // TODO handle automatically in peripheralManagerIsReadyToUpdateSubscribers
    reject(@"QueueIsFull", @"The underlying transmit queue is full.", nil);
  }
}

- (void)peripheralManagerDidUpdateState:
    (nonnull CBPeripheralManager *)peripheral {
  [self sendEventWithName:STATE_CHANGED body:@{
    @"state": [RCTConvert fromCBManagerState:peripheral.state]
  }];
}

-(void)peripheralManager:(CBPeripheralManager *)peripheral didAddService:(CBService *)service error:(NSError *)error {
  FBLPromise *promise = addingServicePromises[service.UUID];
  
  if (promise == nil) return;
    
  if (error == nil) {
    [promise fulfill:nil];
  } else {
    [promise reject:error];
  }
  
  [addingServicePromises removeObjectForKey:service.UUID];
}

- (void)peripheralManagerDidStartAdvertising:(CBPeripheralManager *)peripheral error:(NSError *)error {
  if (startAdvertisingPromise == nil) return;
  
  if (error == nil) {
    [startAdvertisingPromise fulfill:nil];
  } else {
    [startAdvertisingPromise reject:error];
  }
  
  startAdvertisingPromise = nil;
}

-(void)peripheralManager:(CBPeripheralManager *)peripheral didReceiveReadRequest:(CBATTRequest *)request {
  NSString *requestId = [[NSUUID UUID] UUIDString];
  
  [pendingRequests setValue:request forKey:requestId];

  [self sendEventWithName:READ_REQUEST body:@{
    @"requestId": requestId,
    @"offset": @(request.offset),
    @"characteristicUuid": request.characteristic.UUID,
    @"serviceUuid": request.characteristic.service.UUID,
  }];
}

-(void)peripheralManager:(CBPeripheralManager *)peripheral didReceiveWriteRequests:(NSArray<CBATTRequest *> *)requests {
  for (CBATTRequest *request in requests) {
    NSString *requestId = [[NSUUID UUID] UUIDString];
    
    [pendingRequests setValue:request forKey:requestId];

    [self sendEventWithName:WRITE_REQUEST body:@{
      @"requestId": requestId,
      @"offset": @(request.offset),
      @"value": request.value,
      @"characteristicUuid": request.characteristic.UUID,
      @"serviceUuid": request.characteristic.service.UUID,
    }];
  }
}

- (void)peripheralManagerIsReadyToUpdateSubscribers:(CBPeripheralManager *)peripheral {
  // TODO see notify
}

@end
