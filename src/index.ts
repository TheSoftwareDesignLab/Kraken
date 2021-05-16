const { remote } = require('webdriverio');
const { exec } = require("child_process");
class DeviceProcess {
  deviceId: string;
  port: number;
  proc: any;

  constructor(deviceId: string, port: number) {
    this.deviceId = deviceId;
    this.port = port;
  }

  async start() {
    this.proc = exec(`appium -p ${this.port}`);
    this.proc.stdout.on('data', this.onStdout.bind(this));
    this.proc.stderr.on('data', this.onStderr.bind(this));
  }

  // Helpers
  generaOpts(udid: string, port: number) {
      return {
        path: '/wd/hub',
        port: port,
        capabilities: {
          platformName: "Android",
          deviceName: "Android Emulator",
          app: "./app.apk",
          appPackage: "es.usc.citius.servando.calendula",
          appActivity: "es.usc.citius.servando.calendula.activities.StartActivity",
          automationName: "UiAutomator2",
          udid: udid
        }
      }
  };

  private async executeTests() {
    console.log(`Starting process on device: ${this.deviceId}`);
    const client = await remote(
      this.generaOpts(
        this.deviceId, this.port
      )
    );
    await new Promise(r => setTimeout(r, 5000));
    await client.deleteSession();
    this.proc.kill('SIGINT');
  }

  private onStdout(data: any) {
    let dataText: string = data.toString();
    if(dataText.includes(`started on 0.0.0.0:${this.port}`)) {
      this.executeTests();
    }
  }

  private onStderr(data: any) {
    let dataText: string = data.toString();
    console.log(`Error starting process on device: ${this.deviceId}`);
    console.log(dataText);
    this.proc.kill('SIGINT');
  }
}

let firstProcess: DeviceProcess = new DeviceProcess('93c6af52', 4723);
firstProcess.start();

let secondProcess: DeviceProcess = new DeviceProcess('emulator-5554', 4725);
secondProcess.start();
