var { After, Before } = require('@cucumber/cucumber');
const { AndroidProcess } = require('../../../lib/processes/AndroidProcess');

Before(async function() {
  //console.log(this.deviceId);
  //this.deviceProcess = new AndroidProcess('emulator-5554');
  //this.driver = await this.deviceProcess.start();
})

After(async function () {
  //await this.deviceProcess.stop();
  return;
});
