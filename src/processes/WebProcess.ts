import { DeviceProcess } from './DeviceProcess';
import { Device } from '../devices/Device';
import { TestScenario } from '../TestScenario';

export class WebProcess extends DeviceProcess {
  constructor(id: number, device: Device, testScenario: TestScenario) {
    super(id, device, testScenario);
  }

  async run() {
    var args = this.baseArgs();
    args.push('--require');
    args.push(`${process.cwd()}/features/web/*/*.js`);
    this.runWithArgs(args)
  }
}
