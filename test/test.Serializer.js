/**
 * Tests for the serializer function
 */

var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');

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

        it('should get the request, the response, the api and a value', function(done) {
            var e = new Espresso();
            var req = new Espresso.Request();
            req.path = "/api";
            req.method = "get";

            e.resource('/api', function() {
                return 'meh';
            });

            e.setSerializer( function(request, response, api, value) {

                expect( arguments.length ).to.equal(4);
                expect( value ).to.equal( 'meh' );

                done();
            });

            e.dispatchRequest( req );
        });

        it('should have empty parameters and the default path', function(done) {
            var e = new Espresso();
            var req = new Espresso.Request();
            req.path = "/api/2";
            req.method = "get";

            e.resource('/api', function() {
            });

            e.resource('/api/2', function() {
            });

            e.setSerializer( function(request, response, api, value) {

                expect( _.keys(request.params).length ).to.equal(0);
                expect( request.path ).to.equal('/api/2');

                done();
            });

            e.dispatchRequest( req );
        });

    });

    describe('default function', function() {

        it('it should forward a serialized JSON', function(done) {

            var e = new Espresso();
            var req = new Espresso.Request({method:'get', path:'/api/users/max'});

            e.resource('/api', function(){});
            e.resource('/api/:collection', function() {
                return [
                    { name: 'john'  },
                    { name: 'jack'  },
                    { name: 'max'   },
                    { name: 'sarah' }
                ];
            });

            e.resource('/api/users/:name', function(req, res, api, users) {
                var target = _.find(users, {name:'max'});

                if( ! _.isObject(target) )
                    res.setStatus('404');
                else
                    return target;

            });

            e.dispatchRequest(req).then( function(response) {
                expect( response.body ).to.be.a('string');
                expect( response.body ).to.equal( JSON.stringify({name:'max'}) );
                done();
            });

        });

    });


});
