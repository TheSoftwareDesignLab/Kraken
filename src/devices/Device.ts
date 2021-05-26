const { randomBytes } = require('crypto');

export class Device {
  id: string;
  model: string;

  constructor(id: string, model: string) {
    this.id = id;
    this.model = model;
  }

  static generateRandomId(): string {
    return randomBytes(10).toString('hex');
  }
}
