import { Device } from './Device';

export class WebDevice extends Device {
  constructor(id: string, model: string) {
    super(id, model);
  }

  static factoryCreate() {
    return new WebDevice(
      Device.generateRandomId(), 'web'
    );
  }
}
