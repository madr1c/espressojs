/**
 * Tests for the .dispatchRequest() function
 */
var Espresso = require('../index');
var expect   = require('chai').expect;

describe('.dispatchRequest', function() {
    var iface = new Espresso();

    it('should be a function', function() {
        expect( iface.dispatchRequest ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( iface.dispatchRequest.length ).to.equal(1);
    });

    it('should return a promise', function() {
        var req = new Espresso.Request();
        req.path = "";
        var p = iface.dispatchRequest(req);
        expect( p.then ).to.be.a('function');
        expect( p.catch ).to.be.a('function');
    });

    describe("the returned promise", function(done) {
        it('should be rejected if invalid arguments are given', function() {
            var p = iface.dispatchRequest();

            p.then(function() {
                done('failed');
            }).catch( function(){
                done();
            });
        });
    });

});
