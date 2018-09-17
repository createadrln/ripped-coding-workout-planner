var gulp            = require('gulp'),
  autoprefixer    = require('gulp-autoprefixer'),
  cssmin          = require('gulp-cssmin'),
  del             = require('del'),
  eol             = require('gulp-eol-enforce'),
  image           = require('gulp-image'),
  sass            = require('gulp-sass'),
  sassLint        = require('gulp-sass-lint'),
  sourcemaps      = require('gulp-sourcemaps'),
  plumber         = require('gulp-plumber'),
  rename          = require('gulp-rename')
;

var themeBasePath = './src/assets';

var paths = {
  img: [themeBasePath + '/images/**/*.{gif,png,jpg,svg}'],
  sass:[themeBasePath + '/scss/**/*.scss'],
  distCSS: themeBasePath + '/dist/css/',
  distImg: themeBasePath + '/dist/images/'
};

// Error notification settings for plumber
var plumberErrorHandler = {

};

gulp.task('clean', function(cb) {
  // Delete dynamically-generated files
  del.sync([paths.distCSS, paths.distImg]);
  cb();
});

gulp.task('eol', function() {
  return gulp.src([].concat(paths.sass))
    .pipe(eol('\n'));
});

gulp.task('images', function() {
  return gulp.src(paths.img)
    .pipe(plumber(plumberErrorHandler))
    .pipe(image({
      pngquant: true,
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: true,
      guetzli: false,
      gifsicle: true,
      svgo: true,
      concurrent: 10
    }))
    .pipe(gulp.dest(paths.distImg));
});

gulp.task('sass', function() {
  return gulp.src(paths.sass)
    .pipe(plumber(plumberErrorHandler))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest(paths.distCSS))
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.distCSS));
});

gulp.task('sass-dev', function() {
  return gulp.src(paths.sass)
    .pipe(plumber(plumberErrorHandler))
    .pipe(sass())
    .pipe(autoprefixer({
      browsers: ['last 3 versions', 'ie >= 9']
    }))
    .pipe(gulp.dest(paths.distCSS))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest(paths.distCSS));
});


gulp.task('lint:sass', ['sass'], function() {
  return gulp.src(paths.sass)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
});

// Combined tasks
gulp.task('lint', function() {
  gulp.start('eol', 'lint:sass');
});

gulp.task('build', ['clean'], function () {
  gulp.start('sass', 'images');
});

gulp.task('test', function() {
  gulp.start('lint');
});

gulp.task('test:ci', function() {
  gulp.start('eol', 'lint:sass');
});

gulp.task('default', function () {
  gulp.start('test', 'build');
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.img, ['images']);
});

gulp.task('pre-commit', ['test']);
