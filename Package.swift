// swift-tools-version: 6.0
// AUTO-SCAFFOLDED by react-native spm scaffold — safe to edit & commit via patch-package.
// AUTO-SCAFFOLDED-VERSION: 19
// Cache slot: 0.87.1/dual-flavor
// Edit the contents below if needed and re-run `npx patch-package <dep-name>`
// to persist across `npm install`. To regenerate from the podspec, remove
// this file (or just this marker) and re-run `npx react-native spm scaffold`.
//
// Package references are plain relative paths, computed when this file was
// scaffolded. They stay correct because the file is re-scaffolded per app
// and cache slot, and any node_modules relayout reinstalls this package
// (dropping the file) anyway.

    // The scaffold mapped neither of this podspec's two dependencies (it declares
    // `s.dependency 'React'` directly instead of install_modules_dependencies, so the
    // standard React wiring was skipped, and PromisesObjC has no SwiftPM counterpart
    // in the scaffold's table). Both wired by hand to the manifests upstream ships.
import PackageDescription

let package = Package(
    name: "ReactNativePeripheral",
    platforms: [.iOS(.v15)],
    products: [
        .library(name: "ReactNativePeripheral", targets: ["ReactNativePeripheral"]),
    ],
    dependencies: [
        .package(name: "ReactNative", path: "../../../../xcframeworks"),
        .package(name: "React-GeneratedCode", path: "../../../ios"),
        .package(url: "https://github.com/google/promises.git", from: "2.1.1"),
    ],
    targets: [
        .target(
            name: "ReactNativePeripheral",
            dependencies: [.product(name: "ReactHeaders", package: "ReactNative"), .product(name: "ReactNativeHeaders", package: "ReactNative"), .product(name: "ReactNativeDependenciesHeaders", package: "ReactNative"), .product(name: "ReactAppHeaders", package: "React-GeneratedCode"), .product(name: "FBLPromises", package: "promises")],
            path: ".",
            sources: [
                "ios/RCTConvert+CBATTError.m",
                "ios/RCTConvert+CBAttributePermissions.m",
                "ios/RCTConvert+CBCharacteristicProperties.m",
                "ios/RCTConvert+CBManagerState.m",
                "ios/RCTConvert+CBMutableCharacteristic.m",
                "ios/RCTConvert+CBMutableService.m",
                "ios/RCTConvert+CBUUID.m",
                "ios/RNBlePeripheral.h",
                "ios/RNBlePeripheral.m",
            ],
            publicHeadersPath: "ios",
            cSettings: [.headerSearchPath("ios"), .headerSearchPath("."), .unsafeFlags(["-include", "react-native-spm-prefix.h"])],
            cxxSettings: [.headerSearchPath("ios"), .headerSearchPath("."), .unsafeFlags(["-include", "react-native-spm-prefix.h"]), .define("DEBUG", .when(configuration: .debug)), .define("NDEBUG", .when(configuration: .release))],
            linkerSettings: [.linkedFramework("UIKit"), .linkedFramework("Foundation"), .linkedFramework("CoreGraphics")]
        ),
    ],
    cxxLanguageStandard: .cxx20
)
