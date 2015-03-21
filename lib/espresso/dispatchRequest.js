/**
 * Espresso.prototype.dispatchRequest
 * Takes a request and dispatches it to the API where
 * it will be handled in any way.
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var utils = require('../utils');

module.exports = function(request) {



    // The returned promise
    var deferred = this.promise();

    if( _.isUndefined(request) ) {
        deferred.reject( utils.createErrorResponse(null, '500') );
        return deferred.promise;
    }

    // No instance check here, we use duck typing.

    // A list of url parts
    var urlParts = request.path.split('/');

    // The last handler function
    // If we have no last handler, a 404 will be returned
    var last = _.find( this._resources, function(res) {
        return res.pattern.matches( request.path );
    });

    // List of functions to be executed.
    // Reverse order
    var functions;

    if( ! _.isObject(last) ) {
        // Nothing found -> construct an error response
        var response = utils.createErrorResponse(request, '404');

        deferred.reject(response);
    }
    else {
        // TODO Dispatch request
    }

    return deferred.promise;
};
