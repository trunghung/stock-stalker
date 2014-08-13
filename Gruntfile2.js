module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		jshint: {
			all: 'js/*.js'
		},
		uglify: {
			options: {
				mangle: false,
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/*.js',
				dest: 'build/*.min.js'
			}
		},
		stylus: {
			compile: {
				options: {
					paths: ['css/*styl'],
					urlfunc: 'embedurl', // use embedurl('test.png') in our code to trigger Data URI embedding
					use: [
						require('fluidity') // use stylus plugin at compile time
					],
					import: [      //  @import 'foo', 'bar/moo', etc. into every .styl file
						//'foo',       //  that is compiled. These might be findable based on values you gave
						//'bar/moo'    //  to `paths`, or a plugin you added under `use`
					]
				},
				files: {
					'build/css/test.css': ['css/*.styl'] // compile and concat into single file
				}
			}
		},
		imagemin: {
			dist: {
				options: {
					cache: false
				},
				files: [{
					expand: true,
					cwd: 'images',
					src: ['*.{png,jpg,gif}'],
					dest: 'build/images/'
				}]
			}
		},
		includes: {
			files: {
				src: ['*.html'],
				dest: 'build',
				flatten: true,
				cwd: '.',
				options: {
					silent: true
				}
			}
		},
		watch: {
			js: {
				files: 'js/*.js',
				tasks: ['jshint','uglify'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			css: {
				files: 'css/*.styl',
				tasks: ['stylus'],
				options: {
					spawn: false,
					livereload: true
				}
			},
			files: '**/*.html',
			tasks: ['includes'],
			options: {
				spawn: false,
				livereload: true
			}
		}
	});

// Load the plugin that provides the tasks.
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-uglify');

// Default task(s).
	grunt.registerTask('default', ['grunt-contrib-stylus','jshint', 'stylus', 'uglify']);

};
