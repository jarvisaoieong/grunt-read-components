read = require 'read-components'
_ = require 'underscore'
mkdirp = require 'mkdirp'
async = require 'async'
fs = require 'fs'

module.exports = (grunt) ->

  grunt.registerMultiTask 'read_components', 'reading components', ->
    done = @async()
    options = @options()
    self = this

    if options.concat
      jsFolder = this.data.jsDist.replace /\/[^\/]+$/, ''
      cssFolder = this.data.cssDist.replace /\/[^\/]+$/, ''
    else
      jsFolder = this.data.jsDist
      cssFolder = this.data.cssDist

    async.auto
      js: (fn) ->
        mkdirp jsFolder, fn
      css: (fn) ->
        mkdirp cssFolder, fn
    ,
      (err) ->
        return done err if err

        read '.', 'bower', (err, components) ->

          if options.concat
            components = _.sortBy components, (item) -> -item.sortingLevel
            series = []

            fs.writeFileSync self.data.jsDist, ''
            fs.writeFileSync self.data.cssDist, ''

            _.each components, (component) ->
              _.each component.files, (file) ->
                if file.match /\.js$/
                  fs.appendFileSync self.data.jsDist, fs.readFileSync(file, 'utf8') + ";"
                  fs.append
                else if file.match /\.css$/
                  fs.appendFileSync self.data.cssDist, fs.readFileSync(file, 'utf8')
                else
                  return
            done()

          else
            parallel = []
            _.each components, (component) ->
              _.each component.files, (file) ->
                if file.match /\.js$/
                  readStream = fs.createReadStream(file)
                  writeStream = fs.createWriteStream("#{jsFolder}/#{component.name}.js")
                else if file.match /\.css$/
                  readStream = fs.createReadStream(file)
                  writeStream = fs.createWriteStream("#{cssFolder}/#{component.name}.css")
                else
                  return
                parallel.push (fn) ->
                  readStream.pipe(writeStream).on 'close', fn
            async.parallel parallel, done
