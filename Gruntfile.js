/**
 * Gruntfile
 * More information on using Grunt to work with static assets:
 * http://gruntjs.com/configuring-tasks
 */

module.exports = function(grunt) {

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
        'js/packages/*.js',
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
    var commonJS = [
        'GameEngine.js'
    ];

    /**
     * Assign .tmp paths to assets
     */

    // Modify css file injection paths to use 
    cssFiles = cssFiles.map(function(path) {
        return '.tmp/public/' + path;
    });

    // Modify js file injection paths to use 
    footerJS = footerJS.map(function(path) {
        return '.tmp/public/' + path;
    });

    commonJS = commonJS.map(function(path) {
        return '.tmp/public/js/shared/' + path;
    });

    headerJS = headerJS.map(function(path) {
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

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: './assets',
                    src: ['**/*.!(coffee)'],
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

        clean: {
            dev: ['.tmp/public/**'],
            build: ['www']
        },

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

        concat: {
            concatHeaderJS: {
                src: headerJS,
                dest: '.tmp/public/concat/libs.js'
            },
            concatFooterJS: {
                src: commonJS.concat(footerJS),
                dest: '.tmp/public/concat/production.js'
            },
            concatCssFiles: {
                src: cssFiles,
                dest: '.tmp/public/concat/production.css'
            }
        },

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

        cssmin: {
            dist: {
                src: ['.tmp/public/concat/production.css'],
                dest: '.tmp/public/min/production.css'
            }
        },

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
                    'views/_meta/*.jade': commonJS.concat(footerJS)
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

        watch: {
            api: {
                // API files to watch:
                files: ['api/**/*']
            },

            assets: {
                // Assets and front/backend shared libs to watch:
                files: ['assets/**/*', 'shared/*'],
                // When assets are changed:
                tasks: ['compileAssets', 'injectResourceTags']
            }
        }
    });

    // When Sails is lifted:
    grunt.registerTask('default', [
        'compileAssets',
        'injectResourceTags',
        'watch'
    ]);

    // Compile assets
    grunt.registerTask('compileAssets', [
        'clean:dev',
        'less:dev',
        'copy:dev',
        'copy:shared'
    ]);

    // Bundle Assets
    grunt.registerTask('injectResourceTags', [
        'sails-linker:developmentHeaderJS',
        'sails-linker:developmentFooterJS',
        'sails-linker:developmentCssFiles'
    ]);

    // When sails is lifted in production
    grunt.registerTask('prod', [
        'compileAssets',
        'concat',
        'uglify',
        'cssmin',
        'sails-linker:productionHeaderJS',
        'sails-linker:productionFooterJS',
        'sails-linker:productionCssFiles'
    ]);
};