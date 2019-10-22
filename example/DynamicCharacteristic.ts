import { Characteristic } from 'react-native-peripheral'

export default class DynamicCharacteristic extends Characteristic {
  onReadRequest(offset?: number) {
    return Promise.resolve(new ArrayBuffer())
  }
}
