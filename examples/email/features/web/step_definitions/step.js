const { Given, When, Then } = require('@cucumber/cucumber');
const expect = require('chai').expect;

Then('I see that the post is not liked', async function () {
  let elements = await this.driver.$$("span[aria-label='See who reacted to this']");
  expect(elements.length).to.equal(0);
});

When('I enter email {string}', async function (email) {
  let element = await this.driver.$('input[type="email"]');
  return await element.setValue(email);
});

When('I enter password {string}', async function (password) {
  let element = await this.driver.$('input[type="password"]');
  return await element.setValue(password);
});

When('I click next', async function() {
  let element = await this.driver.$('button.VfPpkd-LgbsSe');
  return await element.click();
})

When('I click refresh emails', async function() {
  let element = await this.driver.$('.asf.T-I-J3.J-J5-Ji');
  return await element.click();
});

Then('I see email sent', async function () {
  let elements = await this.driver.$$("span[name='Kraken Test']");
  let emailWasReceived = elements.length > 0;
  expect(emailWasReceived).to.equal(true);
});