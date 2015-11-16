/*
  backgrid-query-select
  http://github.com/natearmagost/backgrid-query-select
*/

"use strict";

module.exports = function (grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON("package.json"),

    clean: {
      options: {
        force: true
      },
      "default": [
        "backgrid-query-select.min.js"
      ]
    },
    uglify: {
      options: {
        mangle: true,
        compress: {
            drop_console: false
        },
        report: 'min',
        preserveComments: "some"
      },
      "default": {
        files: {
          "backgrid-query-select.min.js": ["backgrid-query-select.js"]
        }
      }
    },
    jshint: {
      options: {
          strict: true,
          curly: true,
          eqeqeq: true,
          undef: true,
          es3: true,
          forin: true,
          noempty: true,
          freeze: true,
          indent: 2,
          nonbsp: true,
          immed: true,
          browser: true
      },
      uses_defaults: [
          'backgrid-query-select.js'
      ]
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask("default", ["clean", "jshint", "uglify"]);
};