import { SignalingClient } from "./SignalingClient";
import * as Constants from '../utils/Constants';
import { FileHelper } from '../utils/FileHelper';
import { DeviceProcess } from "../processes/DeviceProcess";
import { ClientInterface } from '../interfaces/ClientInterface';

export abstract class Client extends SignalingClient implements ClientInterface {
    async startKrakenForUserId(userId: Number) {
        let driver = await this.start();
        this.registerProcessToDirectoryWithUserId(userId);
        this.notifyReadyToStart(userId);
        await this.allDevicesReadyToStart();
        return driver;
    }

    async stopKrakenForUserId(userId: Number) {
        this.notifyReadyToFinish(userId);
        await this.allDevicesReadyToFinish();
        await this.stop();
        this.notifyFinished(userId);
    }

    abstract start(): Promise<any>;
    abstract stop(): Promise<any>;

    registerProcessToDirectoryWithUserId(userId: Number) {
        FileHelper.instance().createFileIfDoesNotExist(Constants.DIRECTORY_PATH);
        FileHelper.instance().appendTextToFile(
            `${this.id}${Constants.SEPARATOR}${userId}`, Constants.DIRECTORY_PATH
        )
    }

    notifyReadyToStart(userId: Number) {
        this.notifyProcessState(userId, Constants.PROCESS_STATES.ready_to_start);
    }

    notifyReadyToFinish(userId: Number) {
        this.notifyProcessState(userId, Constants.PROCESS_STATES.ready_to_finish);
    }

    notifyFinished(userId: Number) {
        this.notifyProcessState(userId, Constants.PROCESS_STATES.finished);
    }

    notifyProcessState(userId: Number, state: Number) {
        let filePath: string = Constants.PROCESS_STATE_FILE_PATH[`${state}`];
        FileHelper.instance().createFileIfDoesNotExist(filePath);
        FileHelper.instance().appendTextToFile(`${userId}`, filePath);
    }

    async allDevicesReadyToStart() {
        return new Promise(resolve => this.waitForAllDevicesReadyToStartOrTimeout(Date.now(), resolve));
    }

    waitForAllDevicesReadyToStartOrTimeout(startTime: any, resolve: any) {
        if (this.allRegisteredDevicesAreReadyToStart()) {
            resolve();
        } else if (
            (Date.now() - startTime) >= Constants.DEFAULT_PROCESS_START_TIMEOUT_MILLISECONDS
        ) {
            throw new Error(`ERROR: Timeout, not all devices were ready to start the scenario.`);
        } else {
            setTimeout(
                this.waitForAllDevicesReadyToStartOrTimeout.bind(this, startTime, resolve), 1000
            );
        }
    }

    async allDevicesReadyToFinish() {
        return new Promise(resolve => this.waitForAllDevicesReadyToFinishOrTimeout(Date.now(), resolve));
    }

    waitForAllDevicesReadyToFinishOrTimeout(startTime: any, resolve: any) {
        if (this.allRegisteredDevicesAreReadyToFinish()) {
            resolve();
        } else if (
            (Date.now() - startTime) >= Constants.DEFAULT_PROCESS_FINISH_TIMEOUT_SECONDS
        ) {
            throw new Error(`ERROR: Timeout, not all devices were ready to start the scenario.`);
        } else {
            setTimeout(
                this.waitForAllDevicesReadyToFinishOrTimeout.bind(this, startTime, resolve), 1000
            );
        }
    }

    private allRegisteredDevicesAreReadyToStart(): Boolean {
        let registered_ids = DeviceProcess.registeredProcessIds();
        let ready_to_start_ids = DeviceProcess.processesInState(Constants.PROCESS_STATES.ready_to_start);
        return registered_ids.filter((registered_id) => {
            return !ready_to_start_ids.includes(registered_id);
        }).length <= 0;
    }
    
    private allRegisteredDevicesAreReadyToFinish(): Boolean {
        let registered_ids = DeviceProcess.registeredProcessIds();
        let ready_to_finish_ids = DeviceProcess.processesInState(Constants.PROCESS_STATES.ready_to_finish);
        return registered_ids.filter((registered_id) => {
            return !ready_to_finish_ids.includes(registered_id);
        }).length <= 0;
    }
}