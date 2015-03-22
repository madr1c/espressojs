/**
 * Tests for the object interface
 */

var expect = require('chai').expect;
var Espresso = require('../index');

describe('Interface', function() {
    var iface = new Espresso();

    describe('.resource', function() {

        it('should be a function', function() {
            expect( iface.resource ).to.be.a('function');
        });

        it('should take three arguments', function() {
            expect( iface.resource.length ).to.equal(3);
        });

        it('should throw if no arguments are given', function() {
            var inst = new Espresso();
            var fn = function() { inst.resource(); };

            expect( fn ).to.throw(/arguments/);
        });

        it('should throw if one arguments is given', function() {
            var inst = new Espresso();
            var fn = function() { inst.resource('pattern'); };

            expect( fn ).to.throw(/arguments/);
        });

        it('should throw if an invalid pattern is given', function() {
            var inst = new Espresso();
            var fn = function() { inst.resource(42, function(){}); };

            expect( fn ).to.throw(/pattern/);
        });

        it('should throw if an invalid callback is given', function() {
            var inst = new Espresso();
            var fn = function() { inst.resource('pattern', 42); };

            expect( fn ).to.throw(/callback/);
        });

        it('should not throw if a function or an object with handlers is given', function() {
            var inst = new Espresso();
            inst.resource('pattern', function(){} );
            inst.resource('pattern', { get: function(){} });
        });

    });

    describe('.promise', function() {

        it('should be a function', function() {
            expect( iface.promise ).to.be.a('function');
        });

        it('should return a deferred object', function() {
            var df = iface.promise();

            expect( df ).to.have.any.keys('promise','resolve','reject');
        });

    });

});
