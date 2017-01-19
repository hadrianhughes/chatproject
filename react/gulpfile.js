var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');

function handleError(err) {
   console.log(err.toString());
}

gulp.task('build', function() {
   return browserify({
           entries: './app/app.js',
           extensions: ['.js'],
           debug: true
       })
       .transform('babelify', {
           presets: ['es2015', 'react']
       })
       .bundle()
       .on('error', handleError)
       .pipe(source('bundle.js'))
       .pipe(gulp.dest('../server/public/js'));
});

gulp.task('watch', ['build'], function() {
   gulp.watch(['./app/*.js', './*.js', './app/*/*.js', './app/*/*/*.js'], ['build']);
});

gulp.task('default', ['watch']);
