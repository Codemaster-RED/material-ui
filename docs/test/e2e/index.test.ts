# index.ts Documentation

The `index.ts` file contains code related to end-to-end testing using playwright for a specific application. This documentation will cover the purpose of each function, their parameters, and return values, as well as provide examples of how to use them.

## Code Examples

Here are some code examples to showcase how to use the functions defined in the `index.ts` file:

```javascript
import { expect } from 'chai';
import * as playwright from 'playwright';
// Import necessary types for matching
import type {
  ByRoleMatcher,
  ByRoleOptions,
  Matcher,
  MatcherOptions,
  SelectorMatcherOptions,
} from '@testing-library/dom';
import '../utils/initPlaywrightMatchers';

/**
 * A function to pause execution for a specified amount of time.
 *
 * @param timeoutMS - The number of milliseconds to pause execution.
 * @returns Promise<void>
 */
function sleep(timeoutMS: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), timeoutMS);
  });
}

/**
 * Interface representing a Playwright screen object.
 */
interface PlaywrightScreen {
  getByLabelText: (
    labelText: Matcher,
    options?: SelectorMatcherOptions,
  ) => Promise<playwright.ElementHandle<HTMLElement>>;
  getByRole: (
    role: ByRoleMatcher,
    options?: ByRoleOptions,
  ) => Promise<playwright.ElementHandle<HTMLElement>>;
  getByTestId: (
    testId: string,
    options?: MatcherOptions,
  ) => Promise<playwright.ElementHandle<HTMLElement>>;
  getByText: (
    text: Matcher,
    options?: SelectorMatcherOptions,
  ) => Promise<playwright.ElementHandle<HTMLElement>>;
}

/**
 * Attempts to navigate to a URL with retries.
 *
 * @param page - The Playwright page object.
 * @param url - The URL to navigate to.
 * @returns Promise<boolean>
 */
async function attemptGoto(page: playwright.Page, url: string): Promise<boolean> {
  const maxAttempts = 10;
  const retryTimeoutMS = 250;

  let didNavigate = false;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await page.goto(url);
      didNavigate = true;
    } catch (error) {
      await sleep(retryTimeoutMS);
    }
  }

  return didNavigate;
}

describe('e2e', () => {
  const baseUrl = 'http://localhost:5001';
  let browser: playwright.Browser;
  let page: playwright.Page;
  const screen: PlaywrightScreen = {
    getByLabelText: (...inputArgs) => {
      return page.evaluateHandle(
        (args) => window.DomTestingLibrary.getByLabelText(document.body, ...args),
        inputArgs,
      );
    },
    getByRole: (...inputArgs) => {
      return page.evaluateHandle(
        (args) => window.DomTestingLibrary.getByRole(document.body, ...args),
        inputArgs,
      );
    },
    getByText: (...inputArgs) => {
      return page.evaluateHandle(
        (args) => window.DomTestingLibrary.getByText(document.body, ...args),
        inputArgs,
      );
    },
    getByTestId: (...inputArgs) => {
      return page.evaluateHandle(
        (args) => window.DomTestingLibrary.getByTestId(document.body, ...args),
        inputArgs,
      );
    },
  };

  async function renderFixture(fixturePath: string) {
    await page.goto(`${baseUrl}/e2e/${fixturePath}#no-dev`);
    await page.waitForSelector('[data-testid="testcase"]:not([aria-busy="true"])');
  }

  before(async function beforeHook() {
    this.timeout(20000);

    // Launch the browser and create a new page
    browser = await playwright.chromium.launch({
      headless: true,
    });
    page = await browser.newPage();
    const isServerRunning = await attemptGoto(page, `${baseUrl}#no-dev`);
    if (!isServerRunning) {
      throw new Error(
        `Unable to navigate to ${baseUrl} after multiple attempts. Did you forget to run \`yarn test:e2e:server\` and \`yarn test:e2e:build\`?`,
      );
    }
  });

  after(async () => {
    // Close the browser
    await browser.close();
  });

  describe('<FocusTrap />', () => {
    it('should loop the tab key', async () => {
      await renderFixture('FocusTrap/OpenFocusTrap');

      await expect(screen.getByTestId('root')).toHaveFocus();

      await page.keyboard.press('Tab');
      await expect(screen.getByText('x')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('cancel')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('ok')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('x')).toHaveFocus();

      await screen.getByTestId('initial-focus').then(($element) => $element.focus());
      await expect(screen.getByTestId('root')).toHaveFocus();
      await screen.getByText('x').then(($element) => $element.focus());
      await page.keyboard.press('Shift+Tab');
      await expect(screen.getByText('ok')).toHaveFocus();
    });

    it('should loop the tab key after activation', async () => {
      await renderFixture('FocusTrap/DefaultOpenLazyFocusTrap');

      await expect(screen.getByTestId('initial-focus')).toHaveFocus();

      await page.keyboard.press('Tab');
      await expect(screen.getByText('close')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('noop')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('close')).toHaveFocus();
      await page.keyboard.press('Enter');
      await expect(screen.getByTestId('initial-focus')).toHaveFocus();
    });

    it('should focus on first focus element after last has received a tab click', async () => {
      await renderFixture('FocusTrap/OpenFocusTrap');

      await page.keyboard.press('Tab');
      await expect(screen.getByText('x')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('cancel')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('ok')).toHaveFocus();
    });

    it('should be able to be tabbed straight through when rendered closed', async () => {
      await renderFixture('FocusTrap/ClosedFocusTrap');

      await expect(screen.getByText('initial focus')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('inside focusable')).toHaveFocus();
      await page.keyboard.press('Tab');
      await expect(screen.getByText('final tab target')).toHaveFocus();
    });
  });

  describe('<Rating />', () => {
    it('should loop the arrow key', async () => {
      await renderFixture('Rating/BasicRating');

      await page.focus('input[name="rating-test"]:checked');
      await expect(page.evaluateHandle(() => document.activeElement)).toHaveAttribute('value', '1');
      await page.keyboard.press('ArrowLeft');
      await expect(page.evaluateHandle(() => document.activeElement)).to.toHaveAttribute(
        'value',
        '',
      );
      await page.keyboard.press('ArrowLeft');
      await expect(page.evaluateHandle(() => document.activeElement)).to.toHaveAttribute(
        'value',
        '5',
      );
    });
  });

  describe('<Autocomplete/>', () => {
    it('[Material Autocomplete] should highlight correct option when initial navigation through options starts from mouse move', async () => {
      await renderFixture('Autocomplete/HoverMaterialAutocomplete');

      const combobox = (await screen.getByRole('combobox'))!;
      await combobox.click();

      const firstOption = (await screen.getByText('one'))!;

      const dimensions = (await firstOption.boundingBox())!;

      await page.mouse.move(dimensions.x + 10, dimensions.y + 10); // moves to 1st option
      await page.keyboard.down('ArrowDown'); // moves to 2nd option
      await page.keyboard.down('ArrowDown'); // moves to 3rd option
      await page.keyboard.down('ArrowDown'); // moves to 4th option

      const listbox = (await screen.getByRole('listbox'))!;
      const focusedOption = (await listbox.$('.Mui-focused'))!;
      const focusedOptionText = await focusedOption.innerHTML();

      expect(focusedOptionText).to.equal('four');
    });

    it('[Joy Autocomplete] should highlight correct option when initial navigation through options starts from mouse move', async () => {
      await renderFixture('Autocomplete/HoverJoyAutocomplete');

      const combobox = (await screen.getByRole('combobox'))!;
      await combobox.click();

      const firstOption = (await screen.getByText('one'))!;

      const dimensions = (await firstOption.boundingBox())!;

      await page.mouse.move(dimensions.x + 10, dimensions.y + 10); // moves to 1st option
      await page.keyboard.down('ArrowDown'); // moves to 2nd option
      await page.keyboard.down('ArrowDown'); // moves to 3rd option
      await page.keyboard.down('ArrowDown'); // moves to 4th option

      const listbox = (await screen.getByRole('listbox'))!;
      const focusedOption = (await listbox.$('.Mui-focused'))!;
      const focusedOptionText = await focusedOption.innerHTML();

      expect(focusedOptionText).to.equal('four');
    });
  });

  describe('<TextareaAutosize />', () => {
    // https://github.com/mui/material-ui/issues/32640
    it('should handle suspense without error', async () => {
      const pageErrors: string[] = [];
      page.on('pageerror', (err) => pageErrors.push(err.name));

      await renderFixture('TextareaAutosize/TextareaAutosizeSuspense');
      expect(await page.isVisible('textarea')).to.equal(true);
      await page.click('button');
      expect(await page.isVisible('textarea')).to.equal(false);
      await page.waitForTimeout(200); // Wait for debounce to fire (166)

      expect(pageErrors.length).to.equal(0);
    });
  });
});
```

## Function Documentation

### sleep(timeoutMS: number)

A function to pause execution for a specified amount of time.

**Parameters:**

- `timeoutMS` (number) - The number of milliseconds to pause execution.

**Returns:**

- `Promise<void>`

**Example:**

```javascript
const timeout = 2000; // 2 seconds
await sleep(timeout);
// Pauses execution for 2 seconds
```

### attemptGoto(page: playwright.Page, url: string)

Attempts to navigate to a URL with retries.

**Parameters:**

- `page` (playwright.Page) - The Playwright page object.
- `url` (string) - The URL to navigate to.

**Returns:**

- `Promise<boolean>`

**Example:**

```javascript
const page = await browser.newPage();
const url = 'https://www.example.com';
const isNavigated = await attemptGoto(page, url);
// Navigates to "https://www.example.com" and returns whether navigation was successful
```

### renderFixture(fixturePath: string)

Renders a fixture by navigating to the specified path.

**Parameters:**

- `fixturePath` (string) - The path of the fixture.

**Example:**

```javascript
const fixturePath = 'FocusTrap/OpenFocusTrap';
await renderFixture(fixturePath);
// Renders the fixture "FocusTrap/OpenFocusTrap"
```

## Dependencies

This code requires the following external dependencies:

- `chai`: The chai library for assertions.
- `playwright`: The playwright library for browser automation.

To install these dependencies, run the following command:

```
npm install chai playwright
```

## Flows

There are no complex flow diagrams in this code.