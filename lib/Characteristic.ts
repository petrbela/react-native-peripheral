import { NativeModules } from 'react-native'

const { RNBlePeripheral } = NativeModules

export default class Characteristic {
  // descriptors?: Descriptor[];

  permissions?: Permission[]

  properties?: Property[]

  uuid: string

  value?: ArrayBuffer

  constructor(params: {
    permissions?: Permission[]
    properties?: Property[]
    uuid: string
    value?: ArrayBuffer
  }) {
    this.permissions = params.permissions
    this.properties = params.properties
    this.uuid = params.uuid
    this.value = params.value
  }

  onReadRequest(offset?: number): Promise<ArrayBuffer> {
    return Promise.resolve(this.value)
  }

  onWriteRequest(data: ArrayBuffer, offset?: number): Promise<void> {
    this.value = data
    return Promise.resolve()
  }

  notify(): Promise<void> {
    return RNBlePeripheral.notify(this.value)
  }
}

export type Permission =
  /** A permission that indicates a peripheral can read the attribute’s value. */
  | 'readable'
  /** A permission that indicates a peripheral can write the attribute’s value. */
  | 'writeable'
  /** A permission that indicates only trusted devices can read the attribute’s value. */
  | 'readEncryptionRequired'
  /** A permission that indicates only trusted devices can write the attribute’s value. */
  | 'writeEncryptionRequired'

export type Property =
  /** A property that indicates the characteristic can broadcast its value using a characteristic configuration descriptor. */
  | 'broadcast'
  /** A property that indicates a peripheral can read the characteristic’s value. */
  | 'read'
  /** A property that indicates a peripheral can write the characteristic’s value, without a response to indicate that the write succeeded. */
  | 'writeWithoutResponse'
  /** A property that indicates a peripheral can write the characteristic’s value, with a response to indicate that the write succeeded. */
  | 'write'
  /** A property that indicates the peripheral permits notifications of the characteristic’s value, without a response from the central to indicate receipt of the notification. */
  | 'notify'
  /** A property that indicates the peripheral permits notifications of the characteristic’s value, with a response from the central to indicate receipt of the notification. */
  | 'indicate'
  /** A property that indicates the perhipheral allows signed writes of the characteristic’s value, without a response to indicate the write succeeded. */
  | 'authenticatedSignedWrites'
  /** A property that indicates the characteristic defines additional properties in the extended properties descriptor. */
  | 'extendedProperties'
  /** A property that indicates that only trusted devices can enable notifications of the characteristic’s value. */
  | 'notifyEncryptionRequired'
  /** A property that indicates only trusted devices can enable indications of the characteristic’s value. */
  | 'indicateEncryptionRequired'
