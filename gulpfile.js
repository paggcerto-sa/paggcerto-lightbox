const gulp = require('gulp')
const autoprefixer = require('gulp-autoprefixer')
const babelify = require('babelify')
const browserify = require('browserify')
const buffer = require('vinyl-buffer')
const rename = require("gulp-rename")
const sass = require('gulp-sass');
const source = require('vinyl-source-stream')
const uglify = require('gulp-uglify')

gulp.task('build-sass', () => {
  return gulp.src('src/scss/compile.scss')
    .pipe(sass({ outputStyle: 'compressed' }).on('error', (e) => console.log(e)))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(rename({ basename: 'paggcerto-lightbox', extname: '.min.css' }))
    .pipe(gulp.dest('dist'))
});

gulp.task('build-js', () => {
  return browserify({
    entries: ['src/js/index.js'],
    paths: ['./'],
    fullPaths: false,
    transform: [babelify.configure({ presets: ['env'] })]
  })
    .bundle().on('error', (e) => console.log(e))
    .pipe(source('paggcerto-lightbox.min.js'))
    .pipe(buffer())
    .pipe(uglify().on('error', (e) => console.log(e)))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', gulp.parallel('build-sass', 'build-js'))

gulp.task('build-watching', () => {
  gulp.watch('src/scss/**/*.scss', gulp.series('build-sass'))
  gulp.watch('src/js/**/*.js', gulp.series('build-js'))
})

gulp.task('start', gulp.series('build', 'build-watching'))
