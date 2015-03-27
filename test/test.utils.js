/**
 * Tests for the internal utilities module
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');
var utils = require('../lib/utils');

describe('Utils', function() {

    // .verbs
    describe('.verbs', function() {
        it('should be an object', function() {
            expect( utils.verbs ).to.be.an('object');
        });

        it('should contain a mapping of HTTP verbs to functions', function(){

            _.each( utils.verbs, function(value, key) {

                expect( key ).to.be.a('string');
                expect( value ).to.be.a('function');
            });

        });

    });

    // .handlers
    describe('.handlers', function() {
        it('should be an object', function() {
            expect( utils.handlers ).to.be.an('object');
        });

        ['def', 'options'].forEach( function(what) {
            it('should have a key '+what+' referencing a function', function() {
                expect( utils.handlers[what] ).to.be.a('function');
            });
        });
    });

    // .createErrorResponse
    describe('.createErrorResponse', function() {
        it('should be a function', function() {
            expect( utils.createErrorResponse ).to.be.a('function');
        });
    });

});
