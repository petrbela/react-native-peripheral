import Characteristic from './Characteristic'

export default class Service {
  /** Characteristics in the service */
  characteristics?: Characteristic[]

  primary: boolean = true

  /** List of nested services. */
  services?: Service[]

  /** UUID of the characteristic. */
  uuid: string

  /**
   * Define a GATT service.
   */
  constructor(params: {
    /** Characteristics in the service */
    characteristics?: Characteristic[]
    /**
     * Whether the service is primary. Default to `true`.
     *
     * _Note:_ A primary service is a service that provides the primary functionality of a device. A secondary service is a service that provides auxiliary functionality of a device and is referenced from at least one primary service on the device. A secondary service is a service that is only intended to be referenced from a primary service or another secondary service or other higher layer specification. A secondary service is only relevant in the context of the entity that references it.
     */
    primary?: boolean
    /** List of nested services. */
    services?: Service[]
    /** __Required__ UUID of the characteristic. */
    uuid: string
  }) {
    if (!params.uuid) throw new Error('Service UUID is required!')

    Object.assign(this, {
      ...params,
      uuid: params.uuid.toLowerCase(),
    })
  }

  /** Recursively return this service's and nested services' characteristics, as a hash indexed by each characteristic's UUID. */
  characteristicsByUuid() {
    let chs: { [uuid: string]: Characteristic } = {}

    if (this.characteristics) {
      this.characteristics.forEach(ch => {
        chs[ch.uuid] = ch
      })
    }

    if (this.services) {
      this.services.forEach(service => {
        chs = { ...chs, ...service.characteristicsByUuid() }
      })
    }

    return chs
  }
}
