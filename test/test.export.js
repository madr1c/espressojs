/**
 * Test file for everything that get's exported
 */
var Espresso = require('../index');
var expect   = require('chai').expect;

describe('Exported value', function() {
    it('should be a function', function() {
        expect( Espresso ).to.be.a('function');
    });

    describe('should have a .Request property that', function() {

        it('should be a (constructor) function', function() {
            expect( Espresso.Request ).to.be.a('function');
        });

    });

    describe('should have a .Response property that', function() {

        it('should be a (constructor) function', function() {
            expect( Espresso.Response ).to.be.a('function');
        });

    });
});
