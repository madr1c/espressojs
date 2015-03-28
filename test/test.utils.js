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

                utils.handler.register(h);

                expect( _.keys(e._ids).length ).to.equal(1);
                expect( e._ids[ h.getExpression() ] ).to.equal(h);

            });

            it('should add a handler to _names if there is a name', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});
                var s = new Espresso.Handler( '/:what', function() {}, {name:'s'});

                expect( _.keys(e._names).length ).to.equal(0);

                utils.handler.register(h);
                utils.handler.register(s);

                expect( _.keys(e._names).length ).to.equal(1);
                expect( e._names.s ).to.equal(s);

            });

            it('must not update the resources table', function() {

                var e = new Espresso();
                var h = new Espresso.Handler( '/:what', function() {});

                expect( _.keys(e._resources).length ).to.equal(0);

                utils.handler.register(h);

                expect( _.keys(e._resources).length ).to.equal(0);

            });

        });
    });

});
