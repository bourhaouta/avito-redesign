var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename');


var jade         = require('gulp-jade');


var browserSync  = require('browser-sync').create(),
    devip        = require('dev-ip'),
    host         = devip();


var uglify       = require('gulp-uglify'),
    concat       = require('gulp-concat');


var stylus       = require('gulp-stylus'),
		sourcemaps   = require('gulp-sourcemaps'),
    postcss      = require('gulp-postcss'),
    lost         = require('lost'),
    autoprefixer = require('autoprefixer'),
    cssnano      = require('cssnano');


//- JADE
gulp.task('jade', function() {
	gulp.src('.jade/5-page/*.jade')
		.pipe(plumber())
		.pipe(jade({ pretty: true }))
		.pipe(gulp.dest('./'));
});


//- STYLUS
gulp.task('stylus', function() {
	var processors = [
		lost,
		autoprefixer({ browsers: ['last 2 versions'] }),
		cssnano
	];

	gulp.src('.stylus/master.styl')
		.pipe(sourcemaps.init())
		.pipe(plumber())
		.pipe(stylus())
		.pipe(postcss(processors))
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist/css'));
});

//- JS
gulp.task('js', function() {
	gulp.src('.js/*.js')
		.pipe(plumber())
		.pipe(concat('app.js'))
		.pipe(rename('app.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'));
});


//- BROWSER SYNC
gulp.task('browser-sync', function() {
	browserSync.init({
		server: { baseDir: './' },
		port: 80,
		ui: false,
		host: host.slice(-1).pop(),
		files: '*.html, dist/css/*.css, dist/js/*.js, dist/img/*'
	});
});


//- WATCH
gulp.task('watch', function () {
	gulp.watch('.jade/**/*.jade', ['jade']);
	// gulp.watch('dist/img/*', ['jade']);
	gulp.watch('.stylus/**/*.styl', ['stylus']);
	gulp.watch('.js/*.js', ['js']);
});


//- DEFAULT
gulp.task('default', ['jade', 'stylus', 'js', 'browser-sync', 'watch']);