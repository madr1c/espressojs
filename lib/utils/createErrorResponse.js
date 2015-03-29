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
    '404': function(request,response, m) {
        response.setStatus('404');
        if( m )
            response.body = {error: m};
    },

    '405': function(request,response, m) {
        response.setStatus('405');

        if( m )
            response.body = {error: m};
    },

    '500': function(request, response, m) {
        response.setStatus('500');
        response.body = {error: m || 'Internal Server Error'};
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
 * @param   {a}                   A message stored in `Response.body`
 * @return  {Espresso.Response}   An error response object
 */
var createErrorResponse = function(request, code, message) {

    var response = new Response();
    var h = handlers[code];

    if( ! _.isFunction(handlers[code]) )
        h = handlers['500'];

    // Invoke the handler
    h(request, response, message);

    return response;
};


// Expose stuff
createErrorResponse.handlers = handlers;
module.exports = createErrorResponse;
