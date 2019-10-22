# react-native-peripheral

## Getting started

`$ npm install react-native-peripheral --save`

### Mostly automatic installation

`$ react-native link react-native-peripheral`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-peripheral` and add `RnBlePeripheral.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRnBlePeripheral.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.reactnative.bleperipheral.RnBlePeripheralPackage;` to the imports at the top of the file
  - Add `new RnBlePeripheralPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-peripheral'
  	project(':react-native-peripheral').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-peripheral/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-peripheral')
  	```


## Usage
```javascript
import RnBlePeripheral from 'react-native-peripheral';

// TODO: What to do with the module?
RnBlePeripheral;
```
