#import <CoreBluetooth/CoreBluetooth.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

static NSString *const READ_REQUEST =
@"BlePeripheral:ReadRequest";
static NSString *const STATE_CHANGED =
@"BlePeripheral:StateChanged";
static NSString *const WRITE_REQUEST =
@"BlePeripheral:WriteRequest";

@interface RNBlePeripheral
    : RCTEventEmitter <RCTBridgeModule, CBPeripheralManagerDelegate>

@end
