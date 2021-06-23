import { Device } from '../devices/Device';
import { TestScenario } from '../TestScenario';
import { DeviceProcessInterface } from '../interfaces/DeviceProcessInterface';
import { spawn } from "child_process";
import { FileHelper } from '../utils/FileHelper';
import * as Constants from '../utils/Constants';

export abstract class DeviceProcess implements DeviceProcessInterface {
  id: Number;
  device: Device;
  testScenario: TestScenario;

  constructor(id: Number, device: Device, testScenario: TestScenario) {
    this.id = id;
    this.device = device;
    this.testScenario = testScenario;
  }

  abstract run(): void;

  protected async runWithArgs(args: string[]) {
    const cucumberProcess = spawn(
      'node', args, {
        stdio: 'inherit'
      }
    );
    cucumberProcess.on('exit', function (err) {
      if(err) {
        console.log('Could not execute test');
        process.exit(1);
      }
    });
  }

  protected baseArgs(): string[] {
    return [
      `${__dirname}/../../bin/cucumber`,
      '-f', 'pretty',
      `${this.testScenario.featureFile.filePath}`, 
      '--tags', `@user${this.id}`,
      '--world-parameters', this.worldParams(),
      '--require', FileHelper.instance().pathToAbsolutePath(`${__dirname}/../steps/both.js`)
    ];
  }

  private worldParams(): string {
    return JSON.stringify({
      id: this.id,
      device: {
        id: this.device.id,
        model: this.device.model,
        _type: this.device.constructor.name
      },
      mobile_info: this.mobileInfoForProcess()
    });
  }

  private mobileInfoForProcess() {
    if (!FileHelper.instance().pathExists(Constants.MOBILE_INFO_PATH)) { return; }

    let mobileInfo = FileHelper.instance().contentOfFile(Constants.MOBILE_INFO_PATH);
    let jsonMobileInfo = JSON.parse(mobileInfo);
    return {
      apk_path: FileHelper.instance().pathToAbsolutePath(jsonMobileInfo.apk_path),
      apk_package: jsonMobileInfo.apk_package,
      apk_launch_activity: jsonMobileInfo.apk_launch_activity
    }
  }

  handleCucumberResult(succeeded:any) {
    if (!succeeded) {
      process.exit(1);
    }

    if (process.stdout.write('')) {
      process.exit();
    } else {
      process.stdout.on('drain', () => {
        process.exit();
      });
    }
  }

  static directory(): string[] {
    if(!FileHelper.instance().pathExists(Constants.DIRECTORY_PATH)) {
      return [];
    }

    let directoryContent = FileHelper.instance().contentOfFile(Constants.DIRECTORY_PATH);
    if(!directoryContent) { return []; }

    return directoryContent.trim().split('\n');
  }

  static registeredProcessIds(): Number[] {
    let directory = DeviceProcess.directory();

    return directory.map((entry: string) => {
      let entryParts: string[] = entry.split(Constants.SEPARATOR);
      return Number(entryParts[0]);
    }).filter((id: Number) => {
      return id != undefined && id != null && id != NaN;
    });
  }

  static processesInState(state: Number): Number[] {
    let filePath: string = Constants.PROCESS_STATE_FILE_PATH[`${state}`];
    if (!FileHelper.instance().pathExists(filePath)) { return []; }

    let stateContent = FileHelper.instance().contentOfFile(filePath);
    if (!stateContent) { return []; }

    return stateContent.trim().split('\n').map((entry: string) => {
      return Number(entry);
    }).filter((id: Number) => {
      return id != undefined && id != null && id != NaN;
    });
  }

  static findProcessWithUserId(userId: string): any {
    let directory = this.directory();
    let foundProcess = directory.find((entry) => {
      let entryParts = entry.split(Constants.SEPARATOR);
      let entryUserId = entryParts[0];
      return entryUserId.trim() == userId;
    });
    if(!foundProcess) { return; }

    let processParts = foundProcess.split(Constants.SEPARATOR);
    return processParts[1].trim();
  }

  registerProcessToDirectory() {
    FileHelper.instance().createFileIfDoesNotExist(Constants.DIRECTORY_PATH);
    FileHelper.instance().appendTextToFile(
      `${this.id}${Constants.SEPARATOR}${this.device}`, Constants.DIRECTORY_PATH
    )
  }
}
