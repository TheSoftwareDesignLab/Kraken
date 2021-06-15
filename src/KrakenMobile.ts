import { TestScenario } from './TestScenario';
import { FeatureReader } from './cucumber/FeatureReader';
import { FeatureFile } from './cucumber/FeatureFile';

export class KrakenMobile {
  private scenariosQueue: TestScenario[];

  constructor() {
    this.scenariosQueue = [];
    this.buildScenariosQueue();
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
