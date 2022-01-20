import faker from '@faker-js/faker';

export class KrakenFaker {
  constructor() {}

  static stringIsAFaker(string: String): boolean {
    return string.startsWith("$");
  }

  static stringIsAFakerReuse(string: String): boolean {
    return string.startsWith("$$");
  }
}