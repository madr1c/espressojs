/**
 * Tests for the Handler object
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');

describe('.Handler', function() {

    it('should be exposed', function() {
        expect(Espresso.Handler).to.be.a('function');
    });

    // .setCallback
    describe('.setCallback', function() {
        it('should be a function', function() {
            expect( new Espresso.Handler().setCallback ).to.be.a('function');
        });

        it('should take two arguments', function() {
            expect( new Espresso.Handler().setCallback.length ).to.equal(2);
        });

        it('should update the callbacks correctly', function() {
            var handler = new Espresso.Handler();

            expect( handler._callbacks ).to.deep.equal({});

            handler.setCallback('get', function(){});
            expect( handler._callbacks.get ).to.be.a('function');
        });

        it('should do nothing if all arguments are missing', function() {
            var handler = new Espresso.Handler();

            expect( handler.setCallback ).not.to.throw();
        });

        it('should throw if some arguments are missing', function() {
            var handler = new Espresso.Handler();

            expect( function() { handler.setCallback('get'); } ).to.throw();
        });

        it('should throw if value is not a function', function() {
            var handler = new Espresso.Handler();

            _.each([{},null,'string',42], function(value){
                expect( function() { handler.setCallback('get', value); } ).to.throw();
            });
        });

    });

    // .getCallback
    describe('.getCallback', function() {
        it('should be a function', function() {
            expect( new Espresso.Handler().getCallback ).to.be.a('function');
        });

        it('should return the callback', function() {
            var handler = new Espresso.Handler();

            handler._callbacks = {
                'get': 3
            };

            expect( handler.getCallback('get') ).to.equal(3);
        });

    });

    // .setContext
    describe('.setContext', function() {
        it('should be a function', function() {
            expect( new Espresso.Handler().setContext ).to.be.a('function');
        });

        it('should take one argument', function() {
            expect( new Espresso.Handler().setContext.length ).to.equal(1);
        });

        it('should update the context', function() {
            var handler = new Espresso.Handler();

            handler.setContext('get');
            expect( handler._context ).to.equal('get');
        });

        it('should do nothing if all arguments are missing', function() {
            var handler = new Espresso.Handler();

            handler._context = 33;
            expect( handler.setContext ).not.to.throw();
            expect( handler._context ).to.equal(33);
        });

    });

    // .getContext
    describe('.getContext', function() {
        it('should be a function', function() {
            expect( new Espresso.Handler().getContext ).to.be.a('function');
        });

        it('should return the callback', function() {
            var handler = new Espresso.Handler();

            handler._context = 'foo';

            expect( handler.getContext() ).to.equal('foo');
        });

    });

    // .setPattern
    // .setContext
    describe('.setPattern', function() {
        it('should be a function', function() {
            expect( new Espresso.Handler().setPattern ).to.be.a('function');
        });

        it('should take one argument', function() {
            expect( new Espresso.Handler().setPattern.length ).to.equal(1);
        });

        it('should update the pattern', function() {
            var handler = new Espresso.Handler();

            handler.setPattern('pattern');
            expect( handler._pattern ).to.be.an('object');
            expect( handler._pattern.getPattern() ).to.equal('pattern');
        });

        it('should do nothing if all arguments are missing', function() {
            var handler = new Espresso.Handler();

            handler._pattern = 33;
            expect( handler.setPattern ).not.to.throw();
            expect( handler._pattern ).to.equal(33);
        });

    });

    // .getContext
    describe('.getPattern', function() {
        it('should be a function', function() {
            expect( new Espresso.Handler().getPattern ).to.be.a('function');
        });

        it('should return the callback', function() {
            var handler = new Espresso.Handler();

            handler._pattern = 'foo';

            expect( handler.getPattern() ).to.equal('foo');
        });

    });

    // constructor
    describe('constructor', function(){

        it('should set properties correctly', function() {

            var h = new Espresso.Handler(
                '/a/b/c',
                { get: 3 },
                { fancy: true },
                42
            );

            expect( h._callbacks.get ).to.equal(3);
            expect( h._context ).to.equal(42);
            expect( h.getOption('fancy') ).to.be.true;
            expect( h._pattern.getPattern() ).to.equal('/a/b/c');

        });

    });

});
