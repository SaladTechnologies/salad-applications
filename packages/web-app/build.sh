#!/usr/bin/env bash

echo 'Building web-application'
yarn build || { echo 'build failed' ; exit 1; }

if [ "$CONTEXT" = "production" ]
then
echo 'Installing sentry-cli'
npm install @sentry/cli

export SENTRY_ORG=salad-technologies
export SENTRY_PROJECT=web-app
export VERSION=$COMMIT_REF

echo 'Creating a new sentry release'
./node_modules/.bin/sentry-cli releases new "$VERSION"

echo 'Setting release commits in sentry'
./node_modules/.bin/sentry-cli releases set-commits "$VERSION" --commit "SaladTechnologies/salad-applications@$COMMIT_REF"

echo 'Uploading source maps to sentry'
./node_modules/.bin/sentry-cli releases files "$VERSION" upload-sourcemaps build/static/js/ --rewrite --url-prefix '~/static/js'

echo 'Finalizing sentry release'
./node_modules/.bin/sentry-cli releases finalize "$VERSION"

fi