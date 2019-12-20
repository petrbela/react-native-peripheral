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
  private subscribeListener?: EventSubscription
  private unsubscribeListener?: EventSubscription
  private writeRequestListener?: EventSubscription

  /**
   * Add service, along with its characteristics and nested services, to the peripheral.
   *
   * _[Android]_ If the local device has already exposed services when this function is called, a service update notification will be sent to all clients.
   *
   * _[iOS]_ After you add a service to the peripheral’s local database, Core Bluetooth caches the service and you can no longer make changes to it.
   */
  async addService(service: Service): Promise<void> {
    await RNBlePeripheral.addService(service)

    this.characteristics = {
      ...this.characteristics,
      ...service.characteristicsByUuid(),
    }
  }

  /**
   * Removes a specified published service from the local GATT database.
   */
  async removeService(service: Service): Promise<void> {
    await RNBlePeripheral.removeService(service)

    Object.keys(service.characteristicsByUuid()).forEach(
      chUuid => delete this.characteristics[chUuid]
    )
  }

  /**
   * Removes all published services from the local GATT database.
   *
   * Use this when you want to remove all services you’ve previously published, for example, if your app has a toggle button to expose GATT services.
   */
  async removeAllServices(): Promise<void> {
    await RNBlePeripheral.removeAllServices()

    this.characteristics = {}
  }

  /**
   * Advertise peripheral manager data. This will enable BLE central devices to discover this peripheral.
   *
   * _[iOS]_ Core Bluetooth advertises data on a “best effort” basis, due to limited space and because there may be multiple apps advertising simultaneously. While in the foreground, your app can use up to 28 bytes of space in the initial advertisement data for any combination of the supported advertising data keys. If no space remains, there’s an additional 10 bytes of space in the scan response, usable only for the `name`. Note that these sizes don’t include the 2 bytes of header information required for each new data type.
   * Any service UUIDs contained in the value of the `serviceUuids` key that don’t fit in the allotted space go to a special “overflow” area. These services are discoverable only by an iOS device explicitly scanning for them.
   * While your app is in the background, the local name isn’t advertised and all service UUIDs are in the overflow area.
   *
   * _[Android]_ An advertiser can broadcast up to 31 bytes of advertisement data.
   */
  async startAdvertising(data: {
    /** Local name of the device to be advertised. */
    name: string
    /** A list of service UUIDs. */
    serviceUuids: string[]
  }): Promise<void> {
    await RNBlePeripheral.startAdvertising(data)

    this.readRequestListener = EventEmitter.addListener(
      RNBlePeripheral.READ_REQUEST,
      (params: {
        requestId: string
        characteristicUuid: string
        offset?: number
      }) => {
        const ch = this.characteristics[params.characteristicUuid.toLowerCase()]

        if (!ch)
          return RNBlePeripheral.respond(
            params.requestId,
            'invalidHandle',
            null
          )

        ch.onReadRequest(params.offset).then(value =>
          RNBlePeripheral.respond(params.requestId, 'success', value)
        )
      }
    )

    this.writeRequestListener = EventEmitter.addListener(
      RNBlePeripheral.WRITE_REQUEST,
      (params: {
        requestId: string
        characteristicUuid: string
        value: string
        offset?: number
      }) => {
        const ch = this.characteristics[params.characteristicUuid.toLowerCase()]

        if (!ch)
          return RNBlePeripheral.respond(
            params.requestId,
            'invalidHandle',
            null
          )

        ch.onWriteRequest(params.value, params.offset).then(() =>
          RNBlePeripheral.respond(params.requestId, 'success', null)
        )
      }
    )

    this.subscribeListener = EventEmitter.addListener(
      RNBlePeripheral.SUBSCRIBE,
      (params: { characteristicUuid: string; centralUuid: string }) => {
        const ch = this.characteristics[params.characteristicUuid.toLowerCase()]
        if (ch) ch.onSubscribe()
      }
    )

    this.unsubscribeListener = EventEmitter.addListener(
      RNBlePeripheral.UNSUBSCRIBE,
      (params: { characteristicUuid: string; centralUuid: string }) => {
        const ch = this.characteristics[params.characteristicUuid.toLowerCase()]
        if (ch) ch.onUnsubscribe()
      }
    )
  }

  /**
   * Stops advertising peripheral manager data.
   *
   * Call this method when you no longer want to advertise peripheral manager data.
   */
  stopAdvertising(): Promise<void> {
    this.readRequestListener && this.readRequestListener.remove()
    this.subscribeListener && this.subscribeListener.remove()
    this.unsubscribeListener && this.unsubscribeListener.remove()
    this.writeRequestListener && this.writeRequestListener.remove()

    return RNBlePeripheral.stopAdvertising()
  }

  /**
   * A boolean value that indicates whether the peripheral is advertising data.
   *
   * The value is `true` if the peripheral is advertising data as a result of successfully calling the `startAdvertising` method, and `false` if the peripheral is no longer advertising its data.
   */
  isAdvertising(): Promise<boolean> {
    return RNBlePeripheral.isAdvertising()
  }

  /**
   * Implement this method to ensure that Bluetooth low energy is available to use on the local peripheral device.
   *
   * Issue commands to the peripheral manager only when it's in the `poweredOn` state.
   *
   * _[iOS]_ If the state moves below `poweredOff`, advertising has stopped and you must explicitly restart it. In addition, the `poweredOff` state clears the local database; in this case you must explicitly re-add all services.
   */
  onStateChanged(listener: (state: ManagerState) => void) {
    RNBlePeripheral.getState().then(listener)
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
