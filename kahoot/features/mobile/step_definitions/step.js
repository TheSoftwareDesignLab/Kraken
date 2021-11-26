const { Given, When, Then } = require('@cucumber/cucumber');

When('I click next into button', async function () {
  let view = await this.driver.$(`android=new UiSelector().resourceId("${id}")`)
  return await view.click();
});

When('I click password input', async function () {
  let view = await this.driver.$("//android.widget.EditText[@content-desc='Password']");
  return await view.click();
});

When('I enter text {string}', async function (text) {
  try {
    await this.driver.keys(text);
  } catch { }
  return;
});

When('I enter game code', async function () {
  const waitUntil = (condition) => {
    return new Promise((resolve) => {
      let interval = setInterval(() => {
        if (condition()) {
          return
        }

        clearInterval(interval)
        resolve()
      }, 2000)
    })
  };
  await waitUntil(() => {
    let signal = this.driver.lastSignal();
    return signal == null || signal == undefined || signal.trim() == "";
  });

  let code = this.driver.lastSignal();
  try {
    await this.driver.keys(code);
  } catch { }
  return;
});