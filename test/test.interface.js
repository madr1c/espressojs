/**
 * Tests for the object interface
 */

var expect = require('chai').expect;
var Espresso = require('../index');

describe('Interface', function() {
    var iface = new Espresso();

    describe('constructor function', function() {

        it('should take an argument', function() {
            expect( Espresso.length ).to.equal(1);
        });

    });
    
    describe('.deferred', function() {

        it('should be a function', function() {
            expect( iface.deferred ).to.be.a('function');
        });

        it('should return a deferred object', function() {
            var df = iface.deferred();

            expect( df ).to.have.any.keys('promise','resolve','reject');
        });

    });

});
