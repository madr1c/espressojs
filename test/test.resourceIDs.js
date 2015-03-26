/**
 * Tests for resource IDs used internally
 */
var Espresso = require('../index');
var _ = require('lodash');
var expect = require('chai').expect;

describe('ID table', function() {

    it('should be stored in _ids in the API instance', function() {
        var api = new Espresso();
        expect( api._ids ).to.be.an('object');
    });

    it('should have zero entries by default', function() {
        var api = new Espresso();
        expect( _.keys(api._ids).length ).to.equal(0);
    });

    it('should always have the same number of entries as the resources table', function() {
        var e = new Espresso();

        _.each(['a','b','c','d','e','f','g'], function(n){
            e.resource(n,function(){});
            expect( _.keys(e._ids).length ).to.equal( e._resources.length );
        });

    });

    it('should replace duplicate handlers', function(done) {
        var e = new Espresso();


        e.resource('/:api', function(){
            done('failed');
        });

        e.resource('/:api', function(){
            done('failed');
        });

        e.resource('/:another', function(){
            done();
        });

        expect( _.keys(e._ids).length ).to.equal(1);

        e.dispatchRequest( new Espresso.Request({path:'/api', method:'get'}) );

    });

});
