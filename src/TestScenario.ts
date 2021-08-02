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
import { KrakenMobile } from './KrakenMobile';
const { randomBytes } = require('crypto');

export class TestScenario {
  featureFile: FeatureFile;
  reporter: Reporter;
  processes: DeviceProcess[];
  krakenApp: KrakenMobile;
  executionId: string;
  devices: Device[];

  constructor(featureFile: FeatureFile, krakenApp: KrakenMobile) { 
    this.featureFile = featureFile;
    this.krakenApp = krakenApp;
    this.reporter = new Reporter(this);
    this.processes = [];
    this.executionId = randomBytes(10).toString('hex');
    this.devices = [];
  }

  public async run() {
    if (!this.featureFile.hasRightSyntax()) {
      throw new Error(
        `ERROR: Verify feature file ${this.featureFile.filePath} has one unique @user tag for each scenario`
        );
    }

    this.beforeExecute();
    this.execute();
    await this.allProcessesFinished();
    this.afterExecute();
  }

  private beforeExecute() {
    this.deleteAllInboxes();
    this.deleteSupportFilesAndDirectories();

    this.devices = this.sampleDevices();
    this.devices.forEach((device: AndroidDevice, index: number) => {
      if (!device) { return; }

      let process = this.processForUserIdInDevice(index + 1, device);
      process.registerProcessToDirectory();
      this.processes.push(process);
    });
    this.reporter.createReportFolderRequirements();
  }

  private execute() {
    this.processes.forEach((process) => {
      process.run();
    });
  }

  private afterExecute() {
    this.deleteSupportFilesAndDirectories();
    this.notifyScenarioFinished();
    this.reporter.saveReport();
  }

  private notifyScenarioFinished() {
    this.krakenApp.onTestScenarioFinished();
  }

  private deleteSupportFilesAndDirectories() {
    FileHelper.instance().deleteFileInPathIfExists(Constants.DIRECTORY_PATH);
    FileHelper.instance().deleteFileInPathIfExists(Constants.DICTIONARY_PATH);
    for (let state in Constants.PROCESS_STATE_FILE_PATH) {
      FileHelper.instance().deleteFileInPathIfExists(Constants.PROCESS_STATE_FILE_PATH[`${state}`]);
    }
  }

  private deleteAllInboxes() {
    FileHelper.instance().deleteFilesWithGlobPattern(`${process.cwd()}/${Constants.KRAKEN_DIRECTORY}/.*_${Constants.INBOX_FILE_NAME}`);
  }

  processForUserIdInDevice(userId: number, device: Device) {
    let process: any = null;
    if(device instanceof AndroidDevice) {
      process = new AndroidProcess(userId, device, this);
    } else if(device instanceof WebDevice) {
      process = new WebProcess(userId, device, this);
    } else {
      throw new Error('ERROR: Platform not supported');
    }
    return process;
  }

  sampleDevices(): Device[] {
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

  sampleMobileDevices(): AndroidDevice[] {
    let mobileDevices: AndroidDevice[] = ADB.instance().connectedDevices();
    let numberOfRequiredMobileDevices =  this.featureFile.numberOfRequiredMobileDevices();
    return mobileDevices.slice(0, numberOfRequiredMobileDevices);
  }

  sampleWebDevices(): WebDevice[] {
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
    return registered_ids.filter((registered_id) => {
      return !finished_ids.includes(registered_id);
    }).length <= 0;
  }

  private async allProcessesFinished() {
    return new Promise(resolve => this.waitForAllProcessesToFinishOrTimeout(Date.now(), resolve));
  }

  private waitForAllProcessesToFinishOrTimeout(startTime: any, resolve: any) {
    if (this.allRegiresteredDevicesFinished()) {
      resolve();
    } else if (
      (Date.now() - startTime) >= Constants.DEFAULT_PROCESS_TIMEOUT_SECONDS
    ) {
      throw new Error(`ERROR: Timeout, a process took more time than expected.`);
    } else {
      setTimeout(
        this.waitForAllProcessesToFinishOrTimeout.bind(this, startTime, resolve), 1000
      );
    }
  }
}
