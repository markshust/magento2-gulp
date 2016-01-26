/* ==========================================================================
   Installation and how to use
   ========================================================================== */
/*
 * 1. Install node.js for your OS: https://nodejs.org/en/
 * 2. Install modules: run a command in a root directory of your project "npm install"
 * 3. Run gulp command in the root directory with arguments or without. Examples:
 * 3.1. Compilation of all themes: gulp
 * 3.2. Compilation of certain theme: gulp less --Lea
 * 3.3. Watcher of certain theme: gulp watch --Lea
 * 3.4. Compilation of certain theme with minification (+~2.5s): gulp less --Lea --min
 * 3.5. Compilation of certain theme with sourcemap(+~1.5s), can't be used with minification: gulp less --Lea --map
 * 3.6. Compilation with live reload: gulp less --Lea --live
 * 3.7. Watcher with liveReload: gulp watch --Lea --live
 * 4. For using liveReload install extension for your browser: http://livereload.com/
 * 4.1. Turn on the extension on the page of project.
 */


/* ==========================================================================
   Required modules
   ========================================================================== */
var gulp = require('gulp'),
  	less = require('gulp-less'),
  	sourcemaps = require('gulp-sourcemaps'),
  	cssmin = require('gulp-cssmin'),
  	livereload = require('gulp-livereload'),
  	gulpif = require('gulp-if');


/* ==========================================================================
   Global configs of Magento2
   ========================================================================== */
var themesConfig = require('./dev/tools/grunt/configs/themes'),
	lessConfig = require('./dev/tools/grunt/configs/less').options;


/* ==========================================================================
   Variables
   ========================================================================== */

// Get all arguments
var devArguments = [];
for (i=3; i <= process.argv.length - 1; i++) {

	if (!process.argv[i]) {
		return false;
	}

 	else {
 		var argument = process.argv[i].toString().replace('--','');
 		devArguments.push(argument);
 	}
}

// Get theme name from Array of arguments
var themeName = devArguments[0];
var sourceMapArg = devArguments.indexOf("map");
var minCssArg = devArguments.indexOf("min");
var liveReload = devArguments.indexOf("live");

// Array with less files of the theme
var lessFiles = [];

/*
 * If no arguments in command
 * Get all themes, create paths for less files and push them to the Array.
 */
if (!themeName) {
	for (i in themesConfig) {
		// Create path
		var path = './pub/static/' + themesConfig[i].area + '/' + themesConfig[i].name + '/' + themesConfig[i].locale + '/';

		// Push names of less files to the Array
		for (j in themesConfig[i].files) {
			lessFiles.push(path + themesConfig[i].files[j] + '.' + themesConfig[i].dsl);
		}
	}
}

// Get certain theme, create paths for less files and push them to the Array. 
else {
	// Create path
	var path = './pub/static/' + themesConfig[themeName].area + '/' + themesConfig[themeName].name + '/' + themesConfig[themeName].locale + '/';

	// Push names of less files to the Array
	for (i in themesConfig[themeName].files) {
		lessFiles.push(path + themesConfig[themeName].files[i] + '.' + themesConfig[themeName].dsl)
	}
}

/* ==========================================================================
   Gulp tasks
   ========================================================================== */

// Default task. Run compilation for all themes
gulp.task('default', ['less']);

// Less task
gulp.task('less', function() {
	// Console info
	console.log('\x1b[32m', '====================================' ,'\x1b[0m');
	console.log('Running \x1b[36mLess\x1b[0m compilation for \x1b[36m' + lessFiles.length + ' files:\x1b[0m');

	for (i in lessFiles) {
		console.log('\x1b[32m',lessFiles[i],'\x1b[0m');
	}

	// Get Array with files
	return gulp.src(lessFiles)

	// Less compilation
	.pipe(less().on('error', function(err) {
      	console.log(err);
    }))

    // Source map
    .pipe(gulpif(sourceMapArg >= 0, sourcemaps.init()))
	.pipe(gulpif(sourceMapArg >= 0, sourcemaps.write('.', {includeContent:false, sourceRoot: '..'})))

	// Minify css
	.pipe(gulpif(minCssArg >= 0, cssmin()))
	
    // Destination folder
    .pipe(gulp.dest( path + 'css/'))

    // Live reload
    .pipe(gulpif(liveReload >= 0, livereload()))
});

// Watcher task
gulp.task('watch', function() {
	console.log('\x1b[32m', '====================================' ,'\x1b[0m');
	console.log(' Watching:\x1b[32m', themesConfig[themeName].area + '/' + themesConfig[themeName].name ,'\x1b[0m');
	console.log('\x1b[32m', '====================================' ,'\x1b[0m');
	if (liveReload >= 0) {
		livereload.listen();
	}
	gulp.watch([path + '/css/source/**/*.less'],['less']);
});
