/**
 * Tests for the .dispatchRequest() function
 */
var Espresso = require('../index');
var expect   = require('chai').expect;

describe('.dispatchRequest', function() {
    var iface = new Espresso();

    it('should be a function', function() {
        expect( iface.dispatchRequest ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( iface.dispatchRequest.length ).to.equal(1);
    });

    it('should return a promise', function() {
        var req = new Espresso.Request();
        req.path = "";
        var p = iface.dispatchRequest(req);
        expect( p.then ).to.be.a('function');
        expect( p.catch ).to.be.a('function');

        // Mute when.js warnings
        p.catch(function(){});
    });

    describe("the returned promise", function() {

        it('should be rejected if invalid arguments are given', function(done) {
            var p = iface.dispatchRequest();

            p.then(function() {
                done('failed');
            }).catch( function(){
                done();
            });
        });

    });

    describe("registered functions", function() {

        it('should be called in the correct order', function(done) {
            var e = new Espresso();
            var req = new Espresso.Request();
            req.path = "/api/v1/users/test";
            req.method = "get";
            var handle = 0;

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
                    done();
            });

            var p = e.dispatchRequest(req);

            p.catch( function() {
                done('failed');
            });

        });

    });


});
