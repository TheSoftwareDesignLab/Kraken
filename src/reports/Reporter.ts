import { AndroidDevice } from "../devices/AndroidDevice";
import { Device } from "../devices/Device";
import { WebDevice } from "../devices/WebDevice";
import { TestScenario } from "../TestScenario";
import * as Constants from '../utils/Constants';
import { FileHelper } from '../utils/FileHelper';

export class Reporter {
    testScenario: TestScenario;

    constructor(testScenario: TestScenario) {
        this.testScenario = testScenario;
    }

    createReportFolderRequirements() {
        this.createReportExecutionReportFolder();
        this.createDevicesExecutionReportFolder();
        this.saveExecutionDevicesList();
    }

    saveReport() {
        this.generateEachDeviceReport();
        this.generateGeneralReport();
    }

    private createReportExecutionReportFolder() {
        FileHelper.instance().createFolderIfDoesNotExist(Constants.REPORT_PATH);
        FileHelper.instance().createFolderIfDoesNotExist(
            `${Constants.REPORT_PATH}/${this.testScenario.executionId}`
        );
        FileHelper.instance().createFolderIfDoesNotExist(this.screenshotPath());
        FileHelper.instance().copyFolderToPath(
            `${__dirname}/../../reporter/assets`,
            `${Constants.REPORT_PATH}/${this.testScenario.executionId}/assets`
        );
    }

    private createDevicesExecutionReportFolder() {
        this.testScenario.devices.forEach((device) => {
            if (!device) { return; }

            FileHelper.instance().createFolderIfDoesNotExist(
                `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}`
            )
        });
    }

    private saveExecutionDevicesList() {
        let devicesPath: string = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${Constants.DEVICES_REPORT_FILE_NAME}`;
        FileHelper.instance().createFileIfDoesNotExist(devicesPath);
        FileHelper.instance().appendTextToFile(
            JSON.stringify(this.devicesHash()), devicesPath
        )
    }

    private screenshotPath(): string {
        return `${Constants.REPORT_PATH}/${this.testScenario.executionId}/screenshots/`;
    }

    private devicesHash() {
        return this.testScenario.devices.filter((device: Device) => {
            return device != null || device != undefined;
        }).map((device: Device, index: number) => {
            let screenSize = device.screenSize();
            return {
                user: (index + 1), id: device.id,
                model: device.model, screen_height: screenSize.height,
                screen_width: screenSize.width, sdk: device.sdkVersion(),
                type: device.constructor.name
            }
        })
    }

    private generateEachDeviceReport() {
        this.testScenario.devices.forEach((device: Device, index: number) => {
            this.generateDeviceReport(device, index + 1);
        });
    }

    private generateDeviceReport(device: Device, userId: number) {
        if (device instanceof AndroidDevice) {
            this.generateMobileReport(device, userId);
        } else if (device instanceof WebDevice) {
            this.generateWebReport(device, userId);
        } else {
            throw new Error('ERROR: Platform not supported');
        }
    }

    private generateMobileReport(device: Device, userId: number) {

    }

    private generateWebReport(device: Device, userId: number) {

    }

    private generateGeneralReport() {

    }
}
