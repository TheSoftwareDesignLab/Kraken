import { Given, When, Then } from '@cucumber/cucumber';

When('I wait for 5 seconds', async function (this:any) {
    await new Promise(r => setTimeout(r, 5000));
    return
});