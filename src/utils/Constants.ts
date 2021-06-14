type DynamicHash = {
    [index: string]: any
}

export const DIRECTORY_PATH = `${process.cwd()}/.device_directory`;
export const DICTIONARY_PATH = `${process.cwd()}/dictionary.json`;
export const PROCESS_STATES = {
    ready_to_start: 0,
    ready_to_finish: 1
};
export const DEVICES_READY_PATH = `${process.cwd()}/.devices_ready_to_start`;
export const DEVICES_FINISHED_PATH = `${process.cwd()}/.devices_ready_to_finish`;
export const INBOX_FILE_NAME = 'inbox.txt';
export const DEFAULT_TIMEOUT_MILLISECONDS = 10000;
export const SEPARATOR = ';';
export const DEFAULT_START_TIMEOUT_MILLISECONDS = 600000 // 10 minutes
export const DEFAULT_FINISH_TIMEOUT_SECONDS = 600000 // 10 minutes

let process_state_file_paths: DynamicHash = {};
process_state_file_paths[`${PROCESS_STATES.ready_to_start}`] = DEVICES_READY_PATH;
process_state_file_paths[`${PROCESS_STATES.ready_to_finish}`] = DEVICES_FINISHED_PATH;
export const PROCESS_STATE_FILE_PATH = process_state_file_paths;