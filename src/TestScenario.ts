import { FeatureFile } from './cucumber/FeatureFile';
import { ADB } from './utils/ADB';
import { AndroidDevice } from './devices/AndroidDevice';
import { WebDevice } from './devices/WebDevice';
import { Device } from './devices/Device';
import { AppiumProcess } from './processes/AppiumProcess';
const { exec, execSync } = require("child_process");
import { MobileProcess } from './processes/MobileProcess';
import { WebProcess } from './processes/WebProcess';
import { DeviceProcess } from './processes/DeviceProcess';

export class TestScenario {
  featureFile: FeatureFile;

  constructor(featureFile: FeatureFile) {
    this.featureFile = featureFile;
  }

  public run() {
    let devices: Device[] = this.sampleDevices();
    devices.forEach((device: AndroidDevice, index: number) => {
      this.startProcessForUserIdInDevice(index + 1, device);
    });
  }

  startProcessForUserIdInDevice(userId: number, device: Device) {
    if(device instanceof AndroidDevice) {
      this.startMobileProcessForUserIdInDevice(userId, device);
    } else if(device instanceof WebDevice) {
      this.startWebProcessForUserIdInDevice(userId, device);
    } else {
      throw new Error('ERROR: Platform not supported');
    }
  }

  startMobileProcessForUserIdInDevice(userId: number, device: Device) {
    let process: MobileProcess = new MobileProcess(userId, device, this);
    process.run();
  }

  startWebProcessForUserIdInDevice(userId: number, device: Device) {
    let process: WebProcess = new WebProcess(userId, device, this);
    process.run();
  }

  private sampleDevices(): AndroidDevice[] {
    let sample: Device[] = [];
    let mobileDevices: AndroidDevice[] = this.sample_mobile_devices();
    let webDevices: WebDevice[] = this.sample_web_devices();
    this.featureFile.requiredDevicesInfo().forEach((deviceInfo) => {
      let device = deviceInfo.systemType === '@web' ? webDevices.shift() : mobileDevices.shift();
      if(device) {
        sample.push(device);
      }
    });
    return sample;
  }

  private sample_mobile_devices(): AndroidDevice[] {
    let mobileDevices: AndroidDevice[] = ADB.instance().connectedDevices();
    let numberOfRequiredMobileDevices =  this.featureFile.numberOfRequiredMobileDevices();
    return mobileDevices.slice(0, numberOfRequiredMobileDevices);
  }

  private sample_web_devices(): WebDevice[] {
    let numberOfRequiredWebDevices =  this.featureFile.numberOfRequiredWebDevices();
    let webDevices: WebDevice[] = [];
    for(var i = 0; i < numberOfRequiredWebDevices; i++) {
      webDevices.push(WebDevice.factoryCreate())
    }
    return webDevices.slice(0, numberOfRequiredWebDevices);
  }
}
