/**
 * espressojs Gruntfile
 */

module.exports = function(grunt) {

    grunt.initConfig({
        mochaTest: {
            dev: {
                options: {
                    reporter: 'spec'
                },

                src: ['test/test.*.js']
            },

            nyan: {
                options: {
                    reporter: 'nyan'
                },

                src: ['test/test.*.js']
            }
        }
    });

    grunt.registerTask('test', ['mochaTest:dev']);
    grunt.registerTask('fancyTest', ['mochaTest:nyan']);

    grunt.loadNpmTasks('grunt-mocha-test');
};
