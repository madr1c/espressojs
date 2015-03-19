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

    });

    describe('.promise', function() {

        it('should be a function', function() {
            expect( iface.promise ).to.be.a('function');
        });

        it('should return a deferred object', function() {
            var df = iface.promise();

            expect( df ).to.have.all.keys(['promise','resolve','reject']);
        });

    });

    describe('.dispatchRequest', function() {

        it('should be a function', function() {
            expect( iface.dispatchRequest ).to.be.a('function');
        });

        it('should take three arguments', function() {
            expect( iface.dispatchRequest.length ).to.equal(3);
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
            expect( inst.getSerializer() ).to.be.undefined;
        });
    });


});
