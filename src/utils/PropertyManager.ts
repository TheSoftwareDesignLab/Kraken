import { FileHelper } from "./FileHelper";
import * as Constants from '../utils/Constants';

export class PropertyManager {
  private static singletonInstance: PropertyManager;

  constructor() { }

  public static instance(): PropertyManager {
    if (!PropertyManager.singletonInstance) {
      PropertyManager.singletonInstance = new PropertyManager();
    }
    return PropertyManager.singletonInstance;
  }

  static stringIsAProperty(string: String): boolean {
    return string.startsWith("<") && string.endsWith(">");
  }

  getProperty(property: string) {
    var properties: any = {};
    properties = this.allUserProperties();
    let foundProperty = properties[property];
    if (foundProperty == null || foundProperty == undefined) {
      throw new Error(`ERROR: There is no property ${property}.`);
    }
    return foundProperty;
  }

  private allUserProperties(): any {
    if (!FileHelper.instance().pathExists(Constants.PROPERTIES_PATH)) {
      throw new Error(`ERROR: There is no ${Constants.PROPERTIES_PATH} file.`);
    }

    let fileContent = FileHelper.instance().contentOfFile(Constants.PROPERTIES_PATH);
    return JSON.parse(fileContent)
  }
}