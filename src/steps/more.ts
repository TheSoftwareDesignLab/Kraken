const { When, Then } = require('@cucumber/cucumber');
const { faker } = require('@faker-js/faker');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

/**
 * Recursively searches up the DOM tree to find the closest ancestor
 * that matches the given class selector (e.g., '.my-class').
 * 
 * @param {ElementHandle} element - The starting element.
 * @param {string} selector - The class selector to match (e.g., '.my-class').
 * @returns {Promise<ElementHandle|null>} - The matching ancestor element or null if not found.
 */
async function closest(element, selector) { 
    let parent = await element.$('..');
    while (parent && (await parent.getTagName()) !== 'html') {
        const classAttr = await parent.getAttribute('class');
        if (classAttr && classAttr.split(' ').includes(selector.replace('.', ''))) {
            return parent;
        }
        parent = await parent.$('..');
    }
    return null;
}

/**
 * Finds the first child element that matches the given selector.
 * 
 * @param {ElementHandle} element - The parent element.
 * @param {string} selector - The CSS selector to search for.
 * @returns {Promise<ElementHandle|null>} - The first matching child element or null if not found.
 */
async function find(element, selector) {
    const children = await element.$$(selector);
    if (children.length > 0) {
        return children[0];
    }
    return null;
}


/**
 * Step that simulates pressing special keys in the browser.
 * Receives the key name (e.g., Enter, Esc, Tab, ArrowDown, ArrowUp)
 * and converts that name into the key code understood by WebDriver.
 * Throws an error if the key is not supported.
 * Used to emulate keyboard interaction in end-to-end tests.
 */

When(
  "I press key {kraken-string}",
  async function (keyName) {
    const keyMap = {
      "Enter": "\uE007",
      "Esc": "\uE00C",
      "Escape": "\uE00C",
      "Tab": "\uE004",
      "ArrowDown": "\uE015",
      "ArrowUp": "\uE013"
    };

    const keyCode = keyMap[keyName];
    if (!keyCode) {
      throw new Error(`Tecla "${keyName}" no está soportada.`);
    }

    await this.driver.keys(keyCode);
  }
);

/**
 * Step to take a screenshot of the current page during the test.
 * The screenshot is saved to a path that depends on the version (VERSION env variable)
 * and the name of the feature being executed.
 * If the folder does not exist, it is created recursively.
 * Useful for visual evidence in test reports or for debugging.
 */

Then(
  "I take a screenshot",
  async function () {
    const version = process.env.VERSION || "default";
    const screenshotName = path.basename(this.featureLocation).split(".")[0];
    const nombreArchivo = `screenshots/${version}/${screenshotName}.png`;
    const dirPath = path.dirname(nombreArchivo);

    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Carpeta creada: ${dirPath}`);
    }

    await this.driver.saveScreenshot(nombreArchivo);
    console.log(`Screenshot guardado: ${nombreArchivo}`);
  }
);

/**
 * Step to verify that the current browser URL matches the expected URL.
 * Uses waitUntil with a 10-second timeout to wait for the URL to change.
 * Throws an error if it doesn’t match after the timeout.
 * Used to validate correct redirects or navigations in the application.
 */

Then(
  "I should be on the {kraken-string} page",
  async function (expectedUrl) {
    await this.driver.waitUntil(async () => {
      const currentUrl = await this.driver.getUrl();
      return currentUrl === expectedUrl;
    }, {
      timeout: 10000,
      timeoutMsg: `La URL no cambió a "${expectedUrl}" después de 10 segundos`,
    });

    const finalUrl = await this.driver.getUrl();
    assert.strictEqual(finalUrl, expectedUrl);
  }
);

/**
 * Step to click an element identified only by a CSS selector.
 * Waits for the element to be visible and clickable before clicking.
 * Useful for simple interactions with a known element.
 */

When("I click element {kraken-string}", async function (selector) {
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 5000 });
  await element.waitForClickable({ timeout: 5000 });
  await element.click();
});

/**
 * Step to click an element located inside a closest parent.
 * First gets the base element, then finds the nearest parent with the given selector.
 * Searches inside that parent for the element and clicks it.
 * Helps avoid ambiguity when elements have similar selectors.
 */

When("I click element {kraken-string} in closest parent {kraken-string}", async function (selector, parentSelector) {
  const baseElement = await this.driver.$(selector);
  const parentElement = await closest(baseElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${selector}"`);
  const element = await parentElement.$(selector);
  await element.waitForDisplayed({ timeout: 5000 });
  await element.waitForClickable({ timeout: 5000 });
  await element.click();
});

