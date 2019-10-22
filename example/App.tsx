import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import BlePeripheral, { Service, Characteristic } from 'react-native-peripheral'
import DynamicCharacteristic from './DynamicCharacteristic'

export default class App extends React.Component<{}> {
  componentDidMount() {
    BlePeripheral.start({
      name: 'BLE Test Device',
      services: [
        new Service({
          // these are just randomly generated UUIDs
          uuid: 'ebed0e09-033a-4bfe-8dcc-20a04fad944e',
          characteristics: [
            new Characteristic({
              uuid: 'c36e1c5a-fc6e-48c8-9a8e-d0b350399d0e',
            }),
            new DynamicCharacteristic({
              uuid: 'fbc47809-76ce-44fa-a2f0-676b95615472',
            }),
          ],
        }),
      ],
    })
  }

  render() {
    return null
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
})
