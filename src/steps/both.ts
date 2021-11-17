import { Given, When, Then, AfterStep } from '@cucumber/cucumber';
import { DeviceProcess } from '../processes/DeviceProcess';

When('I wait', async function (this:any) {
    await new Promise(r => setTimeout(r, 5000));
    return
});

When('I wait for {int} seconds', async function (this: any, seconds: any) {
    await new Promise(r => setTimeout(r, 1000 * seconds));
    return
});

When('I send a signal to user {int} containing {string}', async function (this: any, userId: any, signal: any) {
    await this.driver.writeSignal(userId, signal);
    return
});

When('I wait for a signal containing {string}', async function (this: any, signal: any) {
    await this.driver.readSignal(signal)
    return
});

When('I wait for a signal containing {string} for {int} seconds', async function (this: any, signal: any, seconds: any) {
    await this.driver.readSignal(signal, 1000 * seconds)
    return
});

AfterStep(async function (this: any, world: any) {
    let screenshot = await this.driver.saveScreenshot(
        `./reports/${this.testScenarioId}/screenshots/${Math.round(+new Date() / 1000)}.png`
    );
    this.attach(screenshot, 'image/png')
});