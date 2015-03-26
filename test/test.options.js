/**
 * Test for espressojs options
 */
var Espresso = require('../index');
var _ = require('lodash');
var expect = require('chai').expect;

describe('Options', function() {

    it('should be an object', function() {
        var e = new Espresso();
        expect( e.options ).to.be.an('object');
    });

    it('should have a .get() function', function() {
        var e = new Espresso();
        expect( e.options.get ).to.be.a('function');
    });

    it('should have a .set() function', function() {
        var e = new Espresso();
        expect( e.options.set ).to.be.a('function');
    });

    describe('setter', function() {
        var e = new Espresso();

        var options = [
            { key: 'skipMissingHandlers', value:true },
            { key: 'protocol', value: 'https' },
            { key: 'hostname', value: 'example.org' },
            { key: 'apiRoot', value: '/api/v1' }
        ];

        _.each( options, function(what) {

            it('should set .' + what.key + ' to ' + what.value, function() {
                expect( e.options.get(what.key) ).not.to.equal(what.value);
                e.options.set(what.key, what.value);
                expect( e.options.get(what.key) ).to.equal(what.value);
            });

        });
    });

    describe('defaults', function() {

        var e = new Espresso();

        var defs = [
            { key: 'skipMissingHandlers', value:true },
            { key: 'protocol', value: 'http' },
            { key: 'hostname', value: 'localhost' },
            { key: 'apiRoot', value: '' }
        ];

        _.each( defs, function(what) {

            it('should have .' + what.key + ' w/ ' + what.value, function() {
                expect( e.options.get(what.key) ).to.equal(what.value);
            });

        });

    });

    describe('constructor object', function() {


        var options = [
            { key: 'skipMissingHandlers', value:true },
            { key: 'protocol', value: 'https' },
            { key: 'hostname', value: 'example.com' },
            { key: 'apiRoot', value: '/api/v1' },
            { key: 'nondef', value: 'yes'}
        ];

        var e = new Espresso({
            skipMissingHandlers: false,
            protocol: 'https',
            hostname: 'example.com',
            apiRoot: '/api/v1',
            nondef: 'yes'
        });

        _.each( options, function(what) {

            it('should have .' + what.key + ' set to ' + what.value, function() {
                expect( e.options.get(what.key) ).to.equal(what.value);
            });

        });
    });

});
