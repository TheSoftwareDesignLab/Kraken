import { Given, When, Then } from '@cucumber/cucumber';
import { ADB } from '../utils/ADB';

When('I click view with ID {kraken-string}', async function (this: any, id: any) {
    let view = await this.driver.$(`android=new UiSelector().resourceId("${id}")`)
    return await view.click();
});

When('I click view with xpath {kraken-string}', async function (this: any, xpath: any) {
    let view = await this.driver.$(xpath);
    return await view.click();
});

When('I start a monkey with {int} events', async function (this: any, events: any) {
    return ADB.instance().startMonkeyWithEvents(
        events, this.deviceClient.deviceId,
        this.deviceClient.appPackage
    )
});

When('I start kraken monkey with {int} events', async function (this: any, events: any) {
    return
});

When('I save device snapshot in file with path {kraken-string}', async function (this: any, path: any) {
    return
});