/**
 * Created by imsun on 6/24/15.
 */
'use strict'

var gulp = require('gulp')
var sourcemaps = require('gulp-sourcemaps')
var babel = require('gulp-babel')
var webpack = require('webpack')

gulp.task('default', function (callback) {
  gulp.src('static/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('static/dist'))
    .on('end', callback)
})

gulp.task('bundle', function (callback) {
  gulp.src('static/src/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('static/dist'))
    .on('end', function() {
      // use `bundle.js` without `system.js`
      webpack({
        entry: './static/dist/main.js',
        output: {
          path: __dirname + '/static/dist',
          filename: 'bundle.js'
        }
      }, function(err) {
        if (err) throw new Error('webpack', err)
        callback()
      })
    })
})
