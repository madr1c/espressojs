/**
 * Tests for Espresso.Response
 */
var Espresso = require('../index');
var expect = require('chai').expect;
var _ = require('lodash');

describe('Espresso.Response', function() {

    // Instance's default properties
    var properties = [
        { property: 'status', value: '200'},
        { property: 'headers'},
        { property: 'body'},
        { property: 'cookies'},
        { property: 'rawBody'}
    ];

    it('should be a (constructor) function', function() {
        expect( Espresso.Response ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( Espresso.Response.length ).to.equal(1);
    });

    it('should create default instances when no argument is given', function() {
        var i = new Espresso.Response();

        expect( i ).to.be.an('object');

        _.each( properties, function(prop) {
            expect( i ).to.have.ownProperty(prop.property);
        });
    });

    it('should have default values', function() {
        var i = new Espresso.Response();

        var findDefaultValues = function(entry) {
            return ! _.isUndefined(entry.value);
        };

        _.each( _.filter(properties, findDefaultValues), function(prop) {
            expect( i[prop.property] ).to.equal( prop.value );
        });
    });

    it('should provide a set status function', function() {
        var i = new Espresso.Response();

        expect( i.setStatus ).to.be.a('function');
    });

    describe('.setStatus', function() {

        it('should update the status correctly', function() {
            var i = new Espresso.Response();
            expect( i.status ).to.not.equal('meh');
            i.setStatus('meh');
            expect( i.status ).to.equal('meh');
        });

    });

    it('should inherit from a given object overwriting default values', function() {
        var i = new Espresso.Response({ method: 'get', blah: 'meh' });

        expect( i.method ).to.equal('get');
        expect( i.blah ).to.exist;
        expect( i.blah ).to.equal('meh');
    });

    describe('.rawBody', function() {

        it('should equal the unserialized result', function(done) {

            var e = new Espresso();
            var r = new Espresso.Request({ method: 'get', path: '/whatever' });

            var raw = 42;
            var dump = "Espresso";

            e.resource('/whatever', function() { return raw; });

            e.setSerializer( function(some, thing, whatever, value) {
                return dump;
            });

            e.dispatchRequest(r).then( function(res) {
                expect( res.body ).to.equal(dump);
                expect( res.rawBody ).to.equal(raw);
                done();
            });

        });
    });

});
