/**
 * Tests for the internal resource table
 */
var expect = require('chai').expect;
var Espresso = require('../index');

describe('Resource table', function() {

    it('should be an empty array by default', function() {
        var e = new Espresso();

        expect( e._resources ).to.be.an('array');
        expect( e._resources.length ).to.equal(0);
    });

    it('should create a correct entry', function() {
        var e = new Espresso();
        var get = function(){};
        var pattern = "/proc/:sys";
        var handlers = {
            'get': get
        };
        var context = {a:'b',c:'d'};

        expect( e._resources.length ).to.equal(0);

        e.resource(pattern, handlers, context);

        expect( e._resources.length ).to.equal(1);

        var entry = e._resources[0];

        expect( entry.context ).to.deep.equal( context );
        expect( entry.pattern ).to.be.an('object');
        expect( entry.pattern.getPattern() ).to.equal(pattern);
        expect( entry.callbacks ).to.be.an('object');
        expect( entry.callbacks.get ).to.equal(get);

    });

});
