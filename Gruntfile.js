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
            }
        }
    });

    grunt.registerTask('test', ['mochaTest:dev']);

    grunt.loadNpmTasks('grunt-mocha-test');
};
