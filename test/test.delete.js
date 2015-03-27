/**
 * Tests for the .espressojs delete function
 */
var expect = require('chai').expect;
var Espresso = require('../index');

describe('Espresso.prototype.delete', function() {

    it('should be a function', function() {
        expect( new Espresso().delete ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( new Espresso().delete.length ).to.equal(1);
    });

});
