var read;

read = require('read-components');

module.exports = function(grunt) {
  return grunt.registerMultiTask('read_components', 'reading components', function() {
    var done, options, _;
    done = this.async();
    options = this.options({
      concat: false,
      regex: /.*/,
      dest: '.',
      seperator: ''
    });
    _ = grunt.util._;
    return read('.', 'bower', function(err, components) {
      if (options.concat) {
        components = _.sortBy(components, function(item) {
          return -item.sortingLevel;
        });
        grunt.file.write(options.dest, '');
        _.each(components, function(component) {
          return _.each(component.files, function(file) {
            if (!file.match(options.regex)) {
              return;
            }
            return grunt.file.write(options.dest, grunt.file.read(options.dest) + options.seperator + grunt.file.read(file));
          });
        });
        done();
      } else {
        _.each(components, function(component) {
          return _.each(component.files, function(file) {
            var fileName;
            if (!file.match(options.regex)) {
              return;
            }
            fileName = _.last(file.split('/'));
            return grunt.file.write("" + options.dest + "/" + fileName, grunt.file.read(file));
          });
        });
      }
      return done();
    });
  });
};
