'use strict';
var fs = require('fs');
var util = require('util');
var path = require('path');
var spawn = require('child_process').spawn;
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var wiredep = require('wiredep');


var GulptimateGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');


    this.on('end', function () {

      var howToInstall =
        '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
        '\nyour HTML by running:' +
        '\n' +
        chalk.yellow.bold('\n  gulp wiredep');

      if(this.options['skip-install']){
        console.log(howToInstall);
        return;
      }
          
      this.installDependencies({
        skipMessage: this.options['skip-install-message'],
        skipInstall: this.options['skip-install'],
        callback: function(){
          var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

          // wire bower packages to .html
          wiredep({
            bowerJson: bowerJson,
            directory: 'src/bower_components',
            exclude: ['bootstrap-sass'],
            src: 'src/index.html'
          });

          if (this.includeSass) {
            // wire Bower packages to .scss
            wiredep({
              bowerJson: bowerJson,
              directory: 'src/bower_components',
              src: 'src/styles/*.scss'
            });
          }

          done();
        }.bind(this)
      });
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the Gulptimate Generator.'));

    var prompts = [
      {
        name: 'projectName',
        message: 'What do you want this project to be called?'
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'What more would you like?',
        choices: [{
          name: 'Sass',
          value: 'includeSass',
          checked: true
        }, {
          name: 'Bootstrap',
          value: 'includeBootstrap',
          checked: true
        }, {
          name: 'Modernizr',
          value: 'includeModernizr',
          checked: true
        }]
      }
    ];

    this.prompt(prompts, function (answers) {
      var features = answers.features;
      this.projectName = answers.projectName;
      
      var hasFeature = function(feat){
        return features.indexOf(feat) !== -1;
      };

      // manually deal with the response, get back and store the results
      this.includeSass = hasFeature('includeSass')
      this.includeBootstrap = hasFeature('includeBootstrap')
      this.includeModernizr = hasFeature('includeModernizr')

      done();
    }.bind(this));
  },

  app: function () {
    this.template('gulpfile.js');

    this.mkdir('src');
    this.mkdir('src/scripts');
    this.mkdir('src/styles');
    this.mkdir('src/images');
    
    
    this.template('_package.json', 'package.json');
    
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
    
    this.copy('bowerrc', '.bowerrc');
    this.template('_bower.json', 'bower.json');

    this.copy('favicon.ico', 'src/favicon.ico');
    this.copy('404.html', 'src/404.html');
    this.copy('robots', 'src/robots');
    this.copy('htaccess', 'src/.htaccess');
    
    var css = 'main.' + (this.includeSass ? 's' : '') + 'css';
    this.copy(css, 'src/styles/' + css);
    
    this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
    this.indexFile = this.engine(this.indexFile, this);

    // bootstrap plugins
    if (this.includeBootstrap){
      var bs = 'bower_components/bootstrap' + (this.includeSass ? '-sass/vendero/assets/javascripts/bootstrap/' : '/js/');
      this.indexFile = this.appendScripts(this.indexFile, 'scripts/plugins.js', [
        bs + 'affix.js',
        bs + 'alert.js',
        bs + 'dropdown.js',
        bs + 'tooltip.js',
        bs + 'modal.js',
        bs + 'transition.js',
        bs + 'button.js',
        bs + 'popover.js',
        bs + 'carousel.js',
        bs + 'scrollspy.js',
        bs + 'collapse.js',
        bs + 'tab.js'
      ]);
    }

    this.indexFile = this.appendFiles({
      html: this.indexFile,
      fileType: 'js',
      optimizePath: 'scripts/main.js',
      sourceFileList: ['scripts/main.js']
    });

    this.write('src/index.html', this.indexFile);
    this.write('src/scripts/main.js', 'console.log("allo allo used to go here but i changed it")');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  },

  install: function(){
    var howToInstall =
      '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
      '\nyour HTML by running:' +
      '\n' +
      chalk.yellow.bold('\n  gulp wiredep');

    if(this.options['skip-install']){
      console.log(howToInstall);
      return;
    }

    var done = this.async();
    this.installDependencies({
      skipMessage: this.options['skip-install-message'],
      skipInstall: this.options['skip-install'],
      callback: function(){
        var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

        // wire Bower packages to .html
        wiredep({
          bowerJson: bowerJson,
          directory: 'app/bower_components',
          exclude: ['bootstrap-sass'],
          src: 'app/index.html'
        });

        if (this.includeSass) {
          // wire Bower packages to .scss
          wiredep({
            bowerJson: bowerJson,
            directory: 'app/bower_components',
            src: 'app/styles/*.scss'
          });
        }

        done();
      }.bind(this)
    })
  }

});

module.exports = GulptimateGenerator;