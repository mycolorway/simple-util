module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    coffee:
      module:
        options:
          bare: true
        files:
          'lib/util.js': 'src/util.coffee'
          'spec/util-spec.js': 'spec/util-spec.coffee'
    umd:
      all:
        src: 'lib/util.js'
        template: 'umd.hbs'
        amdModuleId: 'simple-util'
        objectToExport: 'util'
        globalAlias: 'util'
        deps:
          'default': ['$']
          amd: ['jquery']
          cjs: ['jquery']
          global:
            items: ['jQuery']
            prefix: ''
    watch:
      scripts:
        files: ['src/**/*.coffee', 'spec/**/*.coffee']
        tasks: ['coffee']
      jasmine:
        files: ['lib/**/*.js', 'specs/**/*.js'],
        tasks: 'jasmine:test:build'
    jasmine:
      test:
        src: 'lib/**/*.js'
        options:
          outfile: 'spec/index.html'
          specs: 'spec/util-spec.js'
          vendor: ['vendor/bower/jquery/dist/jquery.min.js']

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-umd'

  grunt.registerTask 'default', ['coffee', 'umd', 'jasmine:test:build', 'watch']
