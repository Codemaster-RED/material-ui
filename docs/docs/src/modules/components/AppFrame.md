# AppFrame.js

This module represents the main application frame component.

## Code Examples

### NextNProgressBar()
```javascript
import { useRouter } from 'next/router';
import NProgressBar from '@mui/docs/NProgressBar';

export function NextNProgressBar() {
  const router = useRouter();

  React.useEffect(() => {
    const handleRouteChangeStart = (url, { shallow }) => {
      if (!shallow) {
        NProgress.start();
      }
    };

    const handleRouteChangeDone = (url, { shallow }) => {
      if (!shallow) {
        NProgress.done();
      }
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeDone);
    router.events.on('routeChangeError', handleRouteChangeDone);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeDone);
      router.events.off('routeChangeError', handleRouteChangeDone);
    };
  }, [router]);

  return <NProgressBar />;
}
```

### DeferredAppSearch()
```javascript
import React from 'react';
import Box from '@mui/material/Box';

export function DeferredAppSearch() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <React.Fragment>
      {/* Suspense isn't supported for SSR yet */}
      {mounted ? (
        <React.Suspense fallback={<Box sx={{ minWidth: { sm: 200 } }} />}>
          <AppSearch />
        </React.Suspense>
      ) : (
        <Box sx={{ minWidth: { sm: 200 } }} />
      )}
    </React.Fragment>
  );
}
```

### AppFrame()
```javascript
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import SvgHamburgerMenu from 'docs/src/icons/SvgHamburgerMenu';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import SettingsIcon from '@mui/icons-material/SettingsOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import NProgressBar from '@mui/docs/NProgressBar';
import AppNavDrawer from 'docs/src/modules/components/AppNavDrawer';
import AppSettingsDrawer from 'docs/src/modules/components/AppSettingsDrawer';
import Notifications from 'docs/src/modules/components/Notifications';
import MarkdownLinks from 'docs/src/modules/components/MarkdownLinks';
import SkipLink from 'docs/src/modules/components/SkipLink';
import PageContext from 'docs/src/modules/components/PageContext';
import { useTranslate } from 'docs/src/modules/utils/i18n';
import { debounce } from '@mui/material/utils';
import NextLink from 'next/link';
import SvgMuiLogo from 'docs/src/icons/SvgMuiLogo';
import AppFrameBanner from 'docs/src/components/banner/AppFrameBanner';

const nProgressStart = debounce(() => {
  NProgress.start();
}, 200);

const nProgressDone = () => {
  nProgressStart.clear();
  NProgress.done();
};

const RootDiv = styled('div')(({ theme }) => {
  return {
    display: 'flex',
    ...theme.applyDarkStyles({
      background: (theme.vars || theme).palette.primaryDark[900],
    }),
    // TODO: Should be handled by the main component
  };
});

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'disablePermanent',
})(({ disablePermanent, theme }) => {
  return {
    padding: theme.spacing(1, 2),
    transition: theme.transitions.create('width'),
    ...(disablePermanent && {
      boxShadow: 'none',
    }),
    ...(!disablePermanent && {
      [theme.breakpoints.up('lg')]: {
        width: 'calc(100% - var(--MuiDocs-navDrawer-width))',
      },
    }),
    boxShadow: 'none',
    backdropFilter: 'blur(8px)',
    borderStyle: 'solid',
    borderColor: (theme.vars || theme).palette.grey[100],
    borderWidth: 0,
    borderBottomWidth: 'thin',
    backgroundColor: 'rgba(255,255,255,0.8)',
    color: (theme.vars || theme).palette.grey[800],
    ...theme.applyDarkStyles({
      borderColor: alpha(theme.palette.primary[100], 0.08),
      backgroundColor: alpha(theme.palette.primaryDark[900], 0.7),
      color: (theme.vars || theme).palette.grey[500],
    }),
  };
});

const GrowingDiv = styled('div')({
  flex: '1 1 auto',
});

const NavIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'disablePermanent',
})(({ disablePermanent, theme }) => {
  if (disablePermanent) {
    return {};
  }
  return {
    [theme.breakpoints.up('lg')]: {
      display: 'none',
    },
  };
});

const StyledAppNavDrawer = styled(AppNavDrawer)(({ disablePermanent, theme }) => {
  if (disablePermanent) {
    return {};
  }
  return {
    [theme.breakpoints.up('lg')]: {
      flexShrink: 0,
      width: 'var(--MuiDocs-navDrawer-width)',
    },
  };
});

export default function AppFrame(props) {
  const {
    children,
    disableDrawer = false,
    className,
    BannerComponent = AppFrameBanner
  } = props;

  const t = useTranslate();

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  const { activePage } = React.useContext(PageContext);

  const disablePermanent = activePage?.disableDrawer === true || disableDrawer === true;

  return (
    <RootDiv className={className}>
      <NextNProgressBar />
      <CssBaseline />
      <SkipLink />
      <MarkdownLinks />
      <StyledAppBar disablePermanent={disablePermanent}>
        <GlobalStyles
          styles={{
            ':root': {
              '--MuiDocs-header-height': '64px',
            },
          }}
        />
        <Toolbar variant="dense" disableGutters>
          <NavIconButton
            edge="start"
            color="primary"
            aria-label={t('appFrame.openDrawer')}
            disablePermanent={disablePermanent}
            onClick={() => setMobileOpen(true)}
            sx={{ ml: '1px' }}
          >
            <SvgHamburgerMenu />
          </NavIconButton>
          <NextLink href="/" passHref /* onClick={onClose} */ legacyBehavior>
            <Box
              component="a"
              aria-label={t('goToHome')}
              sx={{ display: { md: 'flex', lg: 'none' }, ml: 2 }}
            >
              <SvgMuiLogo />
            </Box>
          </NextLink>
          <GrowingDiv />
          <Stack direction="row" spacing="10px">
            <BannerComponent />
            <DeferredAppSearch />
            <Tooltip title={t('appFrame.github')} enterDelay={300}>
              <IconButton
                component="a"
                color="primary"
                href={process.env.SOURCE_CODE_REPO}
                data-ga-event-category="header"
                data-ga-event-action="github"
              >
                <GitHubIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Notifications />
            <Tooltip title={t('appFrame.toggleSettings')} enterDelay={300}>
              <IconButton color="primary" onClick={() => setSettingsOpen(true)} sx={{ px: '8px' }}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </StyledAppBar>
      <StyledAppNavDrawer
        disablePermanent={disablePermanent}
        onClose={() => setMobileOpen(false)}
        onOpen={() => setMobileOpen(true)}
        mobileOpen={mobileOpen}
      />
      {children}
      <AppSettingsDrawer onClose={() => setSettingsOpen(false)} open={settingsOpen} />
    </RootDiv>
  );
}

AppFrame.propTypes = {
  BannerComponent: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  disableDrawer: PropTypes.bool,
};
```

