'use strict'

const
  gulp = require('gulp'),
  annotate = require('gulp-ng-annotate'),
  uglify = require('gulp-uglify'),
  mocha = require('gulp-mocha'),
  concat = require('gulp-concat');

const base = ['./public/', '/**/*.js'];


gulp.task('js', () => {
  let sources = [
    'admin',
    'artist',
    'genre',
    'newArtist',
    'newGenre',
    'user',
    'main',
    'directives',
    'services'
  ];

  sources = sources.map((src) => {
    return base[0] + src + base[1];
  });

  sources.unshift('./public/app.js', './public/indexCtrl.js');


  gulp.src(sources)
  .pipe(annotate())
  .pipe(uglify())
  .pipe(concat('js.min.js'))
  .pipe(gulp.dest('./public'))
})

gulp.task('watch', () => {
  gulp.watch('./public/**/*', ['js']);
})

gulp.task('default', ['js', 'watch']);
