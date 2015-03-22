/**
 * Tests for Espresso.Request
 */
var Espresso = require('../index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('Espresso.Request', function() {

    var properties = [
        { property: 'method'},
        { property: 'body'},
        { property: 'hostname'},
        { property: 'ip'},
        { property: 'path'},
        { property: 'protocol'},
        { property: 'query'},
        { property: 'cookie'},
        { property: 'header'},
        { property: 'api'},
        { property: 'params'}
    ];

    it('should be a (constructor) function', function() {
        expect( Espresso.Request ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( Espresso.Request.length ).to.equal(1);
    });

    it('should create default instances when no argument is given', function() {
        var i = new Espresso.Request();

        expect( i ).to.be.an('object');

        _.each( properties, function(prop) {
            expect( i ).to.have.ownProperty(prop.property);
        });
    });

    it('should inherit from a given object overwriting default values', function() {
        var i = new Espresso.Request({ method: 'get', blah: 'meh' });

        expect( i.method ).to.equal('get');
        expect( i.blah ).to.exist;
        expect( i.blah ).to.equal('meh');
    });

});
