import type { Preview } from '@storybook/react-vite'

import { withTheme } from './withTheme';

import '../src/styles.css';

const preview: Preview = {
  decorators: [withTheme],

  globalTypes: {
    theme: {
      description: 'Kosmos color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: 'light',
  },

  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // Violations fail the test run. A story that genuinely cannot satisfy a
      // rule opts out per-story via parameters.a11y.config.rules.
      test: 'error'
    }
  },
};

export default preview;
