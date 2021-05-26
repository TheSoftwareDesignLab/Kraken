import { AppiumProcess } from './processes/AppiumProcess';
import { FeatureReader } from './cucumber/FeatureReader';
var portfinder = require('portfinder');

//(async () => {
//  let firstProcess: AppiumProcess = new AppiumProcess('93c6af52');
//  let firstClient = await firstProcess.start();
//
//  let secondProcess: AppiumProcess = new AppiumProcess('emulator-5554');
//  let secondClient = await secondProcess.start();
//
//  await new Promise(r => setTimeout(r, 5000));
//
//  firstProcess.stop();
//  secondProcess.stop();
//})();

let algo: FeatureReader = FeatureReader.instance();
algo.getFeatureFiles();
