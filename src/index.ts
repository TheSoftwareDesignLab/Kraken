import { MobileProcess } from './mobile/MobileProcess';
var portfinder = require('portfinder');

(async () => {
  let firstProcess: MobileProcess = new MobileProcess('93c6af52');
  let firstClient = await firstProcess.start();

  let secondProcess: MobileProcess = new MobileProcess('emulator-5554');
  let secondClient = await secondProcess.start();

  await new Promise(r => setTimeout(r, 5000));

  firstProcess.stop();
  secondProcess.stop();
})();
