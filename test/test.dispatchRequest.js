/**
 * Tests for the .dispatchRequest() function
 */
var Espresso = require('../index');
var expect   = require('chai').expect;
var _ = require('lodash');

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

        it("should get the response on error", function(done) {
            var e = new Espresso();
            var p = e.dispatchRequest();
            p.catch( function(response) {
                expect( response ).to.be.an('object');
                done();
            });
        });

        it('should resolved after processing was successful', function(done) {
            var e = new Espresso();
            var req = new Espresso.Request();
            req.path = "/api/v1/users/test";
            req.method = "get";

            e.resource('/api/:version/:collection', function() {});
            e.resource('/api/:version', function() {});
            e.resource('/api', function() {});
            e.resource('/api/:version/:collection/:id', function() {});

            var p = e.dispatchRequest(req);

            p.then(function() {
                done();
            });
            p.catch( function() {
                done('failed');
            });
        });

    });

    it('should create a 500 when no method is given', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request();
        req.path = "/a/b/c";

        e.resource('/a/b/c', function() {
            done( new Error('Function should not be invoked') );
        });

        var promise = e.dispatchRequest(req);
        promise.catch( function() {
            done();
        });
    });

    it('should create a 500 when no path is given', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request();
        req.method = "get";

        var promise = e.dispatchRequest(req);
        promise.catch( function() {
            done();
        });
    });

    it('should create a 500 when an unknown method is given', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request();
        req.method = "blah";

        var promise = e.dispatchRequest(req);
        promise.catch( function() {
            done();
        });
    });

    it('should not change the given request object', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request();
        req.path = "/api/v1/users/test";
        req.method = "get";

        var tmp = _.clone(req);

        e.resource('/api/:version/:collection', function() {});
        e.resource('/api/:version', function() {});
        e.resource('/api', function() {});
        e.resource('/api/:version/:collection/:id', function() {});

        var p = e.dispatchRequest(req);

        p.then(function() {
            console.log('Running.');
            _.each(tmp, function(value, key) {
                expect( req[key] ).to.equal(value);
            });

            done();

        });
        p.catch( function() {
            done('failed');
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

        it('should receive the value from the previous function', function(done) {
            var e = new Espresso();
            var r = new Espresso.Request({method: 'get', path: '/one/two/three'});

            e.resource('/one', function() {
                return { one: true };
            });

            e.resource('/one/two', function(k1, k2, k3, value) {
                expect( value.one ).to.be.true;
                return _.extend( value, {two: true});
            });

            e.resource('/one/two/three', function(k1, k2, k3, value) {

                expect( value.one ).to.be.true;
                expect( value.two ).to.be.true;

                done();

            });

            e.dispatchRequest( r );
        });

    });


});
