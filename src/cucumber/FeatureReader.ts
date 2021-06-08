import { FileHelper } from '../utils/FileHelper';
import { FeatureFile } from './FeatureFile';

export class FeatureReader {
  private static singletonInstance: FeatureReader;
  private fileHelper: FileHelper;

  private constructor() {
    this.fileHelper = FileHelper.instance();
  }

  public static instance(): FeatureReader {
    if (!FeatureReader.singletonInstance) {
        FeatureReader.singletonInstance = new FeatureReader();
    }

    return FeatureReader.singletonInstance;
  }

  getFeatureFiles(): FeatureFile[] {
    let currentDirectoryPath = process.cwd();
    let expectedFeaturesPath = `${currentDirectoryPath}/features`;
    if (!this.fileHelper.pathExists(expectedFeaturesPath)) {
      throw new Error(
        `ERROR: File or directory ${expectedFeaturesPath} does not exist`
      );
    }

    let featuresInPath: string[] = this.fileHelper.featureFilesInPath(
      expectedFeaturesPath
    );
    return featuresInPath.map((featureFileName: string) => {
      return new FeatureFile(`${expectedFeaturesPath}/${featureFileName}`);
    });
  }
}
