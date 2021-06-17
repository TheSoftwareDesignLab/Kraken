import { TestScenario } from './TestScenario';
import { FeatureReader } from './cucumber/FeatureReader';
import { FeatureFile } from './cucumber/FeatureFile';
import { FileHelper } from './utils/FileHelper';
import * as Constants from './utils/Constants';

export class KrakenMobile {
  private scenariosQueue: TestScenario[];

  constructor() {
    this.scenariosQueue = [];
    this.buildScenariosQueue();
    this.checkIfApkIsPresentIfRequired();
  }

  public start() {
    this.executeNextScenario();
  }

  private buildScenariosQueue() {
    let features: FeatureFile[] = FeatureReader.instance().getFeatureFiles();
    features.forEach((feature) => {
      this.scenariosQueue.push(
        new TestScenario(feature, this)
      );
    });
  }

  private checkIfApkIsPresentIfRequired() {
    if (!this.requiresMobileInfo()) { return; }

    if (!FileHelper.instance().pathExists(Constants.MOBILE_INFO_PATH)) {
      throw new Error(`ERROR: There is no ${Constants.MOBILE_INFO_PATH} file.`);
    }
    let mobileInfo = FileHelper.instance().contentOfFile(Constants.MOBILE_INFO_PATH);
    let mobileInfoJson = JSON.parse(mobileInfo);
    let apkPath = mobileInfoJson['apk_path'];
    if(!apkPath || !FileHelper.instance().pathExists(apkPath)) {
      throw new Error('ERROR: The specified APK path does not exist make sure the path is correct.');
    }

    if(!FileHelper.instance().isValidApk(apkPath)) {
      throw new Error(`ERROR: File ${apkPath} is not a valid APK.`);
    }
  }

  private requiresMobileInfo(): Boolean {
    return this.scenariosQueue.filter((scenario) => {
      return scenario.sampleMobileDevices().length > 0;
    }).length > 0;
  }

  onTestScenarioFinished() {
    this.executeNextScenario();
  }

  private executeNextScenario(): any {
    if(this.scenariosQueue.length <= 0) { return null; }

    let scenario: any = this.scenariosQueue.shift();
    if(!scenario) { return null; }

    scenario.run();
    return scenario;
  }
}
