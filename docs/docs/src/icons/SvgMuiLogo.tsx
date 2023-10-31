# SvgMuiLogo

This module exports a React component called `SvgMuiLogo` that renders an SVG representing a MUI logo.

## Usage

To use the `SvgMuiLogo` component, import it from the module like this:

```javascript
import SvgMuiLogo from 'path/to/SvgMuiLogo';
```

Then, use it in your React component's render method like this:

```javascript
render() {
  return (
    <SvgMuiLogo />
  );
}
```

## Dependencies

This module has the following external dependencies:

- React: Make sure you have React installed in your project. If not, you can install it by running the following command:

```bash
npm install react
```

## Code Example

Here's an example of how to use the `SvgMuiLogo` component:

```javascript
import React from 'react';
import SvgMuiLogo from 'path/to/SvgMuiLogo';

function App() {
  return (
    <div>
      <h1>Welcome to my app!</h1>
      <SvgMuiLogo />
    </div>
  );
}

export default App;
```

In this example, the `SvgMuiLogo` component is used inside a `div` element to render the logo in the app.

## Function/Class Documentation

### SvgMuiLogo(props: RootSvgProps)

This is the default function exported by the module. It is a React component that renders the MUI logo as an SVG.

**Parameters:**

- `props` (RootSvgProps) - An object containing the props to pass to the underlying `RootSvg` component.

**Returns:**

The rendered SVG element.

**Example:**

```javascript
import React from 'react';
import SvgMuiLogo from 'path/to/SvgMuiLogo';

function App() {
  return (
    <div>
      <h1>Welcome to my app!</h1>
      <SvgMuiLogo width={100} height={80} />
    </div>
  );
}

export default App;
```

In this example, the `SvgMuiLogo` component is used with custom `width` and `height` props to resize the logo.

### RootSvg

A component imported from `docs/src/icons/RootSvg` that provides the base SVG element to render the MUI logo.

This component is used internally by the `SvgMuiLogo` component and should not be used directly.

### RootSvgProps

An interface imported from `docs/src/icons/RootSvg` that defines the props accepted by the `RootSvg` component.

This interface is used by the `SvgMuiLogo` component to type-check the props passed to it.

No usage examples are provided for the `RootSvg` and `RootSvgProps` as they are not meant to be used directly.