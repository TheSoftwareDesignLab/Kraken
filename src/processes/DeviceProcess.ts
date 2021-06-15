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
    const cucumberProcess = await spawn(
      'node', args, {
        stdio: 'inherit'
      }
    );
  }

  protected baseArgs(): string[] {
    return [
      `${__dirname}/../../bin/cucumber`,
      '-f', 'pretty',
      '--tags', `@user${this.id}`,
      '--world-parameters', this.worldParams()
    ];
  }

  private worldParams(): string {
    return JSON.stringify({
      id: this.id,
      device: {
        id: this.device.id,
        model: this.device.model,
        _type: this.device.constructor.name
      }
    });
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

  registerProcessToDirectory() {
    FileHelper.instance().createFileIfDoesNotExist(Constants.DIRECTORY_PATH);
    FileHelper.instance().appendTextToFile(
      `${this.id}${Constants.SEPARATOR}${this.device}`, Constants.DIRECTORY_PATH
    )
  }
}
