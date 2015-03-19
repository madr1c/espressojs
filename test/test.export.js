/**
 * Test file for everything that get's exported
 */
var Espresso = require('../index');
var expect   = require('chai').expect;

describe('Exported value', function() {
    it('should be a function', function() {
        expect( Espresso ).to.be.a('function');
    });
});
