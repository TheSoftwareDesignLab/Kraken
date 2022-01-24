import { Given, When, Then } from '@cucumber/cucumber';
import { ADB } from '../utils/ADB';
import { FileHelper } from '../utils/FileHelper';
import { MobileMonkey } from '../utils/MobileMonkey';

When('I click view with ID {kraken-string}', async function (this: any, id: any) {
    let view = await this.driver.$(`android=new UiSelector().resourceId("${id}")`)
    return await view.click();
});

When('I click view with xpath {kraken-string}', async function (this: any, xpath: any) {
    let view = await this.driver.$(xpath);
    return await view.click();
});

When('I start a monkey with {int} events', async function (this: any, numberOfEvents: any) {
    return ADB.instance().startMonkeyWithEvents(
        numberOfEvents, this.deviceClient.deviceId,
        this.deviceClient.appPackage
    );
});

When('I start kraken monkey with {int} events', async function (this: any, numberOfEvents: any) {
    let monkey = new MobileMonkey(this.driver);
    return await monkey.executeKrakenMonkey(numberOfEvents);
});

When('I save device snapshot in file with path {kraken-string}', async function (this: any, path: any) {
    return ADB.instance().saveSnapshotInFilePath(
        this.deviceClient.deviceId, path
    );
});