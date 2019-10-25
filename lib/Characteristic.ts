import { NativeModules } from 'react-native'

const { RNBlePeripheral } = NativeModules

export default class Characteristic {
  // descriptors?: Descriptor[];

  /** Permissions assigned to the characteristic. */
  permissions?: Permission[]

  /** Properties of the characteristic. */
  properties?: Property[]

  /** UUID of the characteristic. */
  uuid: string

  /** Base64-encoded value. */
  value?: string

  /**
   * Define a GATT characteristic.
   */
  constructor(params: {
    /**
     * Permissions assigned to the characteristic.
     *
     * A list of values `readable`, `writeable`, `readEncryptionRequired`, `writeEncryptionRequired`.
     */
    permissions?: Permission[]
    /**
     * Properties of the characteristic.
     *
     * A list of `broadcast`, `read`, `writeWithoutResponse`, `write`, `notify`, `indicate`, `authenticatedSignedWrites`, `extendedProperties`, `notifyEncryptionRequired`, `indicateEncryptionRequired`.
     */
    properties?: Property[]
    /** UUID of the characteristic. */
    uuid: string
    /** Base64-encoded value. You can set a static value here or provide `onReadRequest`/`onWriteRequest` to change it dynamically. */
    value?: string
    /** Implement to calculate value dynamically. */
    onReadRequest?: (offset?: number) => Promise<string>
    /** Implement to save value dynamically. */
    onWriteRequest?: (data: string, offset?: number) => Promise<void>
  }) {
    if (!params.uuid) throw new Error('Characteristic UUID is required!')

    Object.assign(this, {
      ...params,
      uuid: params.uuid.toLowerCase(),
    })
  }

  onReadRequest(offset?: number): Promise<string> {
    return Promise.resolve(this.value || '')
  }

  onWriteRequest(data: string, offset?: number): Promise<void> {
    this.value = data
    return Promise.resolve()
  }

  /** Notify subscribed clients with an updated value. */
  notify(value?: string): Promise<void> {
    return RNBlePeripheral.notify(this.uuid, value || this.value || '')
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
