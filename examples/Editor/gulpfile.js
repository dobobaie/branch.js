let 
	gulp = require('gulp'),
	configBS = require('./browserSync.config.js'),
	spawn = require('child_process').spawn,
	browserSync = require('browser-sync').create(),
	node = null
;

gulp.task('css', function() {
	return gulp
		.src('./src/css/*.css')
		.pipe(browserSync.reload({
			stream: true
		}))
	;
});

gulp.task('js', function() {
	return gulp
		.src('./src/js/*.js')
		.pipe(browserSync.reload({
			stream: true
		}))
	;
});

gulp.task('html', function() {
	return gulp
		.src('./src/*.html')
		.pipe(browserSync.reload({
			stream: true
		}))
	;
});

gulp.task('templates', function() {
	return gulp
		.src('./src/templates/*.html')
		.pipe(browserSync.reload({
			stream: true
		}))
	;
});

gulp.task('watch', function() {
	gulp.watch(['./src/css/*.css'], ['css']);
	gulp.watch(['./src/js/*.js'], ['js']);
	gulp.watch(['./src/*.html'], ['html']);
	gulp.watch(['./src/templates/*.html'], ['templates']);
	return gulp;
});

gulp.task('test', function() {
	if (node != null) {
		node.kill();
	}
	node = spawn('node', ['./UploadFileServer/server.js'], {stdio: 'inherit'});
	node.on('close', function (code) {
		if (code === 8) {
			gulp.log('Error detected, waiting for changes...');
		}
	});
});

gulp.task('serve', ['test', 'watch'], function() {
	browserSync.init(configBS);
	return gulp;
});

gulp.task('default', function() {
	console.log('\n\r');
	console.log(color('gulp watch - Run project', 'green'));
	console.log('\n\r');
	return gulp;
});
