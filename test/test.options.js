/**
 * Test for espressojs options
 */
var Espresso = require('../index');
var _ = require('lodash');
var expect = require('chai').expect;

describe('Instance', function() {

    it('should have a .getOption() function', function() {
        var e = new Espresso();
        expect( e.getOption ).to.be.a('function');
    });

    it('should have a .setOption() function', function() {
        var e = new Espresso();
        expect( e.setOption ).to.be.a('function');
    });

    describe('defaults', function() {

        var e = new Espresso();

        var defs = [
            { key: 'skipMissingHandlers', value:true },
            { key: 'protocol', value: 'http' },
            { key: 'hostname', value: 'localhost' },
            { key: 'apiRoot', value: '/' },
            { key: 'cascading', value: true},
            { key: 'port', value: '' },
            { key: 'rewriteEmpty', value: '/' }
        ];

        _.each( defs, function(what) {

            it('should have .' + what.key + ' w/ ' + what.value, function() {
                expect( e.getOption(what.key) ).to.equal(what.value);
            });

        });

    });

    describe('constructor', function() {

        var options = [
            { key: 'skipMissingHandlers', value:false },
            { key: 'protocol', value: 'https' },
            { key: 'hostname', value: 'example.com' },
            { key: 'apiRoot', value: '/api/v1' },
            { key: 'nondef', value: 'yes'},
            { key: 'cascading', value: false},
            { key: 'port', value: 1337 },
            { key: 'rewriteEmpty', value: '/dev/null' }
        ];

        var e = new Espresso({
            skipMissingHandlers: false,
            protocol: 'https',
            hostname: 'example.com',
            apiRoot: '/api/v1',
            nondef: 'yes',
            cascading: false,
            port: 1337,
            rewriteEmpty: '/dev/null'
        });

        _.each( options, function(what) {

            it('should have .' + what.key + ' set to ' + what.value, function() {
                expect( e.getOption(what.key) ).to.equal(what.value);
            });

        });
    });

});
