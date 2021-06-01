import { DeviceProcess } from './DeviceProcess';
import { Device } from '../devices/Device';
import { TestScenario } from '../TestScenario';

export class WebProcess extends DeviceProcess {
  constructor(id: number, device: Device, testScenario: TestScenario) {
    super(id, device, testScenario);
  }
}
