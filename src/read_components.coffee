read = require 'read-components'

module.exports = (grunt) ->

  grunt.registerMultiTask 'read_components', 'reading components', ->

    done = @async()
    options = @options
      concat: false
      regex: /.*/
      dest: '.'
      seperator: ''

    _ = grunt.util._

    read '.', 'bower', (err, components) ->

      if options.concat
        components = _.sortBy components, (item) -> -item.sortingLevel
        grunt.file.write options.dest, ''
        _.each components, (component) ->
          _.each component.files, (file) ->
            return unless file.match options.regex
            grunt.file.write options.dest, (grunt.file.read(options.dest) + options.seperator + grunt.file.read(file))
        done()

      else
        _.each components, (component) ->
          _.each component.files, (file) ->
            return unless file.match options.regex
            fileName = _.last file.split '/'
            grunt.file.write "#{options.dest}/#{fileName}", grunt.file.read(file)

      done()
