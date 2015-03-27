/**
 * Tests for the internal resource table
 */
var expect = require('chai').expect;
var Espresso = require('../index');
var _ = require('lodash');

describe('Resource table', function() {

    it('should be an empty array by default', function() {
        var e = new Espresso();

        expect( e._resources ).to.be.an('array');
        expect( e._resources.length ).to.equal(0);
    });

});
