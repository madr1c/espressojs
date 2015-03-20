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
            var fn = function() { inst.resource(42); };

            expect( fn ).to.throw(/pattern/);
        });

        it('should throw if an invalid callback is given', function() {
            var inst = new Espresso();
            var fn = function() { inst.resource('pattern', 42); };

            expect( fn ).to.throw(/callback/);
        });

        it('should throw if there are no handlers in the given object', function() {
            var inst = new Espresso();
            var fn = function() { inst.resource('pattern',{noverb:function(){}}); };

            expect( fn ).to.throw(/callback/);
        });

        it('should not throw if a function or an object with handlers is given', function() {
            var inst = new Espresso();
            var fn0 = function() { inst.resource('pattern', function(){} ); };
            var fn1 = function() { inst.resource('pattern', { get: function(){} }); };

            expect( fn0 ).not.to.throw(/callback/);
            expect( fn1 ).not.to.throw(/callback/);
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

    describe('.dispatchRequest', function() {

        it('should be a function', function() {
            expect( iface.dispatchRequest ).to.be.a('function');
        });

        it('should take one argument', function() {
            expect( iface.dispatchRequest.length ).to.equal(1);
        });

    });

    describe('.setSerializer', function() {

        it('should be a function', function() {
            expect( iface.setSerializer ).to.be.a('function');
        });

        it('should take one argument', function() {
            expect( iface.setSerializer.length ).to.equal(1);
        });

        it('should throw if no argument was given', function() {
            var inst = new Espresso();
            var fn = function() {
                inst.setSerializer();
            };

            expect( fn ).to.throw(/.*/);
        });
    });

    describe('.getSerializer', function() {

        it('should be a function', function() {
            expect( iface.getSerializer ).to.be.a('function');
        });

        it('should return what .setSerializer has set', function() {
            var inst = new Espresso();
            var fn = function() {};

            inst.setSerializer(fn);
            expect( inst.getSerializer() ).to.equal(fn);
        });

        it('should return a default function if not set', function() {
            expect( iface.getSerializer() ).to.be.undefined;
        });
    });


});
