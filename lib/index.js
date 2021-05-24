"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FeatureReader_1 = require("./FeatureReader");
var portfinder = require('portfinder');
//(async () => {
//  let firstProcess: MobileProcess = new MobileProcess('93c6af52');
//  let firstClient = await firstProcess.start();
//
//  let secondProcess: MobileProcess = new MobileProcess('emulator-5554');
//  let secondClient = await secondProcess.start();
//
//  await new Promise(r => setTimeout(r, 5000));
//
//  firstProcess.stop();
//  secondProcess.stop();
//})();
var algo = FeatureReader_1.FeatureReader.instance();
algo.getFeatureFiles();
//# sourceMappingURL=index.js.map