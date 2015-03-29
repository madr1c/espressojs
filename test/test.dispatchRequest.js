/**
 * Tests for the .dispatchRequest() function
 */
var Espresso = require('../index');
var expect   = require('chai').expect;
var _ = require('lodash');
var verbs = require('../lib/utils').verbs;

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
        promise.catch( function(response) {
            expect( response.body.error ).to.be.a('string');
            expect( response.body.error ).to.equal('"invalid Espresso.Request given"');
            done();
        });
    });

    it('should create a 500 when no path is given', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request();
        req.method = "get";

        var promise = e.dispatchRequest(req);
        promise.catch( function(response) {
            expect( response.body.error ).to.equal('"invalid Espresso.Request given"');
            done();
        });
    });

    it('should create a 500 when an unknown method is given', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request();
        req.method = "blah";

        var promise = e.dispatchRequest(req);
        promise.catch( function(response) {
            expect( response.body.error ).to.equal('"invalid Espresso.Request given"');
            done();
        });
    });

    it('should create a 400 if the resource is missing', function(done) {
        var e = new Espresso();
        var req = new Espresso.Request({method: 'get', path: '/404/not/found'});

        var promise = e.dispatchRequest(req);
        promise.catch( function(response) {
            expect( response.body.error ).to.equal('"resource not found"');
            done();
        });
    });

    it('should create a 500 if the handler chain is not complete', function(done) {
        var e = new Espresso( { skipMissingHandlers: false });
        var req = new Espresso.Request({method: 'get', path: '/handler/no-handler/handler'});

        e.resource('/handler', function(){});
        // Handler for /handler/:something is missing
        e.resource('/handler/:something/handler', function(){});

        var promise = e.dispatchRequest(req);
        promise.catch( function(response) {
            expect( response.body.error ).to.equal('"incomplete resource handler chain"');
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
            _.each(tmp, function(value, key) {
                expect( req[key] ).to.equal(value);
            });

            done();

        });
        p.catch( function() {
            done('failed');
        });
    });

    describe('should call the correct function for', function() {
        var e = new Espresso();

        // Methods
        var methods = _.keys(verbs);

        var handlers;
        var path;

        _.each( methods, function(method) {
            it(method, function(done) {
                handlers = {};
                handlers[method] = function() { done(); }; // correct handler
                path = "/" + method;

                _.each( methods, function(hm) {

                    if( hm != method )
                        handlers[hm] = function() { done('failed'); };
                });

                e.resource(path, handlers);
                e.dispatchRequest( new Espresso.Request({method:method, path:path}) );
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

        it('should have access to the URL parameters', function(done) {
            var e = new Espresso();
            var r = new Espresso.Request({method: 'get', path: '/api'});

            e.resource('/:something', function(request, response, api, value) {
                expect( request.params ).to.be.an('object');
                done();
            });

            e.dispatchRequest(r);

        });

        it('should get the correct URL paramters', function(done) {
            var e = new Espresso();
            var r = new Espresso.Request({method: 'get', path: '/api/v1/users/max'});

            var params = {
                'what': 'api',
                'version': 'v1',
                'collection': 'users',
                'id': 'max'
            };

            e.resource('/api', function() {});
            e.resource('/api/v1', function() {});
            e.resource('/api/v1/users', function() {});
            e.resource('/:what/:version/:collection/:id', function(req, res, api, val) {

                expect( req.params ).to.deep.equal(params);
                done();
            });

            e.dispatchRequest(r);
        });

    });

    describe('handler chain', function() {

        it('should stop if a handler returns a rejected promise', function() {
            var e = new Espresso();

            e.resource('/a', function(a,b,api) {
                var d = api.deferred();
                d.reject('meh');

                return d.promise;
            });

            e.resource('/a/b', function() {
                throw new Error('Should not be called');
            });

            var p = e.dispatchRequest( new Espresso.Request({ path: '/a/b', method: 'get'}) );

            // Mute when.js
            p.catch( function(){} );
        });

        it('should not be used when the handler option `cascading` is set to `false`', function(done) {
            var e = new Espresso();

            e.resource('/a', function() {
                done('failed');
            });

            e.resource('/a/b', function() {
                done('failed');
            });

            e.resource('/a/b/c', function(){
                done();
            }, { cascading: false});

            var req = new Espresso.Request({ method:'get', path: '/a/b/c' });

            e.dispatchRequest(req);
        });

        it('should use the latest handler with `cascading` is set to `false` as first', function(done) {
            var e = new Espresso();

            e.resource('/a', function() {
                done('failed');
            });

            e.resource('/a/b', function() {
                done('failed');
            });

            e.resource('/a/b/c', function(){
                return 'first';
            }, { cascading: false});

            e.resource('/a/b/c/d', function(a,b,c,d){
                expect( d ).to.equal('first');
                return 'second';
            });

            e.resource('/a/b/c/d/e', function(a,b,c,d){
                expect( d ).to.equal('second');
                done();
            });

            var req = new Espresso.Request({ method:'get', path: '/a/b/c/d/e' });

            e.dispatchRequest(req);
        });

        it('should reject the returned promise if a handler returns a rejected promise', function(done) {
            var e = new Espresso();

            e.resource('/a', function(a,b,api) {
                var d = api.deferred();

                d.reject('meh');

                return d.promise;
            });

            e.resource('/a/b', function() {
                throw new Error('Should not be called');
            });

            var p = e.dispatchRequest( new Espresso.Request({ path: '/a/b', method: 'get'}) );

            p.then(function() {
                done('failed');
            }).catch( function() {
                done();
            });
        });

        it('should set the response body correctly if a handler returns a rejected promise', function(done) {
            var e = new Espresso();

            e.resource('/a', function(a,b,api) {
                var d = api.deferred();

                d.reject('meh');

                return d.promise;
            });

            e.resource('/a/b', function() {
                throw new Error('Should not be called');
            });

            var p = e.dispatchRequest( new Espresso.Request({ path: '/a/b', method: 'get'}) );

            p.then(function() {
                done('failed');
            }).catch( function(response) {

                expect( response.rawBody ).to.equal('meh');
                done();
            });
        });

    });

    describe('context', function() {

        it('should contain a __espressojs key', function(done) {
            var e = new Espresso();
            e.resource('/a', function(){
                expect(this.__espressojs).to.be.an('object');
                done();
            });

            e.dispatchRequest( new Espresso.Request({method:'get', path:'/a'}) );
        });

        it('should contain a __espressojs.chainIsComplete key', function(done) {
            var e = new Espresso();
            e.resource('/a', function(){
                expect(this.__espressojs.chainIsComplete).not.to.be.undefined;
                done();
            });

            e.dispatchRequest( new Espresso.Request({method:'get', path:'/a'}) );
        });

        it('should contain a __espressojs.handler key', function(done) {
            var e = new Espresso();

            var pattern = '/a';
            var fn = function() {
                expect(this.__espressojs.handler).not.to.be.undefined;
                expect(this.__espressojs.handler.getPattern().getPattern()).to.equal(pattern);
                expect(this.__espressojs.handler.getCallback('get') ).to.equal(fn);
                done();
            };

            e.resource( pattern, fn );

            e.dispatchRequest( new Espresso.Request({method:'get', path:pattern}) );
        });

        it('should contain a __espressojs.path key with the current path', function(done) {

            var e = new Espresso({cascading: false});

            e.resource('/api', function() {
                expect( this.__espressojs.path ).to.equal('/api');
            });

            e.resource('/api/v1', function() {
                expect( this.__espressojs.path ).to.equal('/api/v1');
            });

            e.resource('/api/v1/doc', function() {
                expect( this.__espressojs.path ).to.equal('/api/v1/doc');
                done();
            });

            var p = e.dispatchRequest( new Espresso.Request({method: 'get', path: '/api/v1/doc'}) );
            p.catch( function() {
                done('failed - catched');
            });

        });

    });

    describe('global "cascading" flag', function() {

        it('should prevent cascading when set to false', function(done) {

            var e = new Espresso({cascading: false});

            e.resource('/api', function() {
                done('failed');
            });

            e.resource('/api/v1', function() {
                done('failed');
            });

            e.resource('/api/v1/doc', function() {
                done();
            });

            e.dispatchRequest( new Espresso.Request({method: 'get', path: '/api/v1/doc'}) );

        });

    });
});
