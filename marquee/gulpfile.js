const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const gulpUglify = require('gulp-uglify');
gulp.task('babel', () =>
    gulp.src(['es6/*.js','es6/*/*.js'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', console.error.bind(console))
        // .pipe(gulpUglify())
        .pipe(gulp.dest('js'))
);
gulp.task('sass', function() {
    gulp.src('sass/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./css/'))
})

gulp.task('default', ['babel','sass'], function() {
    gulp.watch(['es6/*.js','es6/*/*.js'], ['babel']);
    gulp.watch('sass/*.scss', ['sass']);
})