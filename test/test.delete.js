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

    it('should throw if an invalid argument is given', function(){

        var e = new Espresso();

        [ {}, null, undefined, 42, 'string', false ].forEach( function(item) {
            expect( function(){ e.delete(item); } ).to.throw(/object/);
        });

        [ { name: '' }, { id: '' }, { pattern: '' } ].forEach( function(item) {
            expect( function(){ e.delete(item); } ).to.throw(/empty/);
        });

        [ { name: 'name' }, { id: 'id' }, { pattern: 'pattern' } ].forEach( function(item) {
            expect( function(){ e.delete(item); } ).not.to.throw(/object/);
        });


    });

});
