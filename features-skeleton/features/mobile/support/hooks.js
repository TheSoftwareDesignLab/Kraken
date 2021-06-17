var { After, Before } = require('@cucumber/cucumber');
import { AndroidClient } from 'kraken-node';

Before(async function () {
  this.deviceClient = new AndroidClient(
    this.device.id,
    this.apkPath,
    this.apkPackage,
    this.apkLaunchActivity
  );
  this.driver = await this.deviceClient.startKrakenForUserId(this.userId);
})

After(async function () {
  await this.deviceClient.stopKrakenForUserId(this.userId);
});
