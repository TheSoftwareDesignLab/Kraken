var { After, Before } = require('@cucumber/cucumber');
const { MobileProcess } = require('../../../lib/processes/MobileProcess');

Before(async function() {
  //console.log(this.deviceId);
  //this.deviceProcess = new MobileProcess('emulator-5554');
  //this.driver = await this.deviceProcess.start();
})

After(async function () {
  //await this.deviceProcess.stop();
  return;
});
