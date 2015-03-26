/**
 * Tests for the .chainComplete function
 */
var Espresso = require('../index');
var expect = require('chai').expect;

describe('.chainComplete', function() {

    it('should be a function', function() {
        expect( new Espresso().chainComplete ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( new Espresso().chainComplete.length ).to.equal(1);
    });

    it('should return undefined if invoked w/out arguments', function() {
        expect( new Espresso().chainComplete() ).to.be.undefined;
    });

    it('should be a function within handlers', function(done) {

        var e = new Espresso();
        var r = new Espresso.Request({method:'get', path: '/a'});

        e.resource('/a', function(req, res, api) {
            expect( api.chainComplete ).to.be.a('function');
            done();
        });

        e.dispatchRequest(r);

    });

    it('should return true if all handlers are available', function(done) {

        var e = new Espresso();
        var r = new Espresso.Request({method:'get', path: '/a/b'});

        e.resource('/a', function(req, res, api) {

        });

        e.resource('/a/b', function(req,res, api) {
            expect( api.chainComplete(this) ).to.equal(true);
            done();
        });

        e.dispatchRequest(r);

    });

    it('should return false if not all handlers are available', function(done) {

        var e = new Espresso();
        var r = new Espresso.Request({method:'get', path: '/a/b/c'});

        e.resource('/a/b/c', function(req,res, api) {
            expect( api.chainComplete(this) ).to.equal(false);
            done();
        });

        e.dispatchRequest(r);

    });

});
