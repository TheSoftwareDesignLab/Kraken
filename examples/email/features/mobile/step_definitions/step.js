const { Given, When, Then } = require('@cucumber/cucumber');

When('I enter text {string}', async function (text) {
  try {
    await this.driver.keys(text);
  } catch { }
  return;
});

When('I click coordinates X equal to {int} and Y equal to {int}', async function(x, y) {
  return await this.driver.touchAction({ action: 'tap', x: x, y: y });
});

When('I press enter', async function() {
  return await this.driver.pressKeyCode(66);
});
