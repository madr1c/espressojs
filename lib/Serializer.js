/**
 * Espresso's default serializer
 */
module.exports = function( request, response, api, value ) {
    return JSON.stringify(value);
};
