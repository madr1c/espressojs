/**
 * Tests for the internal resource table
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');

describe('Resource table', function() {

    it('should be an empty array by default', function() {
        var e = new Espresso();

        expect( e._resources ).to.be.an('array');
        expect( e._resources.length ).to.equal(0);
    });

});

describe('.resource', function(){

    it('should be a function', function() {
        expect( new Espresso().resource ).to.be.a('function');
    });

    it('should take four arguments', function() {

        var e = new Espresso();
        expect( e.resource.length ).to.equal(4);

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

    it('should throw if `options` is not a valid object', function() {

        _.each([42, null, 'string', true, [] ], function(what) {
            expect( function() {
                new Espresso().resource('/pattern', function(){}, what );
            } ).to.throw(/options/);
        });


    });

    it('should not throw if a function or an object with handlers is given', function() {
        var inst = new Espresso();
        inst.resource('pattern', function(){} );
        inst.resource('pattern', { get: function(){} });
    });

    it('should create a correct entry', function() {
        var e = new Espresso();
        var get = function(){};
        var pattern = "/proc/:sys";
        var handlers = {
            'get': get
        };
        var options = {
            id: 'my-fancy-id',
            cascading: false,
            super: 'duper'
        };
        var context = {a:'b',c:'d'};

        expect( e._resources.length ).to.equal(0);

        e.resource(pattern, handlers, options, context);

        expect( e._resources.length ).to.equal(1);

        var entry = e._resources[0];

        expect( entry.context ).to.deep.equal( context );
        expect( entry.pattern ).to.be.an('object');
        expect( entry.pattern.getPattern() ).to.equal(pattern);
        expect( entry.callbacks ).to.be.an('object');
        expect( entry.callbacks.get ).to.equal(get);
        expect( entry.options ).to.deep.equal(options);

    });

    it('should create a handler with default values if nothing given', function(){
        var e = new Espresso();

        var pattern = "/proc/:sys";
        var options = {
            cascading: true
        };

        var fn = function() {};

        var context = {};

        e.resource(pattern, fn);

        var entry = e._resources[0];

        expect( entry.context ).to.deep.equal( context );
        expect( entry.pattern ).to.be.an('object');
        expect( entry.pattern.getPattern() ).to.equal(pattern);
        expect( entry.callbacks ).to.be.an('object');
        expect( entry.callbacks.get ).to.equal(fn);
        expect( entry.options ).to.deep.equal(options);

    });

});
