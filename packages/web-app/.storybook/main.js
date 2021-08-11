const path = require('path')

module.exports = {
  stories: ['../src/**/*.stories.[tj]sx'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-actions/register',
    '@storybook/addon-knobs/register',
    '@storybook/addon-links/register',
    '@storybook/addon-viewport',
  ],
  // https://github.com/styleguidist/react-docgen-typescript/issues/356
  typescript: {
    reactDocgen: 'none',
  },
  webpackFinal: async (config) => {
    const emotionReactEleven = path.dirname(require.resolve('@emotion/react/package.json'))
    const emotionStyledEleven = path.dirname(require.resolve('@emotion/styled/package.json'))
    return {
      ...config,
      performance: {
        hints: false,
      },
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@emotion/core': emotionReactEleven,
          '@emotion/styled': emotionStyledEleven,
          'emotion-theming': emotionReactEleven,
        },
      },
    }
  },
}
