const { Given, When, Then } = require('@cucumber/cucumber');
const expect = require('chai').expect;


When('I scroll to first post', async function () {
  return await this.driver.execute(() => {
    window.scroll(0, 500);
  });
});

When('I go to first post detail', async function () {
  await this.driver.refresh();
  await new Promise(r => setTimeout(r, 3000));
  let element = await this.driver.$('span:nth-child(2) > span > a > span');
  return await element.click();
});

When('I unlike the post', async function () {
  await this.driver.refresh();
  await new Promise(r => setTimeout(r, 3000));
  element = await this.driver.$("div[aria-label='Remove Like']");
  return await element.click();
});

Then('I see that the post is liked', async function() {
  let elements = await this.driver.$$("span[aria-label='See who reacted to this']");
  expect(elements.length).to.equal(1);
});

Then('I see that the post is not liked', async function () {
  let elements = await this.driver.$$("span[aria-label='See who reacted to this']");
  expect(elements.length).to.equal(0);
});