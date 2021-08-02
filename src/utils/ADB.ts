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

  deviceScreenSize(deviceId: string): number[] {
    let adbScreenSize = execSync(`adb -s ${deviceId} shell wm size`).toString();
    return this.extractDeviceScreenSizeInfo(adbScreenSize);
  }

  deviceOrientation(deviceId: string): string {
    return execSync(
      `adb -s ${deviceId} shell dumpsys input | grep 'SurfaceOrientation' | awk '{ print $2 }'`
    ).toString();;
  }

  deviceSdkVersion(deviceId: string): string {
    return execSync(
      `adb -s ${deviceId} shell getprop ro.build.version.sdk`
    ).toString();;
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

  private extractDeviceScreenSizeInfo(line: string): number[] {
    let parts = line.trim().split(' ');
    let size = parts[parts.length - 1];
    if(!size.includes('x')) { return [0, 0]; }
    
    return size.split('x').map((part) => { return Number(part); });
  }
}
