#!/usr/bin/env bash

echo 'Building storybook'

# Required due to a bug in storybook https://github.com/storybookjs/storybook/issues/9564
sed -i -e 's|"homepage": "https://www.salad.io/"|"homepage": "./"|' package.json

yarn run build-storybook || { echo 'build failed' ; exit 1; }
