import { FileHelper } from '../utils/FileHelper';
import { Device } from '../devices/Device';
import * as Constants from '../utils/Constants';

export abstract class SignalingClient {
    id: string;

    constructor(id?: string) {
        this.id = id || Device.generateRandomId();
    }

    async readSignal(signal: string, timeout: Number = Constants.DEFAULT_TIMEOUT_MILLISECONDS) {
        return new Promise(resolve => this.waitForSignalOrTimeout(signal, timeout, Date.now(), resolve));
    }

    private waitForSignalOrTimeout(signal: string, timeout: Number, startTime: any, resolve: any) {
        if (signal === this.inboxLastSignal()) {
          resolve(signal);
        } else if (
          (Date.now() - startTime) >= timeout
        ) {
          throw new Error(`ERROR: Signal timeout,  did not receive signal: ${signal}`);
        } else {
          setTimeout(
            this.waitForSignalOrTimeout.bind(this, signal, timeout, startTime, resolve), 1000
          );
        }
    }

    writeSignal(receiverInboxId: string, signal: string) {
        FileHelper.instance().appendTextToFile(
            signal, this.inboxFilePathForId(receiverInboxId)
        );
    }

    createInbox() {
        FileHelper.instance().createFileIfDoesNotExist(this.currentInboxFilePath());
    }

    resetInbox() {
        this.deleteInbox();
        this.createInbox();
    }

    deleteInbox() {
        FileHelper.instance().deleteFileInPathIfExists(this.currentInboxFilePath());
    }

    inboxLastSignal(): any {
        let contentsOfInbox = FileHelper.instance().contentOfFile(
            this.currentInboxFilePath()
        ).trim().split('\n');
        return contentsOfInbox[contentsOfInbox.length - 1];
    }

    currentInboxFilePath(): string {
        return this.inboxFilePathForId(this.id);
    }

    private inboxFilePathForId(id: string): string {
        return `${process.cwd()}/.${id}_${Constants.INBOX_FILE_NAME}`;
    }
}