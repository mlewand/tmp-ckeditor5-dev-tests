#!/usr/bin/env bash

# Breaks the entire script if any command returned exit code other than 0.
set -e

# Current work directory.
PACKAGE_ROOT=$(pwd)

# Path to the exeutable in CWD.
ROOT_BIN=${PACKAGE_ROOT}/node_modules/.bin

PACKAGE_NAME=$(node -e "console.log( require( process.cwd() + '/package.json' ).name.replace( /@ckeditor\/ckeditor5?-/, '' ) )");

# The `.ckeditor5_test_environment` file is created by the "install-dependencies" script.
CKEDITOR5_TEST_ENVIRONMENT=$(cat ${PACKAGE_ROOT}/.ckeditor5_test_environment)

# Linter and dependency checker tasks must be executed from the original package.
yarn run lint && \
yarn run stylelint && \
${ROOT_BIN}/ckeditor5-dev-tests-check-dependencies && \
cd ${CKEDITOR5_TEST_ENVIRONMENT} && \
node --max_old_space_size=4096 $ROOT_BIN/ckeditor5-dev-tests --files=$PACKAGE_NAME --coverage --reporter=dots --browsers=Chrome --production && \
node --max_old_space_size=4096 $ROOT_BIN/ckeditor5-dev-tests --files=$PACKAGE_NAME --reporter=dots --browsers=Firefox --production
