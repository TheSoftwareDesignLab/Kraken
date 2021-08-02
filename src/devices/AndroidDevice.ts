import { ADB } from '../utils/ADB';
import { Device } from './Device';
import * as Constants from '../utils/Constants';

export class AndroidDevice extends Device {
  constructor(id: string, model: string) {
    super(id, model);
  }

  screenSize(): { height: number, width: number } {
    let orientation: number = this.orientation();
    let size = ADB.instance().deviceScreenSize(this.id);

    let height = orientation == Constants.ANDROID_PORTRAIT ? size[1] : size[0];
    let width = orientation == Constants.ANDROID_PORTRAIT ? size[0] : size[1];

    return {
      height, width
    };
  }

  sdkVersion(): number {
    return Number(ADB.instance().deviceSdkVersion(this.id));
  }

  orientation(): number {
    let adbOrientation = ADB.instance().deviceOrientation(this.id);
    console.log(adbOrientation);
    return Number(adbOrientation.trim());
  }
}
