export class WebMonkey {
  driver: any;

  constructor(driver: any) {
    this.driver = driver;
  }

  async executeKrakenMonkey(numberOfEvents: number) {
    for(var i = 0; i < numberOfEvents; i++) {
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
    } catch {}
  }

  async randomClick() {
    let elements = await this.driver.$$('//*');
    const randomElement = elements[
      Math.floor(Math.random() * elements.length)
    ];
    await this.highlightElement(randomElement);
    await randomElement.click()
    return await this.removeElementHighlight(randomElement);
  }

  async insertRandomText() {
    let inputs = await this.driver.$$('//input');
    const randomInput = inputs[
      Math.floor(Math.random() * inputs.length)
    ];
    await this.highlightElement(randomInput);
    await randomInput.click()
    await this.driver.keys(this.randomText());
    return await this.removeElementHighlight(randomInput);
  }

  private async highlightElement(element: any) {
    return await this.driver.execute(
      "arguments[0].setAttribute('style', arguments[1]);",
      element,
      'color: red; border: 2px solid red'
    );
  }

  private async removeElementHighlight(element: any) {
    return await this.driver.execute(
      "arguments[0].setAttribute('style', arguments[1]);",
      element,
      ''
    );
  }

  private randomText(): String {
    let sampleText = ["afasf", "gfdsd"]
    return sampleText[
      Math.floor(Math.random() * sampleText.length)
    ];
  }
}