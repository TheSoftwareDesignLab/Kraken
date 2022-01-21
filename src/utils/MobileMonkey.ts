import faker from '@faker-js/faker';

export class MobileMonkey {
  driver: any;

  constructor(driver: any) {
    this.driver = driver;
  }

  async executeKrakenMonkey(numberOfEvents: number) {
    for (var i = 0; i < numberOfEvents; i++) {
      await this.executeRandomAction();
    }
  }

  async executeRandomAction() {
    let randomActions = [
      this.randomClick.bind(this), this.insertRandomText.bind(this)
    ]
    const randomAction = randomActions[
      Math.floor(Math.random() * randomActions.length)
    ];
    try {
      await randomAction();
    } catch { }
  }

  async randomClick() {
    let elements = await this.driver.$$('//*');
    const randomElement = elements[
      Math.floor(Math.random() * elements.length)
    ];
    return await randomElement.click()
  }

  async insertRandomText() {
    let inputs = await this.driver.$$('//android.widget.EditText');
    const randomInput = inputs[
      Math.floor(Math.random() * inputs.length)
    ];
    await randomInput.click()
    return await this.driver.keys(faker.lorem.paragraph());
  }
}