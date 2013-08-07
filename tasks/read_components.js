var async, fs, mkdirp, read, _;

read = require('read-components');

_ = require('underscore');

mkdirp = require('mkdirp');

async = require('async');

fs = require('fs');

module.exports = function(grunt) {
  return grunt.registerMultiTask('read_components', 'reading components', function() {
    var done, options;
    done = this.async();
    options = this.options({
      concat: false,
      files: {}
    });
    _.each(options.files, function(target, type) {
      var dir;
      dir = options.concat ? target.replace(/\/[^\/]+$/, '') : target;
      return mkdirp.sync(dir);
    });
    return read('.', 'bower', function(err, components) {
      var parallel;
      if (options.concat) {
        components = _.sortBy(components, function(item) {
          return -item.sortingLevel;
        });
        _.each(options.files, function(target, type) {
          var regex;
          regex = new RegExp("\." + type + "$");
          fs.writeFileSync(target, '');
          return _.each(components, function(component) {
            return _.each(component.files, function(file) {
              if (!regex.test(file)) {
                return;
              }
              fs.appendFileSync(target, fs.readFileSync(file, 'utf8'));
              if (type === 'js') {
                return fs.appendFileSync(target, ';');
              }
            });
          });
        });
        return done();
      } else {
        parallel = [];
        _.each(options.files, function(target, type) {
          var regex;
          regex = new RegExp("\." + type + "$");
          return _.each(components, function(component) {
            return _.each(component.files, function(file) {
              var readStream, writeStream;
              if (!regex.test(file)) {
                return;
              }
              readStream = fs.createReadStream(file);
              writeStream = fs.createWriteStream("" + target + "/" + component.name + "." + type);
              return parallel.push(function(fn) {
                return readStream.pipe(writeStream).on('close', fn);
              });
            });
          });
        });
        return async.parallel(parallel, done);
      }
    });
  });
};
