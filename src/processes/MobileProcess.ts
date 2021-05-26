import { DeviceProcess } from './DeviceProcess';
import { Device } from '../devices/Device';
import { TestScenario } from '../TestScenario';
const { Cli } = require('@cucumber/cucumber');

export class MobileProcess extends DeviceProcess {
  constructor(id: number, device: Device, testScenario: TestScenario) {
    super(id, device, testScenario);
  }

  async run() {
    const cucumberCli = new Cli({
      argv: [
        '-f', 'pretty',
        '--tags', `@user${this.id}`,
        '--world-parameters', "{\"device_id\": \"Test\"}"
      ],
      cwd: process.cwd(),
      stdout: process.stdout,
    });
    cucumberCli.run(this.handleCucumberResult);
  }
}
