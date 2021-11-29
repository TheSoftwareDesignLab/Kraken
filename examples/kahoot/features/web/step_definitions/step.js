const { Given, When, Then } = require('@cucumber/cucumber');
const expect = require('chai').expect;

Then('I see that the post is not liked', async function () {
  let elements = await this.driver.$$("span[aria-label='See who reacted to this']");
  expect(elements.length).to.equal(0);
});

When('I go to login', async function () {
  let element = await this.driver.$('a[data-tracking-id="sign-in-top-bar"]');
  element.click();
});

When('I enter email {string}', async function (email) {
  let element = await this.driver.$('#username');
  return await element.setValue(email);
});

When('I enter password {string}', async function (password) {
  let element = await this.driver.$('#password');
  return await element.setValue(password);
});

When('I click login', async function () {
  let element = await this.driver.$('button[type="submit"]');
  return await element.click();
});

When('I go to test', async function() {
  let element = await this.driver.$('div[data-functional-selector="my-kahoot-module__662a267d-c95a-4662-8d4a-12a28b9ba169__kahoot-card_title"]');
  return await element.click();
});

When('I click play on test', async function() {
  let element = await this.driver.$('button[data-functional-selector="play-button"]');
  return await element.click();
});

When('I select teach mode', async function() {
  let element = await this.driver.$('button[data-functional-selector="play-kahoot-dialog__host-live-game"]');
  return await element.click();
});

When('I select classic mode', async function() {
  await this.driver.switchWindow(/play/)
  let element = await this.driver.$('button[data-functional-selector="launch-button"]');
  return await element.click();
});

When('I send game code to user {int}', async function (userId) {
  let codeParts = await this.driver.$$('div[data-functional-selector="game-pin"] > div > div');
  let codeStart = await codeParts[0].getText();
  let codeEnd = await codeParts[1].getText();
  let code = `${codeStart}${codeEnd}`;
  await this.driver.writeSignal(userId, code);
  return;
});

When('I click start', async function() {
  let element = await this.driver.$('button[data-functional-selector="start-button"]');
  return await element.click();
});

When('I click next', async function () {
  let element = await this.driver.$('button[data-functional-selector="next-button"]');
  return await element.click();
});