const gulp = require('gulp');
const {series} = gulp;
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

function Build(callback){
    return gulp
    .src(['../IO/**/*.js', '!../IO/gulpfile.js'])
    .pipe(babel({
        comments: false,
        presets: ['env']
    }))
    .pipe(concat('myjavascriptlibrary.js'))
    .pipe(gulp.dest('../IO/build'));
}

module.exports.default = series(Build);