/**
 * Tests for Espresso.prototype.get
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var metacarattere = require('metacarattere');
var _ = require('lodash');


describe('Espresso.prototype.get', function() {

    it('should be a function', function() {
        expect( new Espresso().get ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( new Espresso().get.length ).to.equal(1);
    });

    it('should throw if an invalid argument is given', function(){

        var e = new Espresso();

        [ {}, null, undefined, 42, 'string', false ].forEach( function(item) {
            expect( function(){ e.get(item); } ).to.throw(/(object|empty)/);
        });

        [ { name: '' }, { path: '' }, { pattern: '' } ].forEach( function(item) {
            expect( function(){ e.get(item); } ).to.throw(/empty/);
        });

        [ { name: 'name' }, { path: 'path' }, { pattern: 'pattern' } ].forEach( function(item) {
            expect( function(){ e.get(item); } ).not.to.throw();
        });


    });

    it('should get a resource handler by name', function() {

        var api = new Espresso();
        var fn = function() {};

        api.resource('/api', function(){});
        api.resource('/api/sub', fn, {name:'sub'});
        api.resource('/api/sub/2', function() {});

        var handler = api.get({name:'sub'});

        expect( handler ).to.be.an('object');
        expect( handler.getCallback('get') ).to.equal(fn);

    });

    it('should get a resource handler by pattern', function() {

        var api = new Espresso();
        var target = "/api/:sub";
        var fn = function(){};

        api.resource('/api', function(){});
        api.resource(target, fn);
        api.resource('/api/sub/2', function() {});

        var handler = api.get({pattern:target});

        expect( handler ).to.be.an('object');
        expect( handler.getCallback('get') ).to.equal(fn);
    });

    it('should get a resource handler by matching URI', function() {

        var api = new Espresso();
        var fn = function(){};

        api.resource('/api', function(){});
        api.resource("/api/:subname", fn );
        api.resource('/api/sub/2', function() {});

        var handler = api.get({path: "/api/cool"});

        expect( handler ).to.be.an('object');
        expect( handler.getCallback('get') ).to.equal(fn);
    });

    it('should not error if there is no such resource but return null', function() {
        var api = new Espresso();

        [ { name: 'name' }, { path: 'path' }, { pattern: 'pattern' } ].forEach( function(item) {
            expect( function(){ api.get(item); } ).not.to.throw();
            expect( api.get(item) ).to.be.null;
        });

    });

    it('should get the handler using .delete(this)', function() {

        var api = new Espresso();
        var str = "/api/:subname";
        var name = "unique";
        var fn = function(req, res, api){
            var h = api.get(this);

            expect( h.getCallback('get') ).to.equal(fn);
            expect( h.getPattern().getPattern() ).to.equal(str);
        };

        api.resource(str, fn, {name: name });


        var p = api.dispatchRequest( new Espresso.Request({method:'get', path:'/api/sub'}) );
        p.catch( function(response) {
            done('failed: ' + response.body);
        });

    });

});
