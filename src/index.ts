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

    const firstTest = async () => {
        try {
            await firstClient.url('https://www.google.com');
            await new Promise(r => setTimeout(r, 2000));
            await firstClient.writeSignal(secondProcess.id, 'signal1');
            await firstClient.readSignal('signal2');
            await firstClient.url('https://www.youtube.com');
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.log(error);
        } finally {            
            firstProcess.stop();
        }
    }

    const secondTest = async () => {
        try {
            await secondClient.readSignal('signal1');
            await secondClient.url('https://www.facebook.com');
            await new Promise(r => setTimeout(r, 2000));
            await secondClient.writeSignal(firstProcess.id, 'signal2');
            await secondClient.url('https://medium.com/');
            await new Promise(r => setTimeout(r, 2000));
        } catch (error) {
            console.log(error);
        } finally {
            secondProcess.stop();
        }
    }

    firstTest();
    secondTest();
})();
