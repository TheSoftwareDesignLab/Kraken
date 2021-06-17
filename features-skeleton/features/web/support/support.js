const { setWorldConstructor, setDefaultTimeout } = require('@cucumber/cucumber');

class KrakenWorld {
  constructor(input) {
    let params = input.parameters;
    this.userId = params.id;
    this.device = params.device || {};
  }
}

setWorldConstructor(KrakenWorld);
setDefaultTimeout(30 * 1000);
