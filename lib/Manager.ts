import {
  NativeEventEmitter,
  NativeModules,
  EventSubscription,
} from 'react-native'
import Service from './Service'
import Characteristic from './Characteristic'

const { RNBlePeripheral } = NativeModules
const EventEmitter = new NativeEventEmitter(RNBlePeripheral)

export default class Manager {
  private characteristics: { [uuid: string]: Characteristic } = {}
  private readRequestListener?: EventSubscription
  private writeRequestListener?: EventSubscription

  async addService(service: Service): Promise<void> {
    await RNBlePeripheral.addServices(service)

    this.characteristics = {
      ...this.characteristics,
      ...service.characteristicsByUuid(),
    }
  }

  async removeService(service: Service): Promise<void> {
    await RNBlePeripheral.removeService(service)

    Object.keys(service.characteristicsByUuid()).forEach(
      chUuid => delete this.characteristics[chUuid]
    )
  }

  async removeAllServices(): Promise<void> {
    await RNBlePeripheral.removeAllServices()

    this.characteristics = {}
  }

  async startAdvertising(data: {
    name: string
    serviceUuids: string[]
  }): Promise<void> {
    await RNBlePeripheral.startAdvertising(data)

    this.readRequestListener = EventEmitter.addListener(
      RNBlePeripheral.READ_REQUEST,
      ({ requestId, characteristicUuid, offset }) => {
        const ch = this.characteristics[characteristicUuid]

        if (!ch) return RNBlePeripheral.respond(requestId, 'invalidHandle')

        ch.onReadRequest(offset).then(value =>
          RNBlePeripheral.respond(requestId, 'success', value)
        )
      }
    )

    this.writeRequestListener = EventEmitter.addListener(
      RNBlePeripheral.WRITE_REQUEST,
      ({ requestId, characteristicUuid, offset, value }) => {
        const ch = this.characteristics[characteristicUuid]

        if (!ch) return RNBlePeripheral.respond(requestId, 'invalidHandle')

        ch.onWriteRequest(value, offset).then(() =>
          RNBlePeripheral.respond(requestId, 'success')
        )
      }
    )
  }

  stopAdvertising() {
    this.readRequestListener && this.readRequestListener.remove()
    this.writeRequestListener && this.writeRequestListener.remove()

    return RNBlePeripheral.stopAdvertising()
  }

  onStateChanged(listener: (state: ManagerState) => void) {
    RNBlePeripheral.getState(listener)
    return EventEmitter.addListener(RNBlePeripheral.STATE_CHANGED, listener)
  }
}

export type ManagerState =
  /** A state that indicates Bluetooth is currently powered off. */
  | 'poweredOff'
  /** A state that indicates Bluetooth is currently powered on and available to use. */
  | 'poweredOn'
  /** A state that indicates the connection with the system service was momentarily lost. */
  | 'resetting'
  /** A state that indicates the application isn’t authorized to use the Bluetooth low energy role. */
  | 'unauthorized'
  /** The manager’s state is unknown. */
  | 'unknown'
  /** A state that indicates this device doesn’t support the Bluetooth low energy central or client role. */
  | 'unsupported'
