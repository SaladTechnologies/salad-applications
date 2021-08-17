#!/usr/bin/env bash

# Bug: https://github.com/storybookjs/storybook/issues/9564
echo 'Configuring application...'
sed -i -e 's|"homepage": "https://salad.com"|"homepage": "./"|' package.json
echo 'Configured application'

echo 'Building application...'
yarn run build-storybook || { echo 'Build failed!' ; exit 1; }
echo 'Built application'
