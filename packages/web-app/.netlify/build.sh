#!/usr/bin/env bash
set -eufo pipefail

if [[ -z ${COMMIT_REF+x} ]]
then
  echo 'COMMIT_REF is undefined'
  exit 1
fi

if [[ -z ${PULL_REQUEST+x} ]]
then
  echo 'PULL_REQUEST is undefined'
  exit 1
fi

if [[ -z ${SITE_NAME+x} ]]
then
  echo 'SITE_NAME is undefined'
  exit 1
fi

export REACT_APP_BUILD="${COMMIT_REF}"
if [[ "${PULL_REQUEST}" == 'false' ]]
then
  export PUBLIC_URL='/app'
  if [[ "${SITE_NAME}" =~ -test$ ]]
  then
    export REACT_APP_MIXPANEL_TOKEN='4b245bace4eed86ffdfa35efc3addf1d'
  else
    export REACT_APP_MIXPANEL_TOKEN='68db9194f229525012624f3cf368921f'
  fi
fi

if [[ "${PULL_REQUEST}" != 'false' || "${SITE_NAME}" =~ -test$ ]]
then
  export REACT_APP_API_URL='https://app-api-testing.salad.io'
  export REACT_APP_PROHASHING_USERNAME='saladtest'
  export REACT_APP_SEARCH_ENGINE='salad-rewards-test'
  export REACT_APP_SEARCH_KEY='search-qced4ibef8m4s7xacm9hoqyk'
  export REACT_APP_STRAPI_UPLOAD_URL='https://cms-api-testing.salad.io'
  export REACT_APP_UNLEASH_API_KEY='zrujLzhnwVZkIOlS74oZZ0DK7ZXs3Ifo'
  export REACT_APP_UNLEASH_URL='https://features-testing.salad.com/proxy'
fi

echo 'Building application...'
yarn run build || { echo 'Build failed!'; exit 1; }
echo 'Built application'

echo 'Embedding version...'
echo "${COMMIT_REF}" > build/version.txt
echo 'Embedded version'
