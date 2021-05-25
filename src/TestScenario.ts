import { FeatureFile } from './FeatureFile';
import { ADB } from './ADB';
import { AndroidDevice } from './AndroidDevice';
import { MobileProcess } from './mobile/MobileProcess';
const { exec, execSync } = require("child_process");

export class TestScenario {
  featureFile: FeatureFile;

  constructor(featureFile: FeatureFile) {
    this.featureFile = featureFile;
  }

  public run() {
    let devices: AndroidDevice[] = this.sampleDevices();
    devices.forEach((device: AndroidDevice) => {
      const klassiCli = new (require('@cucumber/cucumber').Cli)({
        argv: [
          '-f',
          'pretty',
          '--tags',
          '@user1',
          '--world-parameters',
          "{\"device_id\": \"Test\"}"
        ],
        cwd: process.cwd(),
        stdout: process.stdout,
      });
      klassiCli.run((succeeded:any) => {
        if (!succeeded) {
          process.exit(1);
        }

        if (process.stdout.write('')) {
          process.exit();
        } else {
          // kernel buffer is not empty yet
          process.stdout.on('drain', () => {
            process.exit();
          });
        }
      });
    });
  }

  private sampleDevices(): AndroidDevice[] {
    let sample: AndroidDevice[] = [];
    let devices = ADB.instance().connectedDevices();
    this.featureFile.requiredDevicesInfo().forEach((deviceInfo) => {
      let device = devices.shift();
      if(device) {
        sample.push(device);
      }
    });
    return sample;
  }
}
