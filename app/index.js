'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');


var GulptimateGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // have Yeoman greet the user
    this.log(this.yeoman);

    // replace it with a short and sweet description of your generator
    this.log(chalk.magenta('You\'re using the ultimate Gulptimate generator.'));

    var prompts = [{
      name: 'projectName',
      message: 'What do you want this project to be called?'
    }];

    this.prompt(prompts, function (props) {
      this.projectName = props.projectName;

      done();
    }.bind(this));
  },

  app: function () {
    this.mkdir('src');

    this.mkdir('src/scss');
    this.mkdir('src/images');
    this.mkdir('src/js');

    this.template('gulpfile.js', 'gulpfile.js');
    this.template('src/index.html', 'index.html');

    this.copy('_bower.json', 'bower.json');
    this.copy('_config.json', 'config.json');
    this.copy('_package.json', 'package.json');
  },

  projectfiles: function () {
    this.copy('editorconfig', '.editorconfig');
    this.copy('jshintrc', '.jshintrc');
  }
});

module.exports = GulptimateGenerator;