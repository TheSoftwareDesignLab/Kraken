import { DeviceProcess } from './DeviceProcess';
import { Device } from '../devices/Device';
import { TestScenario } from '../TestScenario';
import { FileHelper } from '../utils/FileHelper';

export class AndroidProcess extends DeviceProcess {
  constructor(id: number, device: Device, testScenario: TestScenario) {
    super(id, device, testScenario);
  }

  async run() {
    var args = this.baseArgs();
    args.push('--require');
    args.push(`${process.cwd()}/features/mobile/*/*.js`);
    args.push('--require');
    args.push(FileHelper.instance().pathToAbsolutePath(`${__dirname}/../steps/mobile.js`));
    this.runWithArgs(args);
  }
}
