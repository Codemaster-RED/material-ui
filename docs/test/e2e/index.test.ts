# e2e.spec.ts

This file contains end-to-end tests using Playwright for UI automation.

## Dependencies

This module depends on the following external dependencies:
- chai
- playwright
- @testing-library/dom

To install these dependencies, run the following command:
```shell
npm install chai playwright @testing-library/dom
```

## Functions

### sleep(timeoutMS: number): Promise\<void\>

This function pauses the execution for the specified amount of time.

**Parameters:**

- timeoutMS (number) - The duration to wait in milliseconds.

**Returns:**

(Promise\<void\>) - A promise that resolves after the specified duration.

**Example:**

```javascript
await sleep(1000);
// Waits for 1 second before executing the next line.
```

### attemptGoto(page: playwright.Page, url: string): Promise\<boolean\>

This function attempts to navigate to a URL using the `page.goto` method with retries.

**Parameters:**

- page (playwright.Page) - The Playwright Page object.
- url (string) - The URL to navigate to.

**Returns:**

(Promise\<boolean\>) - A promise that resolves with a boolean indicating whether the navigation was successful.

**Example:**

```javascript
const didNavigate = await attemptGoto(page, 'https://www.example.com');
if (didNavigate) {
  // Navigation was successful.
} else {
  // Navigation failed after multiple attempts.
}
```

### renderFixture(fixturePath: string): Promise\<void\>

This function renders a fixture on the page and waits for the fixture to be ready.

**Parameters:**

- fixturePath (string) - The path to the fixture.

**Returns:**

(Promise\<void\>) - A promise that resolves when the fixture is ready.

**Example:**

```javascript
await renderFixture('FocusTrap/OpenFocusTrap');
// Renders the 'OpenFocusTrap' fixture and waits for it to be ready.
```

## Classes

### PlaywrightScreen

This interface represents a screen with Playwright-specific methods for interacting with elements.

**Methods:**

- getByLabelText(labelText: Matcher, options?: SelectorMatcherOptions): Promise\<ElementHandle\<HTMLElement\>\>
  - Gets an element by its label text using the `DomTestingLibrary.getByLabelText` method.
- getByRole(role: ByRoleMatcher, options?: ByRoleOptions): Promise\<ElementHandle\<HTMLElement\>\>
  - Gets an element by its role using the `DomTestingLibrary.getByRole` method.
- getByText(text: Matcher, options?: SelectorMatcherOptions): Promise\<ElementHandle\<HTMLElement\>\>
  - Gets an element by its text using the `DomTestingLibrary.getByText` method.
- getByTestId(testId: string, options?: MatcherOptions): Promise\<ElementHandle\<HTMLElement\>\>
  - Gets an element by its test ID using the `DomTestingLibrary.getByTestId` method.

## Test Cases

### <FocusTrap /> tests

#### should loop the tab key

This test case checks if the tab key loops through the focusable elements within the `<FocusTrap />` component.

**Example:**

```javascript
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
```

#### should loop the tab key after activation

This test case checks if the tab key loops through the focusable elements within the `<FocusTrap />` component after it has been activated.

**Example:**

```javascript
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
```

#### should focus on first focus element after last has received a tab click

This test case checks if the focus moves to the first focusable element within the `<FocusTrap />` component after the last focusable element has received a tab click.

**Example:**

```javascript
await renderFixture('FocusTrap/OpenFocusTrap');

await page.keyboard.press('Tab');
await expect(screen.getByText('x')).toHaveFocus();
await page.keyboard.press('Tab');
await expect(screen.getByText('cancel')).toHaveFocus();
await page.keyboard.press('Tab');
await expect(screen.getByText('ok')).toHaveFocus();
```

#### should be able to be tabbed straight through when rendered closed

This test case checks if the focus moves through the focusable elements within the `<FocusTrap />` component when it is rendered closed.

**Example:**

```javascript
await renderFixture('FocusTrap/ClosedFocusTrap');

await expect(screen.getByText('initial focus')).toHaveFocus();
await page.keyboard.press('Tab');
await expect(screen.getByText('inside focusable')).toHaveFocus();
await page.keyboard.press('Tab');
await expect(screen.getByText('final tab target')).toHaveFocus();
```

### <Rating /> tests

#### should loop the arrow key

This test case checks if the arrow keys loop through the rating options within the `<Rating />` component.

**Example:**

```javascript
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
```

### <Autocomplete /> tests

#### [Material Autocomplete] should highlight correct option when initial navigation through options starts from mouse move

This test case checks if the correct option is highlighted in a Material Autocomplete component when initial navigation through the options starts from a mouse move.

**Example:**

```javascript
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
```

#### [Joy Autocomplete] should highlight correct option when initial navigation through options starts from mouse move

This test case checks if the correct option is highlighted in a Joy Autocomplete component when initial navigation through the options starts from a mouse move.

**Example:**

```javascript
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
```

### <TextareaAutosize /> tests

#### should handle suspense without error

This test case checks if the `<TextareaAutosize />` component can handle suspense without throwing any errors.

**Example:**

```javascript
await renderFixture('TextareaAutosize/TextareaAutosizeSuspense');
expect(await page.isVisible('textarea')).to.equal(true);
await page.click('button');
expect(await page.isVisible('textarea')).to.equal(false);
await page.waitForTimeout(200); // Wait for debounce to fire (166)

expect(pageErrors.length).to.equal(0);
```

