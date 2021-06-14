import { FeatureFile } from './cucumber/FeatureFile';
import { ADB } from './utils/ADB';
import { AndroidDevice } from './devices/AndroidDevice';
import { WebDevice } from './devices/WebDevice';
import { Device } from './devices/Device';
import { exec, execSync } from "child_process";
import { AndroidProcess } from './processes/AndroidProcess';
import { WebProcess } from './processes/WebProcess';
import { DeviceProcess } from './processes/DeviceProcess';
import * as Constants from './utils/Constants';
import { FileHelper } from './utils/FileHelper';
import { Reporter } from './reports/Reporter';

export class TestScenario {
  featureFile: FeatureFile;
  reporter: Reporter;

  constructor(featureFile: FeatureFile) { 
    this.featureFile = featureFile;
    this.reporter = new Reporter(this);
  }

  public run() {
    if (!this.featureFile.has_right_syntax()) {
      throw new Error(
        `ERROR: Verify feature file ${this.featureFile.filePath} has one unique @user tag for each scenario`
        );
    }

    this.beforeExecute();
    this.execute();
    this.afterExecute();
    console.log(this.allRegiresteredDevicesFinished());
    console.log(this.allRegiresteredDevicesFinished());
    console.log(this.allRegiresteredDevicesFinished());
    console.log(this.allRegiresteredDevicesFinished());
  }

  private beforeExecute() {
    this.deleteAllInboxes();
    this.deleteSupportFilesAndDirectories();
  }

  private execute() {
    let devices: Device[] = this.sampleDevices();
    devices.forEach((device: AndroidDevice, index: number) => {
      if (!device) { return; }

      this.startProcessForUserIdInDevice(index + 1, device);
    });
  }

  private afterExecute() {
    this.deleteSupportFilesAndDirectories();
  }

  private deleteSupportFilesAndDirectories() {
    FileHelper.instance().deleteFileInPathIfExists(Constants.DIRECTORY_PATH);
    FileHelper.instance().deleteFileInPathIfExists(Constants.DICTIONARY_PATH);
    for (let state in Constants.PROCESS_STATE_FILE_PATH) {
      FileHelper.instance().deleteFileInPathIfExists(Constants.PROCESS_STATE_FILE_PATH[`${state}`]);
    }
  }

  private deleteAllInboxes() {
    FileHelper.instance().deleteFilesWithGlobPattern(`${process.cwd()}/.*_${Constants.INBOX_FILE_NAME}`);
  }

  startProcessForUserIdInDevice(userId: number, device: Device) {
    if(device instanceof AndroidDevice) {
      this.startAndroidProcessForUserIdInDevice(userId, device);
    } else if(device instanceof WebDevice) {
      this.startWebProcessForUserIdInDevice(userId, device);
    } else {
      throw new Error('ERROR: Platform not supported');
    }
  }

  startAndroidProcessForUserIdInDevice(userId: number, device: Device) {
    let process: AndroidProcess = new AndroidProcess(userId, device, this);
    process.run();
  }

  startWebProcessForUserIdInDevice(userId: number, device: Device) {
    let process: WebProcess = new WebProcess(userId, device, this);
    process.run();
  }

  private sampleDevices(): AndroidDevice[] {
    let sample: any[] = [];
    let mobileDevices: AndroidDevice[] = this.sampleMobileDevices();
    let webDevices: WebDevice[] = this.sampleWebDevices();
    this.featureFile.requiredDevicesInfo().forEach((deviceInfo) => {
      let userId: number = Number(deviceInfo.userId); 
      let device = deviceInfo.systemType === '@web' ? webDevices.shift() : mobileDevices.shift();
      sample[userId - 1] = device;
    });
    return sample;
  }

  private sampleMobileDevices(): AndroidDevice[] {
    let mobileDevices: AndroidDevice[] = ADB.instance().connectedDevices();
    let numberOfRequiredMobileDevices =  this.featureFile.numberOfRequiredMobileDevices();
    return mobileDevices.slice(0, numberOfRequiredMobileDevices);
  }

  private sampleWebDevices(): WebDevice[] {
    let numberOfRequiredWebDevices =  this.featureFile.numberOfRequiredWebDevices();
    let webDevices: WebDevice[] = [];
    for(var i = 0; i < numberOfRequiredWebDevices; i++) {
      webDevices.push(WebDevice.factoryCreate())
    }
    return webDevices.slice(0, numberOfRequiredWebDevices);
  }

  private allRegiresteredDevicesFinished(): Boolean {
    let registered_ids = DeviceProcess.registeredProcessIds();
    let finished_ids = DeviceProcess.processesInState(Constants.PROCESS_STATES.finished);
    console.log(finished_ids);
    return registered_ids.filter((registered_id) => {
      return !finished_ids.includes(registered_id);
    }).length <= 0;
  }
}
