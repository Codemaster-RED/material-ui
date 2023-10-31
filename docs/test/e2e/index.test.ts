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

## Dependencies

- Please make sure to install the required dependencies before using the functions and interfaces in this module.

  - Chai: `npm install chai`
  - Playwright: `npm install playwright`

## Flows

No complex flows detected in this module.