## Functions

### NextNProgressBar()
A component that shows a progress bar when the user is navigating between pages.

#### Parameters
None

#### Returns
None

#### Example
```javascript
import { NextNProgressBar } from './AppFrame';

const MyApp = () => {
  return (
    <>
      <NextNProgressBar />
      <h1>Welcome to my app!</h1>
      {/* ... */}
    </>
  );
};
```

### DeferredAppSearch()
A component that provides a search functionality for the app. The search component is loaded lazily.

#### Parameters
None

#### Returns
None

#### Example
```javascript
import { DeferredAppSearch } from './AppFrame';

const MyApp = () => {
  return (
    <>
      <h1>Welcome to my app!</h1>
      <DeferredAppSearch />
      {/* ... */}
    </>
  );
};
```

### AppFrame(props)
The main application frame component that provides a consistent layout and navigation for the app.

#### Parameters
- `props` (object): An object containing the following properties:
  - `BannerComponent` (ElementType): The component to be displayed in the app banner.
  - `children` (node, required): The content of the app frame.
  - `className` (string): The CSS class name for the app frame.
  - `disableDrawer` (bool): Whether to disable the app drawer.

#### Returns
None

#### Example
```javascript
import AppFrame from './AppFrame';

const MyApp = () => {
  return (
    <AppFrame>
      <h1>Welcome to my app!</h1>
      {/* ... */}
    </AppFrame>
  );
};
```

## Dependencies

- React
- PropTypes
- useRouter from next/router
- GlobalStyles, styled, alpha from @mui/material/styles
- NProgress
- CssBaseline from @mui/material
- AppBar, Stack, Toolbar, IconButton from @mui/material
- SvgHamburgerMenu from 'docs/src/icons/SvgHamburgerMenu'
- Tooltip from @mui/material
- Box from @mui/material
- SettingsIcon from @mui/icons-material
- GitHubIcon from @mui/icons-material
- NProgressBar from @mui/docs/NProgressBar
- AppNavDrawer from 'docs/src/modules/components/AppNavDrawer'
- AppSettingsDrawer from 'docs/src/modules/components/AppSettingsDrawer'
- Notifications from 'docs/src/modules/components/Notifications'
- MarkdownLinks from 'docs/src/modules/components/MarkdownLinks'
- SkipLink from 'docs/src/modules/components/SkipLink'
- PageContext from 'docs/src/modules/components/PageContext'
- useTranslate from 'docs/src/modules/utils/i18n'
- debounce from @mui/material/utils
- NextLink from 'next/link'
- SvgMuiLogo from 'docs/src/icons/SvgMuiLogo'
- AppFrameBanner from 'docs/src/components/banner/AppFrameBanner'.