type DynamicHash = {
    [index: string]: any
}

export const KRAKEN_DIRECTORY = `.kraken`;
export const DIRECTORY_PATH = `${process.cwd()}/${KRAKEN_DIRECTORY}/.device_directory`;
export const DICTIONARY_PATH = `${process.cwd()}/${KRAKEN_DIRECTORY}/dictionary.json`;
export const PROCESS_STATES = {
    ready_to_start: 0,
    ready_to_finish: 1,
    finished: 2
};
export const DEVICES_READY_START_PATH = `${process.cwd()}/${KRAKEN_DIRECTORY}/.devices_ready_to_start`;
export const DEVICES_READY_FINISH_PATH = `${process.cwd()}/${KRAKEN_DIRECTORY}/.devices_ready_to_finish`;
export const DEVICES_FINISHED_PATH = `${process.cwd()}/${KRAKEN_DIRECTORY}/.devices_finished`;
export const INBOX_FILE_NAME = 'inbox.txt';
export const DEFAULT_TIMEOUT_MILLISECONDS = 10000;
export const SEPARATOR = ';';
export const DEFAULT_PROCESS_START_TIMEOUT_MILLISECONDS = 600000 // 10 minutes
export const DEFAULT_PROCESS_FINISH_TIMEOUT_SECONDS = 600000 // 10 minutes
export const DEFAULT_PROCESS_TIMEOUT_SECONDS = 600000 // 10 minutes
export const MOBILE_INFO_PATH = `${process.cwd()}/mobile.json`;
export const REPORT_PATH = `${process.cwd()}/reports`;
export const DEVICES_REPORT_FILE_NAME = 'devices.json';
export const ANDROID_PORTRAIT = 0;
export const ANDROID_LANDSCAPE = 1;
export const WEB_PORTRAIT = 0;
export const FILE_REPORT_NAME = 'report.json';

let process_state_file_paths: DynamicHash = {};
process_state_file_paths[`${PROCESS_STATES.ready_to_start}`] = DEVICES_READY_START_PATH;
process_state_file_paths[`${PROCESS_STATES.ready_to_finish}`] = DEVICES_READY_FINISH_PATH;
process_state_file_paths[`${PROCESS_STATES.finished}`] = DEVICES_FINISHED_PATH;
export const PROCESS_STATE_FILE_PATH = process_state_file_paths;