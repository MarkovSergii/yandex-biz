var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var watch = require('gulp-watch');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(gulp.dest('dist'));
});


gulp.task('css', function() {
    return gulp.src('src/**/*.css')
        .pipe(concat('main.css'))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('dist/css'));
});

gulp.task('js', function() {
    return gulp.src(['src/js/CONST.js','src/js/yand.js','src/js/main.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('table-js', function() {
    return gulp.src('src/js/table.js')
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));
});

gulp.task('bs', function() {
    browserSync.init({
        open: false,
        server: {
            baseDir: "./dist"
        },
        browser: 'google-chrome'
    });

    browserSync.watch('dist/**/*.*').on('change',browserSync.reload);

});



gulp.task('watch', function() {

    gulp.run('css');
    gulp.run('html');
    gulp.run('js');
    gulp.run('table-js');


    gulp.watch('src/css/**/*.*', function() {
        gulp.run('css');
    });


    gulp.watch('src/*.html', function() {
        gulp.run('html');
    });


    gulp.watch('src/js/**/*.js', function() {
        gulp.run('js');
        gulp.run('table-js');
    });

    gulp.run('bs');
});