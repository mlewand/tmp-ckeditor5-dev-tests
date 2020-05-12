/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/* jshint node: true, strict: true */

'use strict';

const path = require( 'path' );
const createManualTestServer = require( '../utils/manual-tests/createserver' );
const compileManualTestScripts = require( '../utils/manual-tests/compilescripts' );
const compileManualTestHtmlFiles = require( '../utils/manual-tests/compilehtmlfiles' );
const copyAssets = require( '../utils/manual-tests/copyassets' );
const removeDir = require( '../utils/manual-tests/removedir' );
const transformFileOptionToTestGlob = require( '../utils/transformfileoptiontotestglob' );

/**
 * Main function that runs manual tests.
 *
 * @param {Object} options
 * @param {Array.<String>} options.files Glob patterns specifying which tests to run.
 * @param {String} options.themePath A path to the theme the PostCSS theme-importer plugin is supposed to load.
 * @param {String} [options.language] A language passed to `CKEditorWebpackPlugin`.
 * @param {Array.<String>} [options.additionalLanguages] Additional languages passed to `CKEditorWebpackPlugin`.
 * @param {Number} [options.port] A port number used by the `createManualTestServer`.
 * @returns {Promise}
 */
module.exports = function runManualTests( options ) {
	const buildDir = path.join( process.cwd(), 'build', '.manual-tests' );
	const files = ( options.files && options.files.length ) ? options.files : [ '*' ];
	const patterns = files.map( file => transformFileOptionToTestGlob( file, true ) )
		.reduce( ( returnedPatterns, globPatterns ) => {
			returnedPatterns.push( ...globPatterns );

			return returnedPatterns;
		}, [] );
	const themePath = options.themePath || null;
	const language = options.language;
	const additionalLanguages = options.additionalLanguages;

	return Promise.resolve()
		.then( () => removeDir( buildDir ) )
		.then( () => Promise.all( [
			compileManualTestScripts( {
				buildDir,
				patterns,
				themePath,
				language,
				additionalLanguages,
				debug: options.debug
			} ),
			compileManualTestHtmlFiles( {
				buildDir,
				patterns,
				language,
				additionalLanguages
			} ),
			copyAssets( buildDir )
		] ) )
		.then( () => createManualTestServer( buildDir, options.port ) );
};
