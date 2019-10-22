import Characteristic from './Characteristic'

export default class Service {
  /** Characteristics in the service */
  characteristics?: Characteristic[]

  primary?: boolean

  /** List of nested services. */
  services?: Service[]

  uuid: string

  constructor(params: {
    characteristics?: Characteristic[]
    primary?: boolean
    services?: Service[]
    uuid: string
  }) {
    this.characteristics = params.characteristics
    this.primary = params.primary
    this.services = params.services
    this.uuid = params.uuid
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
