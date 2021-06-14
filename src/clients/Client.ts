import { SignalingClient } from "./SignalingClient";
import * as Constants from '../utils/Constants';
import { FileHelper } from '../utils/FileHelper';

export abstract class Client extends SignalingClient {
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

    notifyProcessState(userId: Number, state: Number) {
        let filePath: string = Constants.PROCESS_STATE_FILE_PATH[`${state}`];
        FileHelper.instance().createFileIfDoesNotExist(filePath);
        FileHelper.instance().appendTextToFile(`${userId}`, filePath);
    }
}