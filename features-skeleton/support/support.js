const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');

class KrakenWorld {
  constructor(input) {
    let params = input.parameters;
    this.deviceId = params.device_id;
  }
}

setWorldConstructor(KrakenWorld);
setDefaultTimeout(30 * 1000);
