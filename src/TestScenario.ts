import { FeatureFile } from './FeatureFile';

export class TestScenario {
  featureFile: FeatureFile;

  constructor(featureFile: FeatureFile) {
    this.featureFile = featureFile;
  }

  public run() {
    console.log('Running');
  }
}
