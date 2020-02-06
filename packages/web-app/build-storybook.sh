#!/usr/bin/env bash

echo 'Building storybook'

sed -i -e 's|"homepage": "https://www.salad.io/"|"homepage": "./"|' package.json

yarn run build-storybook || { echo 'build failed' ; exit 1; }
