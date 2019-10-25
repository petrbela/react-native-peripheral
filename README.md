# react-native-peripheral

> React Native library for building BLE peripherals.

## Installation

Using npm:

```sh
npm install --save react-native-peripheral
```

or using yarn:

```sh
yarn add react-native-peripheral
```

Then follow the instructions for your platform to link react-native-video into your project:

<details>
  <summary><b>iOS</b></summary>

#### React Native 0.60 and above

Linking is automatic. Just run `pod install` in the `ios` directory.

#### React Native 0.59 and below

Run `react-native link react-native-peripheral` to link the react-native-peripheral library.

If you're still managing dependencies through Xcode projects, or if the above didn't work:

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-peripheral` and add `RnBlePeripheral.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRnBlePeripheral.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)

</details>

<details>
  <summary><b>Android</b></summary>

Android support is not implemented yet.

<!-- #### React Native 0.60 and above

Linking is automatic in React Native >=0.60. Nothing to be done here.

#### React Native 0.59 and below

Run `react-native link react-native-peripheral` to link the react-native-video library.

If the above didn't work:

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactnative.bleperipheral.RnBlePeripheralPackage;` to the imports at the top of the file
  - Add `new RnBlePeripheralPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
    ```
    include ':react-native-peripheral'
    project(':react-native-peripheral').projectDir = new File(rootProject.projectDir,   '../node_modules/react-native-peripheral/android')
    ```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
    ```
      compile project(':react-native-peripheral')
    ``` -->

</details>

## Usage

```js
import Peripheral, { Service, Characteristic } from 'react-native-peripheral';

Peripheral.onStateChanged(state => {
  // wait until Bluetooth is ready
  if (state === 'poweredOn) {
    // first, define a characteristic with a value
    const ch = new Characteristic({
      uuid: '...',
      value: '...', // Base64-encoded string
      properties: ['read', 'write']
    })

    // add the characteristic to a service
    const service = new Service({
      uuid: '...',
      characteristics: [ch]
    })

    // register GATT services that your device provides
    Peripheral.addService(service).then(() => {
      // start advertising to make your device discoverable
      Peripheral.startAdvertising({
        name: 'My BLE device',
        serviceUuids: ['...']
      })
    })
  }
})

```

Note: `addService` and `startAdvertising` are conceptually independent events. A BLE peripheral can start advertising regardless of whether if has defined any services. Conversely, you can define services which can be used by previously defined clients. However, in most cases, you'll want to do both.

### Dynamic Value

If you want to change the characteristic value dynamically, instead of providing `value`, implement `onReadRequest` and `onWriteRequest` (if your characteristic supports `read` and `write` operations):

```js
new Characteristic({
  uuid: '...',
  onReadRequest: async (offset?: number) => {
    const value = '...' // calculate the value
    return value // you can also return a promise
  },
  onWriteRequest: async (value: string, offset?: number) => {
    // store or do something with the value
    this.value = value
  },
})
```

### Notifications

If the value in your characteristic changes frequently, BLE clients may want to subscribe to be notified about the changes. Subscription logic is handled for you automatically, you just need to do two things:

1. Include `notify` in the list of properties:

   ```js
   const ch = new Characteristic({
     // ...
     properties: ['notify', ...]
   })
   ```

2. Trigger `notify` with a value to send to subscribed clients:

   ```js
   const value = '...'
   ch.notify(value)
   ```

### Base64

This library expects the value to be a Base64-encoded string.

Depending on your use case, you may want to add a library to help you convert to Base64:

- If you work with binary data, we recommend you internally store an `ArrayBuffer` or `Uint8Array` and convert it using [base64-arraybuffer](https://www.npmjs.com/package/base64-arraybuffer) or [base64-js](https://www.npmjs.com/package/base64-js)
- If you want to send text data, we recommend you use [base64.js](https://www.npmjs.com/package/js-base64)
