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
