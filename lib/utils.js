/**
 * utils
 * A collection of useful utilities
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */

var _ = require('lodash');

var createErrorResponse = require('./utils/createErrorResponse');

// Default function for all not-handled verbs
var defaultHandler = function(request, response, api, previous) {
    createErrorResponse.handlers['405'](request,response);
};

// Handler for an OPTIONS request
var optionsHandler = function(request, response, api, previous) {

    var callbacks = request.api.handler.callbacks;

    // Create a list of all supported functions
    var toUpperCase = function(s) { return s.toUpperCase(); };
    var methods = _(callbacks).functions().map( toUpperCase ).value().join(',');

    response.headers.Allow = methods;
};

// HTTP verbs
var VERBS = {
    'get': defaultHandler,
    'post': defaultHandler,
    'put': defaultHandler,
    'delete': defaultHandler,
    'head': defaultHandler,
    'options': optionsHandler
};


// Exports
module.exports = {
    verbs: VERBS,
    handlers: {
        def:      defaultHandler,
        options:  optionsHandler
    },

    handler: require('./utils/handler'),

    createErrorResponse: createErrorResponse
};
