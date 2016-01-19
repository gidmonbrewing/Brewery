var gulp = require('gulp');

gulp.task('build', function () {
  return gulp
    .src(['views/*.html','scripts/*.js', 'node_modules/bootstrap/dist/*/*.*','node_modules/angular//*.*', 'package.json'], { base: './' })
    .pipe(gulp.dest('build'))
});


gulp.task('default', ['build']);