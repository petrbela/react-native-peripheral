import React from 'react'
import Peripheral, { Characteristic, Service } from 'react-native-peripheral'

export default class App extends React.Component<{}> {
  state = {
    value: '',
  }

  componentDidMount() {
    Peripheral.onStateChanged(state => {
      if (state === 'poweredOn') {
        const serviceUuid = 'ebed0e09-033a-4bfe-8dcc-20a04fad944e'
        Peripheral.addService(
          new Service({
            // these are just randomly generated UUIDs
            uuid: serviceUuid,
            characteristics: [
              new Characteristic({
                uuid: 'c36e1c5a-fc6e-48c8-9a8e-d0b350399d0e',
                value: '...',
              }),
              new Characteristic({
                uuid: 'fbc47809-76ce-44fa-a2f0-676b95615472',
                onReadRequest: async () => this.state.value,
                onWriteRequest: async value => this.setState({ value }),
              }),
            ],
          })
        ).then(() => {
          Peripheral.startAdvertising({
            name: 'BLE Test Device',
            serviceUuids: [serviceUuid],
          })
        })
      }
    })
  }

  render() {
    return null
  }
}
