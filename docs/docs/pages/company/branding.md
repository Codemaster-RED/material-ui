# documentation.md

## Introduction

This module provides the code for rendering the branding page on the website. It imports components from the `TopLayoutCareers` module and the `branding.md` page to display the page contents.

## Code Examples

```javascript
import * as React from 'react';
import TopLayoutCareers from 'docs/src/modules/components/TopLayoutCareers';
import * as pageProps from 'docs/src/pages/company/branding/branding.md?@mui/markdown';

export default function Page() {
  return <TopLayoutCareers {...pageProps} />;
}
```

## Function/Class Documentation

### Page

The `Page` component is the entry point for rendering the branding page. It imports the `TopLayoutCareers` component and the `branding.md` page to display the page contents.

#### Parameters

None.

#### Returns

React element - The rendered branding page.

#### Example

```javascript
import React from 'react';
import Page from './Page';

function App() {
  return (
    <div>
      <Page />
    </div>
  );
}
```

## Dependencies

The following dependencies are required for this module:

- `React`
- `TopLayoutCareers`
- `branding.md`

### Installation

```shell
npm install react
```
```shell
npm install docs/src/modules/components/TopLayoutCareers
```
```shell
npm install docs/src/pages/company/branding/branding.md?@mui/markdown
```

## Flows

There are no complex flows in this module.