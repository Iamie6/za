'use strict';
module.exports = function(grunt) {

	// grunt.file.defaultEncoding = 'gbk';
	require('load-grunt-tasks')(grunt);
	grunt.loadNpmTasks('grunt-unicode');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		meta: {
			banner: '/*!\n' +
				'* <%= pkg.name %>\n' +
				'* v <%= pkg.version %>\n' +
				'* svn <%= pkg.svn %>\n' +
				'* <%= grunt.template.today("yyyy-mm-dd hh:ss") %>\n' +
				'* <%= pkg.pubInfo %>\n' +
				'*/\n'
		},
		concat: {
			options: {
				// separator: '/*又一个文件*/',
				banner: '<%= meta.banner %>'
			},
			dist: {
				files: {
					'build/comment.js': ['js/base.js', 'js/msg.js', 'js/login.js', 'js/app.js', 'js/cmnt.js'],
					'build/bbs.js': ['js/bbs.js'],
					'build/report.js': ['js/report.js'],
					'build/my_comment.js':['js/my2/base.js', 'js/my2/msg.js', 'js/my2/login.js', 'js/my2/app.js', 'js/my2/cmnt.js']
				}
			}
		},
		uglify: {
			options: {
				banner: '<%= meta.banner %>'
			},
			dist: {
				files: {
					'build/comment.min.js': 'build/comment.js',
					'build/bbs.min.js': 'build/bbs.js',
					'build/report.min.js': 'build/report.js',
					'build/my_comment.min.js':'build/my_comment.js'
				}
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'js/*.js'
			]
		},
		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			strict: {
				options: {
					import: 2
				},
				src: ['css/*.css']
			},
			lax: {
				options: {
					import: false
				},
				src: ['path/to/**/*.css']
			}
		},
		unicode: {
			main: {
				files: [{
					expand: true,
					// cwd: 'src',
					src: ['build/*.js','js/print.js']
					// dest: 'build/'
				}]
			},
		},
		jsdoc: {
			dist: {
				src: ['js/base.js', 'js/msg.js', 'js/login.js', 'js/app.js', 'js/cmnt.js'],
				options: {
					// destination: 'doc',
					destination: 'doc/docstrap',
					template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
					configure: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json',
					tutorials: 'tutorials'
				}

			}
		},
		yuidoc: {
			compile: {
				name: '<%= pkg.name %>',
				version: '<%= pkg.version %>',
				options: {
					paths: 'js',
					outdir: 'doc/yuidoc'
				}
			}
		}
	});
	grunt.registerTask('doc', ['yuidoc']);
	// grunt.registerTask('doc', ['jsdoc']);
	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('build', [
		'csslint',
		'jshint',
		'concat',
		'uglify',
		'unicode'
	]);
};