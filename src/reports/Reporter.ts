import { AndroidDevice } from "../devices/AndroidDevice";
import { Device } from "../devices/Device";
import { WebDevice } from "../devices/WebDevice";
import { TestScenario } from "../TestScenario";
import * as Constants from '../utils/Constants';
import { FileHelper } from '../utils/FileHelper';
import ejs from 'ejs';
import { DeviceProcess } from "../processes/DeviceProcess";
import { AndroidProcess } from "../processes/AndroidProcess";
import { WebProcess } from "../processes/WebProcess";
const { createHash } = require('crypto');

export class Reporter {
    testScenario: TestScenario;
    PASSED = 'passed'
    FAILED = 'failed'
    SKIPPED = 'skipped'
    PENDING = 'pending'
    NOT_DEFINED = 'undefined'
    AMBIGUOUS = 'ambiguous'

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

    private generateFeaturesReport(features: any, device: Device) {
        features.forEach((feature: any) => {
            this.generateFeatureReport(feature, device);
        });
    }

    private generateFeatureReport(feature: any, device: Device) {
        let data = {
            feature: feature,
            featurePassedScenariosPercentage: this.featurePassedScenariosPercentage.bind(this),
            featureFailedScenariosPercentage: this.featureFailedScenariosPercentage.bind(this),
            passedScenarios: this.passedScenarios.bind(this),
            failedScenarios: this.failedScenarios.bind(this),
            feature_duration: this.durationForFeature.bind(this),
            format_duration: this.formatDurationOfFeature.bind(this),
            PASSED: this.PASSED
        };
        let template = FileHelper.instance().contentOfFile(
            `${__dirname}/../../reporter/scenario_report.html.ejs`
        )
        let html = ejs.render(template, data);
        let folderName = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}/features_report/`;
        let fileName = `${folderName}${this.featureId(feature)}.html`;
        FileHelper.instance().createFolderIfDoesNotExist(folderName);
        FileHelper.instance().createFileIfDoesNotExist(fileName);
        FileHelper.instance().createFileIfDoesNotExist(fileName);
        FileHelper.instance().appendTextToFile(html, fileName);
    }

    private featureId(feature: any): any {
        return createHash('sha256').update(`${feature.id.trim()}${feature.uri.trim()}`).digest('hex');
    }

    private generateEachDeviceReport() {
        this.testScenario.processes.forEach((process: DeviceProcess, index: number) => {
            if (!process || !process.device) { return; }

            this.generateProcessReport(process, index + 1);
        });
    }

    private generateProcessReport(process: DeviceProcess, userId: number) {
        if (process instanceof AndroidProcess) {
            this.generateMobileReport(process, userId);
        } else if (process instanceof WebProcess) {
            this.generateWebReport(process, userId);
        } else {
            throw new Error('ERROR: Platform not supported');
        }
    }

    private generateMobileReport(process: DeviceProcess, userId: number) {
        let data = {
            apk_path: process.apkPath()
        }
        this.generateDeviceReport(data, process.device, userId)
    }

    private generateWebReport(process: DeviceProcess, userId: number) {    
        let data = {}
        this.generateDeviceReport(data, process.device, userId)
    }

    private generateDeviceReport(baseData: any, device: Device, userId: number) {
        let cucumberFile = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}/${Constants.FILE_REPORT_NAME}`;
        let features = JSON.parse(FileHelper.instance().contentOfFile(cucumberFile));
        let data = {
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
            format_duration: this.formatDurationOfFeature.bind(this),
            featureId: this.featureId.bind(this),
            ...baseData
        }
        let template = FileHelper.instance().contentOfFile(
            `${__dirname}/../../reporter/feature_report.html.ejs`
        )
        let html = ejs.render(template, data);
        let reportFilePath = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}/feature_report.html`;
        FileHelper.instance().createFileIfDoesNotExist(reportFilePath);
        FileHelper.instance().appendTextToFile(html, reportFilePath);
        this.generateFeaturesReport(features, device);
    }

    private generateGeneralReport() {
        let devicesReport = this.reportByDevices();
        let featuresReport = this.feturesFromReportByDevices(devicesReport);
        let dataHash = this.featureByNodesAndLinks(featuresReport);
        let dataPath: string = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/assets/js/${Constants.D3_DATA_FILE_NAME}`;
        FileHelper.instance().createFileIfDoesNotExist(dataPath);
        FileHelper.instance().appendTextToFile(
            JSON.stringify(dataHash), dataPath
        )
        let data = {
            devices: this.devicesHash(),
            featuresReport: featuresReport
        }
        let template = FileHelper.instance().contentOfFile(
            `${__dirname}/../../reporter/index.html.ejs`
        )
        let html = ejs.render(template, data);
        let reportFilePath = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/index.html`;
        FileHelper.instance().createFileIfDoesNotExist(reportFilePath);
        FileHelper.instance().appendTextToFile(html, reportFilePath);
    }

    private reportByDevices() {
        let devicesReport: any = {};
        this.devicesHash().forEach((device: any) => {
            let deviceReportFilePath = `${Constants.REPORT_PATH}/${this.testScenario.executionId}/${device.id}/${Constants.FILE_REPORT_NAME}`;
            if (!FileHelper.instance().pathExists(deviceReportFilePath)) {
                return;
            }

            let fileContent = FileHelper.instance().contentOfFile(deviceReportFilePath);
            devicesReport[device.user] = JSON.parse(fileContent);
            devicesReport[device.user].forEach((entry: any) => {
                if (entry.device_model == null || entry.device_model == undefined) {
                    entry.device_model = device.model;
                }

                if (entry.device_id == null || entry.device_id == undefined) {
                    entry.device_id = device.id;
                }
            });
        });
        return devicesReport;
    }

    private feturesFromReportByDevices(reportByDevices: any) {
        let features: any = {}
        Object.keys(reportByDevices).forEach((key: any) => {
            let report = reportByDevices[key];
            report.forEach((feature: any) => {
                if(features[feature.id] == null || features[feature.id] == undefined) {
                    features[feature.id] = {}
                }

                if((features[feature.id].name == null || features[feature.id].name == undefined) && feature.name) {
                    features[feature.id].name = feature.name
                }

                if(features[feature.id].devices == null || features[feature.id].devices == undefined) {
                    features[feature.id].devices = {}
                }

                if(feature.elements && feature.elements.length > 0) {
                    features[feature.id].devices[key] = []
                    if (feature.elements[0].steps != null || feature.elements[0].steps != undefined) {
                        let failed = false
                        feature.elements[0].steps.forEach((step: any) =>  {
                            if(failed) { return; }

                            failed = step.result.status != this.PASSED
                            let image = null;
                            if (step.embeddings != null && step.embeddings != undefined && step.embeddings.length > 0) {
                                image = step.embeddings[0].data
                            }
                            features[feature.id].devices[key].push({
                                name: `${step.keyword} ${step.name || ''}`,
                                duration: step.result.duration,
                                image: image,
                                device_model: feature.device_model,
                                status: failed ? this.FAILED : this.PASSED
                            });
                        });
                    }
                }
            });
        });
        return features;
    }

    private featureByNodesAndLinks(reportByDevices: any): any {
        let features: any = [];
        Object.keys(reportByDevices).forEach((key: any) => {
            let feature = reportByDevices[key];
            if(feature.devices != null && feature.devices != undefined) {
                features.push(
                    this.nodesAndLinks(feature.devices, feature.name)
                );
            }
        });
        return features;
    }

    private nodesAndLinks(featureReport: any, featureName: any): any {
        let lastNodeId = 0;
        let nodes = [{ name: "", id: "empty", image: null }];
        let signalHash: any = {};
        let links: any = [];
        Object.keys(featureReport).forEach((key: any) => {
            let steps = featureReport[key];
            let comingFromSignal = false;
            let lastSignal = -1;
            steps.forEach((step: any, index: number) => {
                let nodeId = lastNodeId + 1;

                if(this.isReadSignal(step.name) && step.status == this.PASSED) {
                    let signal = this.signalContent(step.name);
                    let alreadyCreatedSignal = signalHash[signal] ? true : false
                    signalHash[signal] = alreadyCreatedSignal ? signalHash[signal] : { id: `${nodeId}`, receiver: key }
                    let node = {
                        name: `Signal: ${signal}, Receiver: ${step.device_model}`,
                        id: signalHash[signal].id, image: null, status: step.status
                    }
                    if(alreadyCreatedSignal) {
                        let entry = nodes.filter((node: any) => {
                            return node.id == signalHash[signal].id
                        })[0];
                        if(entry != null || entry != undefined) {
                            entry.name = `Signal: ${signal}, Receiver: ${step.device_model}`
                        }
                    }
                    let source = (comingFromSignal ? lastSignal : (index == 0 ? 0 : lastNodeId))
                    let link = {
                        source: source,
                        target: parseInt(signalHash[signal].id),
                        value: 1,
                        owner: key,
                        owner_model: step.device_model
                    }
                    if(!alreadyCreatedSignal) {
                        nodes.push(node);
                        lastNodeId += 1;
                    }
                    links.push(link);
                    lastSignal = parseInt(signalHash[signal].id)
                    comingFromSignal = true
                } else if(this.isWriteSignal(step.name) && step.status == this.PASSED) {
                    let signal = this.signalContent(step.name);
                    let receiver = this.signalReceiver(step.name);
                    let alreadyCreatedSignal = signalHash[signal] ? true : false
                    signalHash[signal] = alreadyCreatedSignal ? signalHash[signal] : { id: `${nodeId}`, receiver: receiver }
                    let node = {
                        name: step.name, id: signalHash[signal].id,
                        image: null, status: step.status
                    }
                    let source = (comingFromSignal ? lastSignal : (index == 0 ? 0 : lastNodeId))
                    let link = {
                        source: source,
                        target: parseInt(signalHash[signal].id),
                        value: 1,
                        owner: key,
                        owner_model: step.device_model
                    }
                    if (!alreadyCreatedSignal) {
                        nodes.push(node);
                        lastNodeId += 1;
                    }
                    links.push(link);
                    lastSignal = parseInt(signalHash[signal].id)
                    comingFromSignal = true
                } else {
                    let node = {
                        name: step.name, id: `${nodeId}`,
                        image: step.image, status: step.status
                    }
                    let source = (comingFromSignal ? lastSignal : (index == 0 ? 0 : lastNodeId))
                    let link = {
                        source: source,
                        target: nodeId,
                        value: 1,
                        owner: key,
                        owner_model: step.device_model
                    }
                    nodes.push(node);
                    links.push(link);
                    lastNodeId += 1;
                    comingFromSignal = false
                }
            });
        });
        return {
            name: featureName,
            nodes: nodes,
            links: links
        };
    }

    private isReadSignal(step: String): boolean {
        return step.toLowerCase().indexOf("i send a signal to user") != -1;
    }

    private isWriteSignal(step: String): boolean {
        return step.toLowerCase().indexOf("i wait for a signal containing") != -1;
    }

    private signalContent(step: string): any {
        let found = step.match(/"([^\"]*)"/);
        if(found && found.length > 0) {
            return found[0].trim()
        }
        return null;
    }

    private signalReceiver(step: string): any {
        let found = step.match(/(\d+)/);
        if (found && found.length > 0) {
            return found[0].trim()
        }
        return null;
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

    private featurePassedScenariosPercentage(feature: any): number {
        return Math.round(
            (this.passedScenarios(feature).length / feature.elements.length)
        ) * 100.00;
    }

    private featureFailedScenariosPercentage(feature: any): number {
        return Math.round(
            (this.failedScenarios(feature).length / feature.elements.length)
        ) * 100.00;
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

    private passedScenarios(feature: any): any {
        let scenarios: any = feature.elements;
        return scenarios.filter((scenario: any) => {
            let allPassed: boolean = true;
            let steps = scenario.steps;
            steps.forEach((step: any) => {
                if(step.result && step.result.status != this.PASSED) {
                    allPassed = false;
                }
            });
            return allPassed;
        });
    }

    private failedScenarios(feature: any): any {
        let scenarios: any = feature.elements;
        return scenarios.filter((scenario: any) => {
            let allFailed: boolean = true;
            let steps = scenario.steps;
            steps.forEach((step: any) => {
                if (step.result && step.result.status == this.PASSED) {
                    allFailed = false;
                }
            });
            return allFailed;
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
