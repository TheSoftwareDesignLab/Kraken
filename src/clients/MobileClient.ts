import { remote } from 'webdriverio';
import { exec } from "child_process";
import portfinder from 'portfinder';
import { ClientInterface } from '../interfaces/ClientInterface';

export class MobileClient implements ClientInterface {
  deviceId: string;
  port: any;
  proc: any;
  private client: any;
  private defaultClientTimout: number;
  private clientStartingTime: any;

  constructor(deviceId: string) {
    this.deviceId = deviceId;
    this.defaultClientTimout = 60000;
  }

  async start() {
    this.port = await this.availablePort();
    this.proc = exec(`appium -p ${this.port}`);
    this.proc.stdout.on('data', this.onStdout.bind(this));
    this.proc.stderr.on('data', this.onStderr.bind(this));
    this.clientStartingTime = Date.now();
    return new Promise(this.waitForClientToStart.bind(this));
  }

  async stop() {
    await this.client.deleteSession();
    this.proc.kill('SIGINT');
  }

  // Helpers
  generaOpts(udid: string) {
      return {
        path: '/wd/hub',
        port: this.port,
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

  async availablePort() {
    portfinder.basePort = 8000;
    portfinder.highestPort = 8100;
    return await portfinder.getPortPromise();
  }

  private async startProcess() {
    console.log(`Starting process on device: ${this.deviceId}`);
    this.client = await remote(
      this.generaOpts(this.deviceId)
    );
  }

  private waitForClientToStart(resolve: any, reject: any) {
    if(this.client) {
      resolve(this.client);
    } else if(
      (Date.now() - this.clientStartingTime) >= this.defaultClientTimout
    ) {
      reject(new Error("Timeout"));
    } else {
      setTimeout(
        this.waitForClientToStart.bind(this, resolve, reject), 2000
      );
    }
  }

  private onStdout(data: any) {
    let dataText: string = data.toString();
    if(dataText.includes(`started on 0.0.0.0:${this.port}`)) {
      this.startProcess();
    }
  }

  private onStderr(data: any) {
    let dataText: string = data.toString();
    console.log(`Error starting process on device: ${this.deviceId}`);
    this.proc.kill('SIGINT');
  }
}
