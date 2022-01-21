import faker from '@faker-js/faker';
import * as Constants from '../utils/Constants';
import { FileHelper } from './FileHelper';

export class KrakenFaker {
  private static singletonInstance: KrakenFaker;

  constructor() {}

  public static instance(): KrakenFaker {
    if (!KrakenFaker.singletonInstance) {
      KrakenFaker.singletonInstance = new KrakenFaker();
    }
    return KrakenFaker.singletonInstance;
  }

  generateValueForKey(key: string): string {
    let value = '';
    if(key.startsWith('$name')) {
      value = this.generateName();
    } else if(key.startsWith('$number')) {
      value = this.generateNumber();
    } else if(key.startsWith('$email')) {
      value = this.generateEmail();
    } else if(key.startsWith('$string')) {
      value = this.generateString();
    } else if(key.startsWith('$date')) {
      value = this.generateDate();
    } else if(key.startsWith('$url')) {
      value = this.generateUrl();
    } else {
      throw new Error(`ERROR: Faker key not supported.`);
    }
    this.saveKeyValueInDictionary(key, value)
    return value;
  }

  reuseValueForKey(key: string): string {
    let dictionary = this.dictionaryJson();
    let value = dictionary[key.substring(1)];
    if(value == null || value == undefined) {
      throw new Error(`ERROR: Key does not exist.`);
    }

    return value;
  }

  private dictionaryJson() {
    FileHelper.instance().createFileIfDoesNotExist(Constants.DICTIONARY_PATH);

    let fileContent = FileHelper.instance().contentOfFile(Constants.DICTIONARY_PATH) || '{}';
    return JSON.parse(fileContent);
  }

  private saveKeyValueInDictionary(key: string, value: any) {
    let dictionary = this.dictionaryJson();
    dictionary[key] = value;
    FileHelper.instance().writeTextToFile(
      JSON.stringify(dictionary), Constants.DICTIONARY_PATH
    );
  }

  private generateName(): string {
    return faker.name.firstName();
  }

  private generateNumber(): string {
    return `${faker.datatype.number()}`;
  }

  private generateEmail(): string {
    return faker.internet.email();
  }

  private generateString(): string {
    return faker.datatype.string();
  }

  private generateDate(): string {
    return faker.datatype.datetime({}).toDateString();
  }

  private generateUrl(): string {
    return faker.internet.url();
  }
 
  static stringIsAFaker(string: String): boolean {
    return string.startsWith("$");
  }

  static stringIsAFakerReuse(string: String): boolean {
    return string.startsWith("$$");
  }
}