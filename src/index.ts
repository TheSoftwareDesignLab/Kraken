import { AndroidClient } from './clients/AndroidClient';
import { WebClient } from './clients/WebClient';

//(async () => {
//    let firstProcess: AndroidClient = new AndroidClient('emulator-5554');
//    let firstClient = await firstProcess.start();
//
//    let secondProcess: WebClient = new WebClient('chrome');
//    let secondClient = await secondProcess.start();
//
//    await new Promise(r => setTimeout(r, 5000));
//
//    firstProcess.stop();
//    secondProcess.stop();
//})();

//(async () => {
//  let firstProcess: AndroidClient = new AndroidClient('93c6af52');
//  let firstClient = await firstProcess.start();
//
//  let secondProcess: AndroidClient = new AndroidClient('emulator-5554');
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

    let secondProcess: WebClient = new WebClient('chrome');
    let secondClient = await secondProcess.start();
    console.log(firstClient);
    const firstTest = async () => {
        await firstClient.url('https://www.google.com');
        await new Promise(r => setTimeout(r, 5000));

        firstProcess.stop();
    }

    const secondTest = async () => {
        await secondClient.url('https://www.google.com');
        await secondClient.writeSignal(firstProcess.id, 'signal1')
        await new Promise(r => setTimeout(r, 5000));
        //await secondClient.readSignal('signal1')

        secondProcess.stop();
    }

    firstTest();
    secondTest();
})();
