import { Device } from './Device';

export class AndroidDevice extends Device {
  constructor(id: string, model: string) {
    super(id, model);
  }
}