/**
 * Advanced step to click by starting from a child, finding the closest parent, 
 * and then locating the target selector within that parent.
 * Allows interaction with complex DOM structures where the target is not a direct child.
 * Ensures selector robustness by contextualizing it.
 */

When("I click element {kraken-string} in closest parent {kraken-string} with child {kraken-string}", async function (selector, parentSelector, childSelector) {
  const childElement = await this.driver.$(childSelector);
  await childElement.waitForDisplayed({ timeout: 10000 });

  const parentElement = await closest(childElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${childSelector}"`);

  const element = await find(parentElement, selector);
  assert.ok(element, `No se encontró el elemento "${selector}" dentro del padre "${parentSelector}"`);

  await element.waitForDisplayed({ timeout: 5000 });
  await element.waitForClickable({ timeout: 5000 });
  await element.click();
});

/**
 * Step to clear (empty) the content of an editable element (input, textarea).
 * Selects all text with Control + A and then deletes it with Backspace.
 * Used to prepare a field before entering new text.
 */

When("I clear element {kraken-string}", async function (selector) {
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 5000 });
  await element.click();
  await this.driver.keys(["Control", "a"]);
  await this.driver.keys("Backspace");
});

/**
 * Same as above, but clears an element located inside a closest parent.
 * Provides context to avoid errors due to generic or repeated selectors.
 */

