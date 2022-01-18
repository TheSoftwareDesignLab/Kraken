import { Given, When, Then } from '@cucumber/cucumber';
import { WebMonkey } from '../utils/WebMonkey';

When('I navigate to page {string}', async function (this: any, page: any) {
    return await this.driver.url(page);
});

When('I click view with selector {string}', async function (this: any, selector: any) {
    let element = await this.driver.$(selector);
    return await element.click();
});

When('I enter text {string}', async function (this: any, text: any) {
    return await this.driver.keys(text);
});

When('I click first view with selector {string}', async function (this: any, selector: any) {
    let elements = await this.driver.$$(selector);
    return await elements[0].click();
});

When('I start a monkey with {int} events', async function (this: any, numberOfEvents: any) {
    let monkey = new WebMonkey(this.driver);
    return await monkey.executeKrakenMonkey(numberOfEvents)
});