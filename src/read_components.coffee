read = require 'read-components'
_ = require 'underscore'
mkdirp = require 'mkdirp'
async = require 'async'
fs = require 'fs'

module.exports = (grunt) ->

  grunt.registerMultiTask 'read_components', 'reading components', ->

    done = @async()
    options = @options
      concat: false
      files: {}

    _.each options.files, (target, type) ->
      dir = if options.concat
        target.replace /\/[^\/]+$/, ''
      else
        target
      mkdirp.sync dir

    read '.', 'bower', (err, components) ->

      if options.concat
        components = _.sortBy components, (item) -> -item.sortingLevel
        _.each options.files, (target, type) ->
          regex = new RegExp "\.#{type}$"
          fs.writeFileSync target, ''
          _.each components, (component) ->
            _.each component.files, (file) ->
              return unless regex.test file
              fs.appendFileSync target, fs.readFileSync(file, 'utf8')
              # For js concat safe
              if type is 'js'
                fs.appendFileSync target, ';'
        done()

      else
        parallel = []
        _.each options.files, (target, type) ->
          regex = new RegExp "\.#{type}$"
          _.each components, (component) ->
            _.each component.files, (file) ->
              return unless regex.test file
              readStream = fs.createReadStream(file)
              writeStream = fs.createWriteStream("#{target}/#{component.name}.#{type}")
              parallel.push (fn) ->
                readStream.pipe(writeStream).on 'close', fn
        async.parallel parallel, done
