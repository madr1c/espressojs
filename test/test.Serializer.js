/**
 * Tests for the serializer function
 */

var expect = require('chai').expect;
var Espresso = require('../index');

describe('Serializer', function() {

    it('should have a default value', function() {
        var e = new Espresso();

        expect( e._serializer ).to.be.a('function');
    });

    describe('setter', function() {
        var iface = new Espresso();

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

    describe('getter', function() {

        it('should be a function', function() {
            var iface = new Espresso();
            expect( iface.getSerializer ).to.be.a('function');
        });

        it('should return what .setSerializer has set', function() {
            var inst = new Espresso();
            var fn = function() {};

            inst.setSerializer(fn);
            expect( inst.getSerializer() ).to.equal(fn);
        });

        it('should return a default function if not set', function() {
            var iface = new Espresso();
            expect( iface.getSerializer() ).to.equal( require('../lib/Serializer') );
        });
    });

    describe('function', function() {

        it('should be invoked as the last function in the chain', function(done) {

            var e = new Espresso();
            var req = new Espresso.Request();
            req.path = "/api/v1/users/test";
            req.method = "get";
            var handle = 0;

            e.setSerializer( function() {
                if( 4 !== handle )
                    done('Failed, handle != 4');
                else
                    done();
            });

            e.resource('/api/:version/:collection', function() {
                if( 2 !== handle )
                    done('/api/:version/:collection was not called in order');
                else
                    handle++;
            });

            e.resource('/api/:version', function() {
                if( 1 !== handle )
                    done('/api/:version was not called in order');
                else
                    handle++;
            });

            e.resource('/api', function() {
                if( 0 !== handle )
                    done('/api was not called at first');
                else
                    handle++;
            });

            e.resource('/api/:version/:collection/:id', function() {
                if( 3 !== handle )
                    done('/api/:version/:collection/:id was not called in order');
                else
                    handle++;
            });

            var p = e.dispatchRequest(req);

            p.catch( function() {
                done('failed');
            });

        });

    });



});
