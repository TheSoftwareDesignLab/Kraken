const { execSync } = require("child_process");
import { AndroidDevice } from './AndroidDevice';

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
      const id: any = this.extract_device_id_from_line(line);
      const model: any = this.extract_device_model_from_line(line);
      if(!id || !model) { return; }

      devices.push(new AndroidDevice(id, model));
    });
    return devices;
  }

  private extract_device_id_from_line(line: string) {
    if(line.match(/device(?!s)/)) {
      return line.split(' ')[0]
    }
  }

  private extract_device_model_from_line(line: string) {
    if(line.match(/device(?!s)/)) {
      let match: any = line.match(/model:(.*) device/);
      if(match && match.length > 1) {
        return match[1];
      }
    }
  }
}
