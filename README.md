<p align="center">
    <img src="./reporter/assets/images/kraken.png" alt="kraken logo" width="140" height="193">
<h1 align="center">Kraken</h1>

Kraken is an open source automated android and web E2E testing tool that supports and validates scenarios that involve the inter-communication between two or more users. It works in a Black Box manner meaning that it is not required to have access to the source code of the application but instead it can be run with the APK (Android package file format) and web page URL. Kraken uses signaling for coordinating the communication between the devices using a file based protocol.

# Video
[![krakenThumbnail](./reporter/assets/images/krakenThumbnail.jpg)](https://youtu.be/gf95lafrD8M)

**Kraken is partially supported by a Google Latin America Research Award (LARA) 2018 - 2021**

# Technologies

Kraken uses [Appium](https://appium.io/) and [WebdriverIO](https://webdriver.io/) for running automated E2E tests in each device or emulator and [Cucumber](https://github.com/cucumber/cucumber-js) for running your feature files written with Gherkin sintax.

# 🔨 Installation

### Prerequisites

- Android SDK (ADB and AAPT configured)
- Appium
- NodeJS (Version ≥ 12)
- Java

### Check if all prerequisites are installed

Kraken offers the following command to check if all required configuration before running Kraken is installed correctly.

```bash
kraken-node doctor
```

# Signaling

Signaling is a protocol used for the communication of two or more devices running in parallel. It is based in the idea that each browser, emulator or real device has a communication channel where he can receive signals sent from other devices which contain information or actions that are supposed to be executed. This type of protocol is commonly used in automated mobile E2E testing tools that validate scenarios involving the inter-communication and collaboration of two or more applications.

# Writing your first test

### Create NodeJS project

```bash
npm init -y
```

### Install Kraken

```bash
npm install kraken-node --save
```

### **Generate cucumber feature skeleton**

You need to generate the cucumber feature skeleton where your tests are going to be saved. To achieve this you should run.

```bash
npx kraken-node gen
```

This will create the following folders and files.

```
features
|_mobile
| |_step_definitions
| | |_step.js
| |_support
| | |_hooks.js
| | |_support.js
|_web
| |_step_definitions
| | |_step.js
| |_support
| | |_hooks.js
| | |_support.js
|_my_first.feature
mobile.json
```

### Executing the test

To execute the test you should run the following command.

```bash
npx kraken-node run
```

### Syntax

In Kraken each feature is a test and each scenario within a feature is a test case that is run in a device. Each device is identified as an user and numbered from 1 to N. Ex: @user1, @user2, @user3. Also you each user should specify what type of device is going to execute the scenario, for web testing use @web and for mobile testing use @mobile. 

After identifying what number each device has, you can write your test case giving each scenario the tag of a given device like so:

```bash
Feature: Example feature

  @user1 @mobile
  Scenario: As a first user I say hi to a second  user
  Given I wait
  Then I send a signal to user 2 containing "hi"

  @user2 @web
  Scenario: As a second user I wait for user 1  to say hi
  Given I wait for a signal containing "hi"
  Then I wait
```

# Kraken steps

Kraken offers two main steps to help synchronizing your devices.

### Signaling steps

To wait for a signal coming from another device for 10 seconds that is Kraken default timeout use the following step.

```
Then /^I wait for a signal containing "([^\"]*)"$/
```

To wait for a signal coming from another device for an specified number of seconds use the following step

```
Then /^I wait for a signal containing "(  [^\"]*)" for (\d+) seconds$/
```

To send a signal to another specified device use the following step

```
Then /^I send a signal to user (\d+) containing "([^\"]*)"$/
```

### Signaling functions

Each device has an internal Kraken implementation of the signaling steps using the following functions.

```
readSignal(content, time_out)
```

Waits for a signal with the specified content. This functions waits for the specified number of seconds in the timeout parameter before throwing an exception if specified.

```
writeSignal(signal)
```

Writes signal content to a device inbox.

### Mobile steps

To see a list of all mobile steps available in Kraken, visit the following [link](https://github.com/ravelinx22/Kraken/blob/master/src/steps/mobile.ts)

### Web steps

To see a list of all web steps available in Kraken, visit the following [link](https://github.com/ravelinx22/Kraken/blob/master/src/steps/web.ts)

### Creating new steps

To create new steps it depends the platform that is going to implement the step, in the case of Mobile testing you should add your custom steps on the ***features/mobile/step_definitions/step.js*** file. On the other hand, when adding a custom step for Web testing you should add the step in the file ***features/web/step_definitions/step.js.***

# Specifying Android's APK file for the test

In case you are going to execute mobile testing with or instead of web testing you should specify an APK file that will be installed on the phone available for testing, also Appium requires the name of the package and main activity of the app under test. To achieve this Kraken creates a file named *mobile.json* on the root directory where you can specify this information.

```json
{
    "type": "singular",
    "apk_path": "<APK_PATH>",
    "apk_package": "<APK_PACKAGE>",
    "apk_launch_activity": "<APK_LAUNCH_ACTIVITY>"
}
```

## Finding your apps package and launch activity name

In most cases when testing a third party app you will not have the APK's package and launch activity, that is why Kraken offers the following command that using Android's ADB will try to retrieve this information from the APK.

```bash
npx kraken-node apk-info <APK_PATH>
```
