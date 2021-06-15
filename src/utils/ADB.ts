const { execSync } = require("child_process");
import { AndroidDevice } from '../devices/AndroidDevice';

export class ADB {
  private static singletonInstance: ADB;

  private constructor() { }

  public static instance(): ADB {
    if (!ADB.singletonInstance) {
        ADB.singletonInstance = new ADB();
    }
    return ADB.singletonInstance;
  }

  connectedDevices(): AndroidDevice[] {
    let devices: AndroidDevice[] = [];
    const adbDevices: string = execSync('adb devices -l').toString();
    adbDevices.split('\n').forEach((line: string) => {
      const id: any = this.extractDeviceIdFromLine(line);
      const model: any = this.extractDeviceModelFromLine(line);
      if(!id || !model) { return; }

      devices.push(new AndroidDevice(id, model));
    });
    return devices;
  }

  private extractDeviceIdFromLine(line: string) {
    if(line.match(/device(?!s)/)) {
      return line.split(' ')[0]
    }
  }

  private extractDeviceModelFromLine(line: string) {
    if(line.match(/device(?!s)/)) {
      let match: any = line.match(/model:(.*) device/);
      if(match && match.length > 1) {
        return match[1];
      }
    }
  }
}
