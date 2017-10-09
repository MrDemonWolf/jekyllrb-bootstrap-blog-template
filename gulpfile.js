var gulp = require('gulp');
var bs = require('browser-sync');
var sass = require('gulp-sass');
var cp = require('child_process');

var jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
var messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

/**
 * Default task, running just `gulp` will compile the sass,
 * compile the jekyll site, launch BrowserSync & watch files.
 */
gulp.task('default', ['browser-sync', 'watch']);

/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
    bs.notify(messages.jekyllBuild);
    return cp.spawn(jekyll, ['build'], { stdio: 'inherit' })
        .on('close', done);
});

/**
 * Compile files from _scss into both _site/css (for live injecting) and site (for future jekyll builds)
 */

gulp.task('sass', function () {
    return gulp.src('_scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({ outputStyle: 'compact' }))
        .pipe(gulp.dest('_site/css'))
        .pipe(bs.reload({ stream: true }))
        .pipe(gulp.dest('css'));
});

// Here to rerun the sass when a error happens
gulp.task('sass:watch', function () {
    gulp.watch('_sass/*.scss', ['sass']);
});

/**
 * Watch scss files for changes & recompile
 * Watch html/md files, run jekyll & reload BrowserSync
 */
gulp.task('watch', function () {
    gulp.watch('_scss/*.scss', ['sass']);
    gulp.watch(['*.html', '_layouts/*.html', '_posts/*'], ['jekyll-rebuild']);
});

gulp.task('jekyll-rebuild', ['jekyll-build'], function () {
    bs.reload();
});

/**
 * Wait for jekyll-build, then launch the Server
 */
gulp.task('browser-sync', ['sass', 'jekyll-build'], function () {
    bs({
        server: {
            baseDir: '_site'
        }
    });
});