When("I clear element {kraken-string} in closest parent {kraken-string}", async function (selector, parentSelector) {
  const baseElement = await this.driver.$(selector);
  const parentElement = await closest(baseElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${selector}"`);

  const element = await parentElement.$(selector);
  await element.waitForDisplayed({ timeout: 5000 });
  await element.click();
  await this.driver.keys(["Control", "a"]);
  await this.driver.keys("Backspace");
});

/**
 * Clears an element located inside a closest parent found starting from a child.
 * Useful in complex DOM structures to ensure the correct context for clearing the element.
 */

When("I clear element {kraken-string} in closest parent {kraken-string} with child {kraken-string}", async function (selector, parentSelector, childSelector) {
  const childElement = await this.driver.$(childSelector);
  await childElement.waitForDisplayed({ timeout: 10000 });

  const parentElement = await closest(childElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${childSelector}"`);

  const element = await find(parentElement, selector);
  assert.ok(element, `No se encontró el elemento "${selector}" dentro del padre "${parentSelector}"`);

  await element.waitForDisplayed({ timeout: 5000 });
  await element.click();
  await this.driver.keys(["Control", "a"]);
  await this.driver.keys("Backspace");
});


/**
 * Enters text into an editable element identified by a simple selector.
 * Clears the field before entering text to avoid unexpected concatenation.
 * Used to simulate data entry in forms.
 */

When("I enter {kraken-string} into element {kraken-string}", async function (text, childSelector) {
  const inputElement = await this.driver.$(childSelector);
  await inputElement.waitForDisplayed({ timeout: 5000 });
  await inputElement.click();
  await this.driver.keys(["Control", "a"]);
  await this.driver.keys("Backspace");
  await this.driver.keys(text);
});

/**
 * Same as above, but the input element is inside a closest parent.
 * Allows using more general or contextual selectors to avoid conflicts.
 */

When("I enter {kraken-string} into element {kraken-string} in closest parent {kraken-string}", async function (text, childSelector, parentSelector) {
  const baseElement = await this.driver.$(childSelector);
  const parentElement = await closest(baseElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${childSelector}"`);

  const inputElement = await parentElement.$(childSelector);
  await inputElement.waitForDisplayed({ timeout: 5000 });
  await inputElement.click();
  await this.driver.keys(["Control", "a"]);
  await this.driver.keys("Backspace");
  await this.driver.keys(text);
});

/**
 * Advanced version for entering text, starting from a child, finding a closest parent, 
 * and then locating the input element.
 * Used to handle more complex DOM structures with nested elements.
 */

When("I enter {kraken-string} into element {kraken-string} in closest parent {kraken-string} with child {kraken-string}", async function (text, childSelector, parentSelector, baseSelector) {
  const childElement = await this.driver.$(baseSelector);
  await childElement.waitForDisplayed({ timeout: 10000 });

  const parentElement = await closest(childElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${baseSelector}"`);

  const inputElement = await find(parentElement, childSelector);
  assert.ok(inputElement, `No se encontró el elemento "${childSelector}" dentro del padre "${parentSelector}"`);

  await inputElement.setValue(text);
});

/**
 * Verifies that expected text is contained within an element identified by a simple selector.
 * Uses waitUntil to wait up to 10 seconds for the text to appear.
 * Useful for validating messages, labels, visual states, etc.
 */

Then("I should see {kraken-string} in element {kraken-string}", async function (expectedText, elementSelector) {
  const targetElement = await this.driver.$(elementSelector);

  await this.driver.waitUntil(async () => {
    const text = await targetElement.getText();
    return text.includes(expectedText);
  }, {
    timeout: 10000,
    timeoutMsg: `El texto "${expectedText}" no apareció dentro del elemento "${elementSelector}"`,
  });

  const finalText = await targetElement.getText();
  console.log(`Texto final encontrado: "${finalText}"`);
  assert.ok(finalText.includes(expectedText), `No se encontró el texto "${expectedText}" en el elemento`);
});

/**
 * Same as above, but the element to verify is located inside a closest parent.
 * Helps validate content when there are duplicate elements or similar structures.
 */

Then("I should see {kraken-string} in element {kraken-string} in closest parent {kraken-string}", async function (expectedText, elementSelector, parentSelector) {
  const baseElement = await this.driver.$(elementSelector);
  const parentElement = await closest(baseElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${elementSelector}"`);

  const targetElement = await parentElement.$(elementSelector);

  await this.driver.waitUntil(async () => {
    const text = await targetElement.getText();
    return text.includes(expectedText);
  }, {
    timeout: 10000,
    timeoutMsg: `El texto "${expectedText}" no apareció dentro del elemento "${elementSelector}"`,
  });

  const finalText = await targetElement.getText();
  console.log(`Texto final encontrado: "${finalText}"`);
  assert.ok(finalText.includes(expectedText), `No se encontró el texto "${expectedText}" en el elemento`);
});

/**
 * Same as above, but the element to verify is located inside a closest parent starting from a child.
 * Helps validate content when there are duplicate elements or similar structures.
 */

Then("I should see {kraken-string} in element {kraken-string} in closest parent {kraken-string} with child {kraken-string}", async function (expectedText, elementSelector, parentSelector, childSelector) {
  const childElement = await this.driver.$(childSelector);
  await childElement.waitForDisplayed({ timeout: 10000 });

  const parentElement = await closest(childElement, parentSelector);
  assert.ok(parentElement, `No se encontró el padre "${parentSelector}" desde "${childSelector}"`);

  const targetElement = await find(parentElement, elementSelector);
  assert.ok(targetElement, `No se encontró el elemento "${elementSelector}" dentro del padre "${parentSelector}"`);

  await this.driver.waitUntil(async () => {
    const text = await targetElement.getText();
    return text.includes(expectedText);
  }, {
    timeout: 10000,
    timeoutMsg: `El texto "${expectedText}" no apareció dentro del elemento "${elementSelector}"`,
  });

  const finalText = await targetElement.getText();
  console.log(`Texto final encontrado: "${finalText}"`);
  assert.ok(finalText.includes(expectedText), `No se encontró el texto "${expectedText}" en el elemento`);
});

/**
 * Validación de un atributo sobre un elemento, caso aria...
 */
Then("I should see {kraken-string} in attribute {kraken-string} of element {kraken-string}", async function (expectedValue, attributeName, selector) {
  const element = await this.driver.$(selector);

  await this.driver.waitUntil(async () => {
    const attr = await element.getAttribute(attributeName);
    return attr && attr.includes(expectedValue);
  }, {
    timeout: 10000,
    timeoutMsg: `El valor "${expectedValue}" no apareció en el atributo "${attributeName}" del elemento "${selector}"`,
  });

  const finalAttr = await element.getAttribute(attributeName);
  console.log(`Valor final del atributo "${attributeName}": "${finalAttr}"`);
  assert.ok(finalAttr.includes(expectedValue), `Se esperaba que el atributo "${attributeName}" contuviera "${expectedValue}" pero fue "${finalAttr}"`);
});





