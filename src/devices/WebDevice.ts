import { Device } from './Device';
import * as Constants from '../utils/Constants';

export class WebDevice extends Device {
  constructor(id: string, model: string) {
    super(id, model);
  }

  static factoryCreate() {
    return new WebDevice(
      Device.generateRandomId(), 'Web'
    );
  }

  screenSize(): { height: number, width: number} {
    return {
      height: 0, width: 0
    };
  }

  sdkVersion(): number {
    return 1.0; // Default
  }

  orientation(): number {
    return Constants.WEB_PORTRAIT;
  }
}
