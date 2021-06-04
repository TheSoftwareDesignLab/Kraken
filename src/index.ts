import { MobileClient } from './clients/MobileClient';
import { WebClient } from './clients/WebClient';

//(async () => {
//  let firstProcess: MobileClient = new MobileClient('93c6af52');
//  let firstClient = await firstProcess.start();
//
//  let secondProcess: MobileClient = new MobileClient('emulator-5554');
//  let secondClient = await secondProcess.start();
//
//  await new Promise(r => setTimeout(r, 5000));
//
//  firstProcess.stop();
//  secondProcess.stop();
//})();

(async () => {
    let firstProcess: WebClient = new WebClient('chrome');
    let firstClient = await firstProcess.start();
    await firstClient.url('https://www.google.com');
    await new Promise(r => setTimeout(r, 5000));
    firstProcess.stop();
})();