module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    config: {
      sources: 'lib',
      tests: 'test',
      dist: 'dist'
    },

    jshint: {
      src: [
        ['<%=config.sources %>']
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        jshintrc: true
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec',
          require: [
            './test/expect.js'
          ]
        },
        src: ['test/**/*.js']
      }
    },

    browserify: {
      bower: {
        files: {
          '<%= config.dist %>/bpmn-moddle.js': [ '<%= config.sources %>/simple.js' ]
        },
        options: {
          browserifyOptions: {
            builtins: false
          },
          bundleOptions: {
            standalone: 'BpmnModdle',
            detectGlobals: false,
            insertGlobalVars: [],
            debug: false
          },

          transform: [ [
            'exposify',
            { global: true, expose: { 'lodash': '_' } }
          ]]
        }
      }
    },

    release: {
      options: {
        tagName: 'v<%= version %>',
        commitMessage: 'chore(project): release v<%= version %>',
        tagMessage: 'chore(project): tag v<%= version %>'
      }
    },

    watch: {
      test: {
        files: [ '<%= config.sources %>/**/*.js', '<%= config.tests %>/spec/**/*.js' ],
        tasks: [ 'test' ]
      }
    },

    jsdoc: {
      dist: {
        src: [ '<%= config.sources %>/**/*.js' ],
        options: {
          destination: 'docs/api',
          plugins: [ 'plugins/markdown' ]
        }
      }
    }
  });

  // tasks

  grunt.registerTask('test', [ 'mochaTest' ]);

  grunt.registerTask('auto-test', [ 'test', 'watch:test' ]);

  grunt.registerTask('default', [ 'jshint', 'test', 'jsdoc' ]);
};