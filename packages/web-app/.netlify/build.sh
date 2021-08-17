#!/usr/bin/env bash

echo 'Building application...'
yarn run build || { echo 'Build failed!' ; exit 1; }
echo 'Built application'

echo 'Embedding version...'
echo "${COMMIT_REF}" > build/version.txt
echo 'Embedded version'
