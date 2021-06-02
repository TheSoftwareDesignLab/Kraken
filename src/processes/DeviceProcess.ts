import { Device } from '../devices/Device';
import { TestScenario } from '../TestScenario';
import { DeviceProcessInterface } from '../interfaces/DeviceProcessInterface';
const { exec, spawn } = require("child_process");

export abstract class DeviceProcess implements DeviceProcessInterface {
  id: number;
  device: Device;
  testScenario: TestScenario;

  constructor(id: number, device: Device, testScenario: TestScenario) {
    this.id = id;
    this.device = device;
    this.testScenario = testScenario;
  }

  async run() {
    let args = [
      `${__dirname}/../../bin/cucumber`,
      '-f', 'pretty',
      '--tags', `@user${this.id}`,
      '--world-parameters', "{\"device_id\": \"Test\"}"
    ]
    const cucumberProcess = spawn(
      'node', args, {
        stdio: 'inherit'
      }
    );
  };

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
}
