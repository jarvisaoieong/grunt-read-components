# grunt-read-components

> Read components (only support bower components now).

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-read-components --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-read-components');
```

## The "read_components" task

### Overview
In your project's Gruntfile, add a section named `read_components` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  read_components: {
    js: {
      options: {
        concat: true,
        regex: /\.js$/,
        dest: 'src/scripts/vendor.js',
        seperator: ';'
      }
    }
  }
})
```

### Options

#### options.concat
Type: `Boolean`
Default value: `false`

Concat bower components into one file or not.

#### options.regex
Type: `RegExp`
Default value: `/.*/`

The pattern of file path for parsing.

#### options.dest
Type: `String`
Default value: `'.'`

The destination of the file move to.

#### options.seperator
Type: `String`
Default value: `''`

When options.concat set to true, the seperator value used to concat the file content with.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
