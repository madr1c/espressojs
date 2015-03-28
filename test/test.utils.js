/**
 * Tests for the internal utilities module
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');
var utils = require('../lib/utils');

describe('Utils', function() {

    // .verbs
    describe('.verbs', function() {
        it('should be an object', function() {
            expect( utils.verbs ).to.be.an('object');
        });

        it('should contain a mapping of HTTP verbs to functions', function(){

            _.each( utils.verbs, function(value, key) {

                expect( key ).to.be.a('string');
                expect( value ).to.be.a('function');
            });

        });

    });

    // .handlers
    describe('.handlers', function() {
        it('should be an object', function() {
            expect( utils.handlers ).to.be.an('object');
        });

        ['def', 'options'].forEach( function(what) {
            it('should have a key '+what+' referencing a function', function() {
                expect( utils.handlers[what] ).to.be.a('function');
            });
        });
    });

    // .createErrorResponse
    describe('.createErrorResponse', function() {
        it('should be a function', function() {
            expect( utils.createErrorResponse ).to.be.a('function');
        });
    });

    // .handler
    describe('.handler', function() {

        it('should be an object', function(){
            expect(utils.handler).to.be.an('object');
        });

        describe('.register', function() {
            it('should be a function', function(){
                expect( utils.handler.register ).to.be.a('function');
            });

            it('should take two arguments', function() {
                expect( utils.handler.register.length ).to.equal(2);
            });

            it('should add a handler to _ids', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});

                expect( _.keys(e._ids).length ).to.equal(0);

                utils.handler.register(e,h);

                expect( _.keys(e._ids).length ).to.equal(1);
                expect( e._ids[ h.getPattern().getExpression() ] ).to.equal(h);

            });

            it('should add a handler to _names if there is a name', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});
                var s = new Espresso.Handler( '/:what/:sub', function() {}, {name:'s'});

                expect( _.keys(e._names).length ).to.equal(0);

                utils.handler.register(e,h);
                utils.handler.register(e,s);

                expect( _.keys(e._names).length ).to.equal(1);
                expect( e._names.s ).to.equal(s);

            });

            it('must not update the resources table', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});

                expect( _.keys(e._resources).length ).to.equal(0);

                utils.handler.register(e,h);

                expect( _.keys(e._resources).length ).to.equal(0);

            });

            it('should throw if arguments are missing', function() {

                expect( utils.handler.register ).to.throw();
                expect( function() { utils.handler.register(new Espresso()); } ).to.throw();

            });

            it('should throw if invalid arguments are given', function() {
                var things = [33, 'string', undefined, null, false, [] ];

                _.each( things, function(api) {
                    _.each( things, function(handler) {
                        expect( function(){ utils.handler.register(api,handler); } ).to.throw();
                    });
                });

            });

        });

        describe('.unregister', function() {
            it('should be a function', function(){
                expect( utils.handler.register ).to.be.a('function');
            });

            it('should take two arguments', function() {
                expect( utils.handler.register.length ).to.equal(2);
            });

            it('should remove a handler from _ids', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});

                utils.handler.register(e,h);

                expect( _.keys(e._ids).length ).to.equal(1);
                expect( e._ids[ h.getPattern().getExpression() ] ).to.equal(h);

                utils.handler.unregister(e,h);

                expect( e._ids[ h.getPattern().getExpression() ] ).to.be.undefined;

            });

            it('should remove a handler from _names if there is a name', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});
                var s = new Espresso.Handler( '/:what/:sub', function() {}, {name:'s'});

                utils.handler.register(e,h);
                utils.handler.register(e,s);

                expect( _.keys(e._ids).length ).to.equal(2);
                expect( _.keys(e._names).length ).to.equal(1);
                expect( e._names.s ).to.equal(s);

                utils.handler.unregister(e,h);

                expect( _.keys(e._names).length ).to.equal(1);

                utils.handler.unregister(e,s);

                expect( e._names.s ).to.be.undefined;

            });

            it('must not update the resources table', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});

                utils.handler.register(e,h);

                expect( _.keys(e._resources).length ).to.equal(0);

                utils.handler.unregister(e,h);

                expect( _.keys(e._resources).length ).to.equal(0);

            });

            it('should throw if arguments are missing', function() {

                expect( utils.handler.unregister ).to.throw();
                expect( function() { utils.handler.unregister(new Espresso()); } ).to.throw();

            });

            it('should throw if invalid arguments are given', function() {
                var things = [33, 'string', undefined, null, false, [] ];

                _.each( things, function(api) {
                    _.each( things, function(handler) {
                        expect( function(){ utils.handler.unregister(api,handler); } ).to.throw();
                    });
                });

            });

        });

        describe('.buildResourceTable', function() {

            it('should be a function', function() {
                expect( utils.handler.buildResourceTable ).to.be.a('function');
            });

            it('should expect one argument', function() {
                expect( utils.handler.buildResourceTable.length ).to.equal(1);
            });

            it('should create a list of handlers', function() {
                var e = new Espresso();

                expect( e._resources.length ).to.equal(0);

                utils.handler.register(e, new Espresso.Handler('/a', function(){}));
                utils.handler.register(e, new Espresso.Handler('/a/b', function(){}));
                utils.handler.register(e, new Espresso.Handler('/a/b/c', function(){}));

                expect( e._resources.length ).to.equal(0);

                utils.handler.buildResourceTable(e);

                expect( e._resources.length ).to.equal(3);
            });

            it('should throw if no API is provided', function() {
                expect( utils.handler.buildResourceTable ).to.throw();
            });

        });
    });

});
