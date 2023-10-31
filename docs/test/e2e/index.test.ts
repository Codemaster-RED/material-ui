# initPlaywright

This module initializes the Playwright library and contains utility functions and interfaces related to the Playwright library.

## Code Examples

### sleep(timeoutMS: number): Promise<void>

```javascript
import { sleep } from '../utils/initPlaywright';

async function example() {
  // Sleep for 1 second
  await sleep(1000);
  // Continue with code execution
}
```

This function `sleep` is used to introduce a delay in the code execution. It takes a `timeoutMS` parameter which represents the number of milliseconds to sleep for. It returns a Promise that resolves once the sleep period is over.

Example usage:

```javascript
const result = await sleep(500); // Sleep for 500 milliseconds
console.log("Code executed after 500 ms of delay");
```

### interface PlaywrightScreen

```javascript
import { PlaywrightScreen } from '../utils/initPlaywright';

const screen: PlaywrightScreen = {
  getByLabelText: (labelText, options) => {
    // Perform the necessary logic to get an element by label text
  },
  getByRole: (role, options) => {
    // Perform the necessary logic to get an element by role
  },
  getByText: (text, options) => {
    // Perform the necessary logic to get an element by text
  },
  getByTestId: (testId, options) => {
    // Perform the necessary logic to get an element by test ID
  },
};
```

This interface `PlaywrightScreen` defines a set of methods for interacting with elements in a Playwright screen. It contains the following methods:

- `getByLabelText`: Retrieves an element based on label text.
- `getByRole`: Retrieves an element based on role.
- `getByText`: Retrieves an element based on text.
- `getByTestId`: Retrieves an element based on test ID.

Each method takes appropriate parameters and performs the necessary logic to retrieve the desired element.

Example usage:

```javascript
const element = screen.getByLabelText("Username");
element.click(); // Clicks on the element with the label "Username"
```

### async function attemptGoto(page: playwright.Page, url: string): Promise<boolean>

```javascript
import { attemptGoto } from '../utils/initPlaywright';

async function example(page) {
  const url = 'http://example.com';
  
  // Attempt to navigate to the provided URL with retries
  const didNavigate = await attemptGoto(page, url);
  
  if (didNavigate) {
    console.log('Successfully navigated to', url);
  } else {
    console.log('Failed to navigate to', url);
  }
}
```

This asynchronous function `attemptGoto` is used to navigate to a URL with retries. It takes a Playwright page object and a URL string as parameters. It returns a Promise that resolves to a boolean indicating whether the navigation was successful or not.

Example usage:

```javascript
const page = /* Get Playwright page object */;
const url = 'http://example.com';
const didNavigate = await attemptGoto(page, url);

if (didNavigate) {
  console.log('Successfully navigated to', url);
} else {
  console.log('Failed to navigate to', url);
}
```

## Dependencies

Please make sure to install the required dependencies before using the functions and interfaces in this module.

- Chai: `npm install chai`
- Playwright: `npm install playwright`

## Flows

No complex flows detected in this module.