import { remote } from 'webdriverio';
import { exec } from "child_process";
import { Client } from './Client';
const portfinder = require('portfinder');

export class AndroidClient extends Client {
  port: any;
  proc: any;
  app: string;
  deviceId: string;
  appPackage: string;
  appActivity: string;
  otherParams: any;
  private client: any;
  private defaultClientTimout: number;
  private clientStartingTime: any;

  constructor(deviceId: string, app: string, appPackage: string, appActivity: string, otherParams?: any, id?: string) {
    super(id);
    this.defaultClientTimout = 60000;
    this.app = app;
    this.deviceId = deviceId;
    this.appPackage = appPackage;
    this.appActivity = appActivity;
    this.otherParams = otherParams;
  }

  async start(): Promise<any>{
    this.createInbox();
    this.port = await this.availablePort();
    this.proc = exec(`appium -p ${this.port}`);
    this.proc.stdout.on('data', this.onStdout.bind(this));
    this.proc.stderr.on('data', this.onStderr.bind(this));
    this.clientStartingTime = Date.now();
    return new Promise(this.waitForClientToStart.bind(this));
  }

  async stop(): Promise<any> {
    this.deleteInbox();
    await this.client.deleteSession();
    this.proc.kill('SIGINT');
  }

  // Helpers
  generaOpts() {
      return {
        path: '/wd/hub',
        port: this.port,
        capabilities: this.capabilities()
      }
  };

  private capabilities(): any {
    return {
      platformName: "Android",
      deviceName: "Android Emulator",
      app: this.app,
      appPackage: this.appPackage,
      appActivity: this.appActivity,
      automationName: "UiAutomator2",
      udid: this.deviceId,
      ...this.otherParams
    }
  }

  async availablePort() {
    portfinder.basePort = 8000;
    portfinder.highestPort = 8100;
    return await portfinder.getPortPromise();
  }

  private async startProcess() {
    console.log(`Starting process on device: ${this.id}`);
    this.client = await remote(
      this.generaOpts(), (client: any) => {
        client.readSignal = this.readSignal.bind(this);
        client.writeSignal = this.writeSignal.bind(this);
        return client;
      }
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
    console.log(`Error starting process on device: ${this.id}`);
    this.proc.kill('SIGINT');
  }
}
