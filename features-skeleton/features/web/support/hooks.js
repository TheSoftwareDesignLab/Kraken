var { After, Before } = require('@cucumber/cucumber');
import { WebClient } from 'kraken-node';

Before(async function() {
  this.deviceClient = new WebClient('chrome');
  this.driver = await this.deviceClient.startKrakenForUserId(this.userId);
})

After(async function() {
  await this.deviceClient.stopKrakenForUserId(this.userId);
});
