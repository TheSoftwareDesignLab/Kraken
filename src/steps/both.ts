import { Given, When, Then, AfterStep, defineParameterType, World } from '@cucumber/cucumber';
import { KrakenFaker } from '../utils/KrakenFaker';
import { PropertyManager } from '../utils/PropertyManager';

defineParameterType({
    regexp: /"([^"]*)"/,
    transformer: (string) => {
        var finalString = string;
        if (PropertyManager.stringIsAProperty(string)) {
            finalString = finalString.replace('<', '').replace('>', '');
            finalString = PropertyManager.instance().getProperty(finalString);
        } else if (KrakenFaker.stringIsAFaker(string)) {

        } else if (KrakenFaker.stringIsAFakerReuse(string)) {

        }

        return finalString;
    },
    name: "kraken-string",
    useForSnippets: false
});

When('I wait', async function (this:any) {
    await new Promise(r => setTimeout(r, 5000));
    return
});

When('I wait for {int} seconds', async function (this: any, seconds: any) {
    await new Promise(r => setTimeout(r, 1000 * seconds));
    return
});

When('I send a signal to user {int} containing {kraken-string}', async function (this: any, userId: any, signal: any) {
    await this.driver.writeSignal(userId, signal);
    return
});

When('I wait for a signal containing {kraken-string}', async function (this: any, signal: any) {
    await this.driver.readSignal(signal)
    return
});

When('I wait for a signal containing {kraken-string} for {int} seconds', async function (this: any, signal: any, seconds: any) {
    await this.driver.readSignal(signal, 1000 * seconds)
    return
});

AfterStep(async function (this: any, world: any) {
    try {
        let screenshot = await this.driver.saveScreenshot(
            `./reports/${this.testScenarioId}/screenshots/${Math.round(+new Date() / 1000)}.png`
        );
        this.attach(screenshot, 'image/png');
    } catch {
        console.log("KRAKEN: Could not take screenshot");
    }
    return;
});