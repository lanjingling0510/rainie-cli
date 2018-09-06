const path = require('path');
const gulp = require('gulp');
const babel = require('gulp-babel');
const gutil = require('gulp-util');
const chmod = require('gulp-chmod');
const colors = gutil.colors;
const NODE_SRC = ['src/**/*.js'];
const HTML_SRC = ['src/**/*.html'];
const resolve = path.resolve;
const relative = path.relative;
const white = colors.cyan;
const cyan = colors.cyan;
const NODE_DEST = resolve('lib');

gulp.task('build', function () {
  return gulp.src(NODE_SRC)
    .pipe(chmod(0o755))
    .pipe(babel())
    .pipe(gulp.dest(NODE_DEST));
});


gulp.task('html', function() {
  return gulp.src(HTML_SRC)
    .pipe(gulp.dest(NODE_DEST));
});


gulp.task('watch', ['build', 'html'], () => {
  const watch = require('gulp-watch');
  const plumber = require('gulp-plumber');
  const del = require('del');

  gulp.watch(['.babelrc', HTML_SRC], ['build', 'html']);

  return watch(NODE_SRC, file => {
    const event = file.event;

    if (event === 'add' || event === 'change') {
      gutil.log(
        `${white('[Watcher]')} Compiling '${cyan(getProjectPath(file.path))}' as it was ` +
        `${cyan(event === 'change' ? 'changed' : 'added')}...`
      );
      gulp
        .src(file.path, { base: 'src' })
        .pipe(plumber())
        .pipe(babel())
        .pipe(chmod(0o755))
        .pipe(gulp.dest(NODE_DEST));
    }

    if (event === 'unlink') {
      const compiledScriptPath = resolve(NODE_DEST, file.relative);
      gutil.log(
        `${white('[Watcher]')} Deleting compiled file '${cyan(getProjectPath(compiledScriptPath))}' ` +
        "as it's source was deleted..."
      );
      del.sync(compiledScriptPath);
    }
  });
});

gulp.task('default', ['watch']);

function getProjectPath(absolutePath) {
  return relative(__dirname, absolutePath);
}
