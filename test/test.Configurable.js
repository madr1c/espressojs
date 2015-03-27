/**
 * Tests for the Configurable object
 */
var _ = require('lodash');
var expect = require('chai').expect;
var Configurable = require('../lib/Configurable.js');

describe('Configurable', function() {

    it('should be a (constructor) function', function() {
        expect( Configurable ).to.be.a('function');
    });

    it('should create an object with an _options property', function() {
        expect( new Configurable()._options ).to.be.an('object');
    });

    describe('.getOption', function() {

        it('should be a function', function() {
            expect( new Configurable().getOption ).to.be.a('function');
        });

        it('should return the correct properties', function() {
            var conf = new Configurable();

            conf._options = {
                'a': 'b',
                'd': function() {}
            };

            _.each( conf._options, function(value, key) {
                expect( conf.getOption(key) ).to.equal(value);
            });
        });
    });

    describe('.setOption', function() {

        it('should be a function', function() {
            expect( new Configurable().setOption ).to.be.a('function');
        });

        it('should update the correct properties', function() {
            var conf = new Configurable();

            var options = {
                'a': 'b',
                'd': function() {}
            };

            _.each( options, function(value, key) {
                conf.setOption(key, value);
                expect( conf._options[key] ).to.equal(value);
            });
        });
    });

    describe('.setAll', function() {

        it('should be a function', function() {
            expect( new Configurable().setAll ).to.be.a('function');
        });

        it('should update the correct properties', function() {
            var conf = new Configurable();

            var options = {
                'a': 'b',
                'd': function() {}
            };

            conf.setAll(options);

            _.each( options, function(key, value) {
                expect( conf._options[key] ).to.equal(value);
            });
        });

    });

});
