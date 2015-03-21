/**
 * Tests for the .dispatchRequest() function
 */
var Espresso = require('../index');



describe('.dispatchRequest', function() {

    it('should be a function', function() {
        expect( iface.dispatchRequest ).to.be.a('function');
    });

    it('should take one argument', function() {
        expect( iface.dispatchRequest.length ).to.equal(1);
    });

});
