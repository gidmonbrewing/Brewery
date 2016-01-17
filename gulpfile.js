var gulp = require('gulp');

gulp.task('build', function () {
  return gulp
    .src(['views/*.html','scripts/*.js', 'node_modules/bootstrap/dist/*/*.*', 'package.json'], { base: './' })
    .pipe(gulp.dest('build'))
});


gulp.task('default', ['build']);