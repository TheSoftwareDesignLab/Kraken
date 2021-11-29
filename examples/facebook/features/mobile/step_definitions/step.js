const { Given, When, Then } = require('@cucumber/cucumber');

When('I click email input', async function () {
  let view = await this.driver.$("//android.widget.EditText[@content-desc='Username']");
  return await view.click();
});

When('I click password input', async function () {
  let view = await this.driver.$("//android.widget.EditText[@content-desc='Password']");
  return await view.click();
});

When('I click login', async function () {
  let view = await this.driver.$("//android.view.ViewGroup[@content-desc='Log In']");
  return await view.click();
});

When('I skip contacts slide', async function () {
  let view = await this.driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.LinearLayout/android.widget.Button[1]");
  return await view.click();
});

When('I enter text {string}', async function (text) {
  try {
    await this.driver.keys(text);
  } catch {}
  return;
});

When('I click on whats on your mind input', async function () {
  try {
    let element = await this.driver.$("~Make a post on Facebook");
    await element.click();
  } catch { }
  return;
});

When('I enter text {string} for post', async function (text) {
  try {
    let el2 = await this.driver.$("/hierarchy/android.widget.FrameLayout/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.FrameLayout[1]/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.ScrollView/android.widget.LinearLayout/android.widget.FrameLayout/android.widget.FrameLayout/android.widget.EditText");
    await el2.click();
    await new Promise(r => setTimeout(r, 2000));
    await this.driver.keys(text);
    await el2.click();
    await this.driver.keys(text);
  } catch { }
  return;
});

When('I create post', async function () {
  try {
    let el3 = await this.driver.$("~POST");
    await el3.click();
  } catch { }
  return;
});

When('I like the post', async function () {
  let view = await this.driver.$("//android.widget.Button[@content-desc='Like button. Double tap and hold to react.']");
  return await view.click();
});
