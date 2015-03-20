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

module.exports = function(request) {

    // No instance check here, we use duck typing.

    // The returned promise
    var promise = this.defer();

    // A list of url parts
    var urlParts = request.path.split('/');

    // The last handler function
    // If we have no last handler, a 404 will be returned
    var last = _.find( this._resources, function(res) {
        return res.pattern.getPattern() === request.path;
    });

    if( ! _.isFunction(last) ) {
        // TODO Construct error
    }
    else {
        // TODO Dispatch request
    }

    return promise;
};
