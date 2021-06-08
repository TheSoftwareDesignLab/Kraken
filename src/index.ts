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

//const firstTest = async (client: any, process: any) => {    
//    await client.url('https://www.google.com');
//    await new Promise(r => setTimeout(r, 5000));
//
//    process.stop();
//}

//const secondTest = async (client: any, process: any) => {
//    await client.url('https://www.google.com');
//    await new Promise(r => setTimeout(r, 5000));
//
//    process.stop();
//}

//(async () => {
//    let firstProcess: WebClient = new WebClient('chrome');
//    let firstClient = await firstProcess.start();
//
//    let secondProcess: WebClient = new WebClient('chrome');
//    let secondClient = await secondProcess.start();
//
//    firstTest(firstClient, firstProcess);
//    secondTest(secondClient, secondProcess);
//})();
