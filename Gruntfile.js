/**
 * Gruntfile
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function (grunt) {

  // CSS
  var cssFiles = [
    'css/**/*.css'
  ];

  // JS to be injected into the header
  var headerJS = [
    'vendor/jquery/dist/jquery.min.js',
    'vendor/angular/angular.min.js',
    'vendor/socket.io-client/dist/socket.io.min.js',
  ];

  // JS to be injected into the footer
  var footerJS = [
    'js/packages/*.js', // app dependencies
    'js/app/app.js',
    'js/app/providers/*.js',
    'js/app/config.js',
    'js/app/directives/*.js',
    'js/app/factories/*.js',
    'js/app/routes.js',
    'js/app/controllers/*.js',
    'js/*.js'
  ];

  // Libraries shared between backend and frontend, injected within the footer
  var sharedJS = [
    'GameEngine.js'
  ];


  /**
   * Assign .tmp paths to assets
   */

  // Modify css file injection paths to use 
  cssFiles = cssFiles.map(function (path) {
    return '.tmp/public/' + path;
  });

  // Modify js file injection paths to use 
  footerJS = footerJS.map(function (path) {
    return '.tmp/public/' + path;
  });

  sharedJS = sharedJS.map(function (path) {
    return '.tmp/public/js/shared/' + path;
  });

  headerJS = headerJS.map(function (path) {
    return '.tmp/public/' + path;
  });

  // Get path to core grunt dependencies from Sails
  var depsPath = grunt.option('gdsrc') || 'node_modules/sails/node_modules';
  grunt.loadTasks(depsPath + '/grunt-contrib-clean/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-copy/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-concat/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-watch/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-uglify/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-cssmin/tasks');
  grunt.loadTasks(depsPath + '/grunt-contrib-less/tasks');
  grunt.loadTasks(depsPath + '/grunt-sails-linker/tasks');
  grunt.loadTasks('node_modules/grunt-angular-templates/tasks');
  grunt.loadTasks('node_modules/grunt-contrib-jade/tasks');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Copy
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: './assets',
          src: ['**/*.!(coffee|jade)'],
          dest: '.tmp/public'
        }]
      },
      shared: {
        files: [{
          expand: true,
          cwd: './shared',
          src: ['*.js'],
          dest: '.tmp/public/js/shared'
        }]
      },
      build: {
        files: [{
          expand: true,
          cwd: '.tmp/public',
          src: ['**/*'],
          dest: 'www'
        }]
      }
    },

    // Clean
    clean: {
      dev: ['.tmp/public/**'],
      build: ['www']
    },

    // LESS
    less: {
      dev: {
        files: [{
          expand: true,
          cwd: 'assets/css/',
          src: ['*.less'],
          dest: '.tmp/public/css/',
          ext: '.css'
        }, {
          expand: true,
          cwd: 'assets/css/',
          src: ['*.less'],
          dest: '.tmp/public/css/',
          ext: '.css'
        }]
      }
    },

    // Concat
    concat: {
      concatHeaderJS: {
        src: headerJS,
        dest: '.tmp/public/concat/libs.js'
      },
      concatFooterJS: {
        src: sharedJS.concat(footerJS),
        dest: '.tmp/public/concat/production.js'
      },
      concatCssFiles: {
        src: cssFiles,
        dest: '.tmp/public/concat/production.css'
      }
    },

    // Uglify
    uglify: {
      distHeaderJS: {
        src: ['.tmp/public/concat/libs.js'],
        dest: '.tmp/public/min/libs.js'
      },
      distFooterJS: {
        src: ['.tmp/public/concat/production.js'],
        dest: '.tmp/public/min/production.js'
      }
    },

    // CSS Minify
    cssmin: {
      dist: {
        src: ['.tmp/public/concat/production.css'],
        dest: '.tmp/public/min/production.css'
      }
    },

    // Jade Templates (development)
    jade: {
      templates: {
        cwd: 'views/templates',
        expand: true,
        matchBase: true,
        src: '*.jade',
        dest: '.tmp/public/templates',
        ext: '.html'
      }
    },

    // Compile for Angular $templateCache (production)
    ngtemplates: {
      production: {
        cwd: '.tmp/public/templates',
        matchBase: true,
        src: '*.html',
        dest: '.tmp/public/js/packages/templates.js',
        options: {
          module: 'BullsAndCows.Templates',
          prefix: 'templates',
          htmlmin: {
            collapseBooleanAttributes: true,
            collapseWithspace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true
          }
        }
      }
    },

    // Sails Linker
    'sails-linker': {
      developmentHeaderJS: {
        options: {
          startTag: '// TOP SCRIPTS',
          endTag: '// TOP SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/_meta/*.jade': headerJS
        }
      },

      productionHeaderJS: {
        options: {
          startTag: '// TOP SCRIPTS',
          endTag: '// TOP SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/_meta/*.jade': ['.tmp/public/min/libs.js'],
        }
      },

      developmentFooterJS: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/_meta/*.jade': sharedJS.concat(footerJS)
        }
      },

      productionFooterJS: {
        options: {
          startTag: '// SCRIPTS',
          endTag: '// SCRIPTS END',
          fileTmpl: 'script(type="text/javascript", src="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/_meta/*.jade': ['.tmp/public/min/production.js'],
        }
      },

      developmentCssFiles: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/_meta/*.jade': cssFiles
        }
      },

      productionCssFiles: {
        options: {
          startTag: '// STYLES',
          endTag: '// STYLES END',
          fileTmpl: 'link(rel="stylesheet", href="%s")',
          appRoot: '.tmp/public'
        },
        files: {
          'views/_meta/*.jade': ['.tmp/public/min/production.css']
        }
      }
    },

    // Watch
    watch: {
      assets: {
        // Assets and front/backend shared libs to watch:
        files: ['assets/**/*', 'shared/*', 'views/templates/**/*'],
        // When assets are changed:
        tasks: ['compileAssets', 'injectResourceTags']
      }
    }
  });

  // Compile assets
  grunt.registerTask('compileAssets', [
    'clean:dev',
    'less:dev',
    'copy:dev',
    'copy:shared',
    'jade:templates'
  ]);

  // Bundle Assets
  grunt.registerTask('injectResourceTags', [
    'sails-linker:developmentHeaderJS',
    'sails-linker:developmentFooterJS',
    'sails-linker:developmentCssFiles'
  ]);

  // Development
  grunt.registerTask('default', [
    'compileAssets',
    'injectResourceTags',
    'watch'
  ]);

  // Production
  grunt.registerTask('prod', [
    'compileAssets',
    'ngtemplates:production',
    'concat',
    'uglify',
    'cssmin',
    'sails-linker:productionHeaderJS',
    'sails-linker:productionFooterJS',
    'sails-linker:productionCssFiles'
  ]);
};