import { AndroidDevice } from "../devices/AndroidDevice";
import { Device } from "../devices/Device";
import { WebDevice } from "../devices/WebDevice";
import { TestScenario } from "../TestScenario";
import * as Constants from '../utils/Constants';
import { FileHelper } from '../utils/FileHelper';
import ejs from 'ejs';

export class Reporter {
    testScenario: TestScenario;
    PASSED = 'passed';

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
            if (!device) { return; }

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
        let cucumberFile = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}/${Constants.FILE_REPORT_NAME}`;
        let features = JSON.parse(FileHelper.instance().contentOfFile(cucumberFile));
        var data = {
            apk_path: null,
            features: features,
            total_scenarios: this.totalScenariosForFeatures(features),
            device: device, 
            total_failed_scenarios_percentage: this.totalFailedScenariosPercentageForFeatures(features),
            total_passed_scenarios_percentage: this.totalPassedScenariosPercentageForFeatures(features),
            total_passed_features_percentage: this.totalPassedFeaturesPercentageForFeatures(features),
            total_failed_features_percentage: this.totalFailedFeaturesPercentageForFeatures(features),
            total_passed_features: this.totalPassedFeaturesForFeatures(features),
            total_failed_features: this.totalFailedFeaturesForFeatures(features),
            total_passed_scenarios: this.totalPassedScenariosForFeatures(features),
            total_failed_scenarios: this.totalFailedScenariosForFeatures(features),
            feature_passed: this.featurePassed.bind(this),
            passed_scenarios: this.passedScenariosForFeature.bind(this),
            failed_scenarios: this.failedScenariosForFeature.bind(this),
            feature_duration: this.durationForFeature.bind(this),
            format_duration: this.formatDurationOfFeature.bind(this)
        }
        let template = FileHelper.instance().contentOfFile(
            `${__dirname}/../../reporter/feature_report.html.ejs`
        )
        let html = ejs.render(template, data);
        let reportFilePath = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}/feature_report.html`;
        FileHelper.instance().createFileIfDoesNotExist(reportFilePath);
        FileHelper.instance().appendTextToFile(html, reportFilePath);
    }

    private generateGeneralReport() {

    }

    private totalScenariosForFeatures(features: any): number {
        let count = 0;
        features.forEach((feature: any) => {
            let scenarios = feature.elements;
            if(scenarios) {
                count += scenarios.length;
            }
        });
        return count;
    }

    private totalPassedScenariosPercentageForFeatures(features: any): number {
        return parseFloat(
            (this.totalPassedScenariosForFeatures(features) / this.totalScenariosForFeatures(features)).toFixed(2)
        ) * 100.00;
    }

    private totalFailedScenariosPercentageForFeatures(features: any): number {
        return parseFloat(
            (this.totalFailedScenariosForFeatures(features) / this.totalScenariosForFeatures(features)).toFixed(2)
        ) * 100.00;
    }

    private totalPassedFeaturesPercentageForFeatures(features: any): number {
        return parseFloat(
            (this.totalPassedFeaturesForFeatures(features) / features.length).toFixed(2)
        ) * 100.00
    }

    private totalFailedFeaturesPercentageForFeatures(features: any): number {
        return parseFloat(
            (this.totalFailedFeaturesForFeatures(features) / features.length).toFixed(2)
        ) * 100.00
    }

    private totalPassedScenariosForFeatures(features: any): number {
        let count = 0;
        features.forEach((feature: any) => {
            count += this.passedScenariosForFeature(feature).length;
        });
        return count;
    }

    private totalFailedScenariosForFeatures(features: any): number {
        let count = 0;
        features.forEach((feature: any) => {
            count += this.failedScenariosForFeature(feature).length;
        });
        return count;
    }

    private totalPassedFeaturesForFeatures(features: any): number {
        let count = 0;
        features.forEach((feature: any) => {
            if (this.featurePassed(feature)) {
                count += 1;
            }
        });
        return count;
    }

    private totalFailedFeaturesForFeatures(features: any): number {
        let count = 0;
        features.forEach((feature: any) => {
            if (!this.featurePassed(feature)) {
                count += 1;
            }
        });
        return count;
    }

    private featurePassed(feature: any): boolean {
        return this.passedScenariosForFeature(feature).length == feature.elements.length;
    }

    private passedScenariosForFeature(feature: any): any {
        let scenarios = feature.elements;
        return scenarios.filter((scenario: any) => {
            let steps = scenario.steps;
            let allPassed = true;
            steps.forEach((step: any) => {
                if(step.result && step.result.status != 'passed') {
                    allPassed = false;
                }
            });
            return allPassed;
        });
    }

    private failedScenariosForFeature(feature: any): any {
        let scenarios = feature.elements;
        return scenarios.filter((scenario: any) => {
            let steps = scenario.steps;
            let allPassed = true;
            steps.forEach((step: any) => {
                if (step.result && step.result.status != 'passed') {
                    allPassed = false;
                }
            });
            return !allPassed;
        });
    }

    private durationForFeature(feature: any) {
        let scenarios = feature.elements;
        let duration = 0;
        scenarios.forEach((scenario: any) => {
            duration += this.durationForScenario(scenario);
        });
        return duration;
    }

    private durationForScenario(scenario: any) {
        let duration = 0;
        scenario.steps.forEach((step: any) => {
            if(step.result && step.result.duration) {
                duration += step.result.duration;
            }
        });
        return duration;
    }

    private formatDurationOfFeature(nanoseconds: number): string {
        let durationInSeconds = nanoseconds / 1000000000.0;
        let mod = durationInSeconds % 60;
        let div = Number(durationInSeconds / 60);
        return `${div.toFixed(0)}m ${mod.toFixed(3)}s`;
    }
}
