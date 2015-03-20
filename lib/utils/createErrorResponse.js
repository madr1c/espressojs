/**
 * createErrorResponse
 * A utility function that creates error responses.
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var Response = require('../Response');
var _ = require('lodash');

var handlers = {
    '404': function(request,response) {
        response.setStatus('404');
    },

    '405': function(request,response) {
        response.setStatus('405');
    },

    '500': function(request, response) {
        response.setStatus('500');
        response.body = '"Internal Server Error"';
    }
};

/**
 * Creates an error response for the request with
 * the given HTTP error code.
 * If no handler for the code is available (e.g. the
 * code is not a valid HTTP error code), code 500 will
 * be used.
 *
 * @param   {Espresso.Request}    Request object
 * @param   {string|number}       HTTP error code
 * @return  {Espresso.Response}   An error response object
 */
var createErrorResponse = function(request, code) {

    var response = new Response();
    var h = handlers[code];

    if( ! _.isFunction(handlers[code]) )
        h = handlers['500'];

    h(request, response);

    return response;
};


// Expose stuff
createErrorResponse.handlers = handlers;
module.exports = createErrorResponse;
