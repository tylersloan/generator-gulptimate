'use strict';
// generated on <%= (new Date).toISOString().split('T')[0] %> using <%= pkg.name %> <%= pkg.version %>

var gulp         = require('gulp'),
    sass         = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    csso         = require('gulp-csso');
    jshint       = require('gulp-jshint'),
    uglify       = require('gulp-uglify'),
    imagemin     = require('gulp-imagemin'),
    svgmin       = require('gulp-svgmin'),
    rename       = require('gulp-rename'),
    clean        = require('gulp-clean'),
    concat       = require('gulp-concat'),
    notify       = require('gulp-notify'),
    cache        = require('gulp-cache'),
    swig         = require('gulp-swig'),
    wiredep      = require('wiredep').stream,
    connect      = require('gulp-connect'),
    livereload   = require('gulp-livereload'),

    scriptFiles  = './src/**/*.js',
    styleFiles   = './src/**/*.scss',
    imageFiles   = './src/images'

gulp.task('styles', function(){
  return gulp.src(styleFiles)
    .pipe(sass({ style: 'expanded' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('build/assets/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(csso())
    .pipe(gulp.dest('build/assests/css'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('scripts', function(){
  return gulp.src(scriptFiles)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/assets/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build/assets/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

gulp.task('images', function(){
  return gulp.src(imageFiles + '/*.jpg', imageFiles + '/*.png', imageFiles + '/*.gif')
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/assets/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('svgs', function(){
  return gulp.src(imageFiles + '/svg/*.svg')
    .pipe(cache(svgmin()))
    .pipe(gulp.dest('build/assets/images/svg'))
});

gulp.task('clean', function(){
  return gulp.src(['build/**'], {read: false})
    .pipe(clean())
});

gulp.task('build', ['styles', 'scripts', 'images', 'svgs']);

gulp.task('default', ['clean'], function(){
  gulp.start('build');
});

gulp.task('connect', function(){
  var app = connect()
      .use(require('connect-livereload')({ port: 35729 }))
      .use(connect.static('app'))
      .use(connect.static('.tmp'))
      .use(connect.directory('app'))

    require('http').createServer(app)
      .listen(9000)
      .on('listening', function(){
        console.log('You\'ve connected to webserver at http://localhost:9000');
      });
});

gulp.task('serve', ['connect', 'styles'], function(){
  require('opn')('http://localhost:9000');
});

gulp.task('wiredep', function(){
<% if (includeSass) { %>
  gulp.src('src/styles/*.scss')
    .pipe('wiredep'({
      directory: 'src/bower_components'
    }))
    .pipe(gulp.dest(styleFiles));
<% } %>
  gulp.src('src/*.html')
  .pipe(wireded({
    directory: 'src/bower_components'<% if (includeSass && includeBootstrap) { %>,
    exclude: ['bootstrap-sass']<% } %>
  }))
  .pipe(gulp.dest('src'));
})

gulp.task('watch', function(){
  var server = livereload();

  gulp.watch(['build/**']).on('change', function(file){
    server.changed(file.path)''
  });

  gulp.watch('src/styles/**/*.scss', ['styles']);
  gulp.watch('src/scripts/**/*.js', ['scripts']);
  gulp.watch('src/images/*.jpg', 'src/images/*.png', 'src/images/*.gif', ['images']);
  gulp.watch('src/images/svg/*', ['svgmins']);
  gulp.watch('bower.json', ['wiredep']);
});