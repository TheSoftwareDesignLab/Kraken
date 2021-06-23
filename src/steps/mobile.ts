import { Given, When, Then } from '@cucumber/cucumber';

When('I click view with ID {string}', async function (this: any, id: any) {
    let view = await this.driver.$(`android=new UiSelector().resourceId("${id}")`)
    return await view.click();
});

When('I click view with xpath {string}', async function (this: any, xpath: any) {
    let view = await this.driver.$(xpath);
    return await view.click();
});

