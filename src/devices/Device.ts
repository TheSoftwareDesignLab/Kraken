const { randomBytes } = require('crypto');
import * as Constants from '../utils/Constants';

export abstract class Device {
  id: string;
  model: string;

  constructor(id: string, model: string) {
    this.id = id;
    this.model = model;
  }

  static generateRandomId(): string {
    return randomBytes(10).toString('hex');
  }

  toString(): string {
    return `${this.id}${Constants.SEPARATOR}${this.model}${Constants.SEPARATOR}${this.constructor.name}`
  }

  abstract screenSize(): { height: number, width: number };
  abstract sdkVersion(): number;
  abstract orientation(): number;
}
