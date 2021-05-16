import { MobileProcess } from './mobile/MobileProcess';

(async () => {
  let firstProcess: MobileProcess = new MobileProcess('93c6af52', 4740);
  let firstClient = await firstProcess.start();

  //let secondProcess: MobileProcess = new MobileProcess('emulator-5554', 4728);
  //let secondClient = await secondProcess.start();

  await new Promise(r => setTimeout(r, 5000));

  firstProcess.stop();
  //secondProcess.stop();
})();
