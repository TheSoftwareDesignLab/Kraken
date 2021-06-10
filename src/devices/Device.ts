const { randomBytes } = require('crypto');
import { FileHelper } from '../utils/FileHelper';
import * as Constants from '../utils/Constants';

export class Device {
  id: string;
  model: string;

  constructor(id: string, model: string) {
    this.id = id;
    this.model = model;
  }

  static generateRandomId(): string {
    return randomBytes(10).toString('hex');
  }

  async readSignal(signal: string) {
    return new Promise(resolve => this.waitForSignalOrTimeout(signal, Date.now(), resolve));
  }

  private waitForSignalOrTimeout(signal: string, startTime: any, resolve: any) {
    console.log(Date.now() - startTime);
    if (signal === this.inboxLastSignal()) {
      resolve(signal);
    } else if (
      (Date.now() - startTime) >= Constants.DEFAULT_TIMEOUT_MILLISECONDS
    ) {
      throw new Error(`ERROR: Signal timeout,  did not receive signal: ${signal}`);
    } else {
      setTimeout(
        this.waitForSignalOrTimeout.bind(this, signal, startTime, resolve), 1000
      );
    }
  }

  async writeSignal(signal: string) {
    FileHelper.instance().appendTextToFile(
      signal, this.inboxFilePath()
    );
  }

  createInbox() {
    FileHelper.instance().createFile(this.inboxFilePath());
  }

  inboxLastSignal(): any {
    let contentsOfInbox = FileHelper.instance().contentOfFile(
      this.inboxFilePath()
    ).trim().split('\n');
    return contentsOfInbox[contentsOfInbox.length - 1];
  }

  private inboxFilePath(): string {
    return `${process.cwd()}/.${this.id}_${Constants.INBOX_FILE_NAME}`;
  }
}
