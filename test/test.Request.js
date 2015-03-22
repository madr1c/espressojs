/**
 * Tests for Espresso.Request
 */
var Espresso = require('../index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('Espresso.Request', function() {

    it('should be a (constructor) function', function() {
        expect( Espresso.Request ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( Espresso.Request.length ).to.equal(1);
    });

    it('should create default instances when no argument is given', function() {
        var i = new Espresso.Request();

        expect( i ).to.be.an('object');

        _.each( [
            'method', 'body', 'hostname',
            'ip', 'path', 'protocol',
            'query', 'cookie', 'header',
            'api'
        ], function(prop) {
            expect( i ).to.have.ownProperty(prop);
        });
    });

});
