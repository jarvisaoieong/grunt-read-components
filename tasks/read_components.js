var async, fs, mkdirp, read, _;

read = require('read-components');

_ = require('underscore');

mkdirp = require('mkdirp');

async = require('async');

fs = require('fs');

module.exports = function(grunt) {
  return grunt.registerMultiTask('read_components', 'reading components', function() {
    var cssFolder, done, jsFolder, options;
    done = this.async();
    options = this.options();
    if (options.concat) {
      jsFolder = options.js.replace(/\/[^\/]+$/, '');
      cssFolder = options.css.replace(/\/[^\/]+$/, '');
    } else {
      jsFolder = options.js;
      cssFolder = options.css;
    }
    return async.auto({
      js: function(fn) {
        return mkdirp(jsFolder, fn);
      },
      css: function(fn) {
        return mkdirp(cssFolder, fn);
      }
    }, function(err) {
      if (err) {
        return done(err);
      }
      return read('.', 'bower', function(err, components) {
        var parallel, series;
        if (options.concat) {
          components = _.sortBy(components, function(item) {
            return -item.sortingLevel;
          });
          series = [];
          fs.writeFileSync(options.js, '');
          fs.writeFileSync(options.css, '');
          _.each(components, function(component) {
            return _.each(component.files, function(file) {
              if (file.match(/\.js$/)) {
                fs.appendFileSync(options.js, fs.readFileSync(file, 'utf8') + ";");
                return fs.append;
              } else if (file.match(/\.css$/)) {
                return fs.appendFileSync(options.css, fs.readFileSync(file, 'utf8'));
              } else {

              }
            });
          });
          return done();
        } else {
          parallel = [];
          _.each(components, function(component) {
            return _.each(component.files, function(file) {
              var readStream, writeStream;
              if (file.match(/\.js$/)) {
                readStream = fs.createReadStream(file);
                writeStream = fs.createWriteStream("" + jsFolder + "/" + component.name + ".js");
              } else if (file.match(/\.css$/)) {
                readStream = fs.createReadStream(file);
                writeStream = fs.createWriteStream("" + cssFolder + "/" + component.name + ".css");
              } else {
                return;
              }
              return parallel.push(function(fn) {
                return readStream.pipe(writeStream).on('close', fn);
              });
            });
          });
          return async.parallel(parallel, done);
        }
      });
    });
  });
};
