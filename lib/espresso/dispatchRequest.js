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
var Response = require('../Response');
var Request = require('../Request');
var when = require('when');


module.exports = function(request) {

    // The returned promise
    var deferred = this.promise();

    if( _.isUndefined(request) ||
      ! _.isString(request.method) ||
        _.isEmpty(request.method) ||

        // Let's see if the method is supported internally at all
        // If not, this is not a 405 but a 500 since it is a missing feature
        ! _.contains( _.keys(utils.verbs), request.method )

        ) {

        deferred.reject( utils.createErrorResponse(null, '500') );
        return deferred.promise;

    }

    // Create a copy of the request object so that we do not
    // overwrite the given one
    request = new Request(request);

    // No instance check here for `request`, we use duck typing.

    // A list of url parts
    var urls = [];

    /**
     * Function that creates a list of parent URLs
     * for a given relative URL.
     */
    var buildParentURLs = function(parts) {
        var urls = [];

        _.reduce(parts, function(acc, value){
            var req;

            if( ! _.isString(value) || _.isEmpty(value) )
                return acc;
            else {
                req = acc + '/' + value;
                urls.push(req);
                return req;
            }


        }, '');

        return urls;
    };

    // The last handler function
    // If we have no last handler, a 404 will be returned
    // without taking a look at any other function
    var last = _.find( this._resources, function(res) {
        return res.pattern.matches( request.path );
    });

    // List of functions to be executed.
    var handlers = [];

    // The currently processed handler
    var currentHandler;

    // Response object.
    // Shared between URL handlers
    var response = new Response();

    // Reference to the API
    var api = this;

    /**
     * Finds all handlers for the given URLs or will return
     * null if a handler is missing.
     * this = api$this
     */
    var findHandlers = function(urls) {
        var i = -1;
        var j;
        var handlers = [];
        var url;
        var resource;

        var urlsLength = urls.length;
        var resourcesLength = this._resources.length;
        var foundHandler;

        // All URLs
        while( ++i < urlsLength ) {
            url = urls[i];
            foundHandler = undefined;   // No handler yet

            j = -1;
            // All resources
            while( ++j < resourcesLength ) {
                resource = this._resources[j];

                if( ! resource.pattern.matches(url) )
                    continue;

                handlers.push({ path: url, handler: resource });
                foundHandler = resource;
                break;
            }

            // One handler missing? Chain is broken, return an error
            if( _.isUndefined(foundHandler) )
                return null;
        }


        return handlers;
    };

    if( ! _.isObject(last) ) {
        // Nothing found -> construct an error response
        deferred.reject( utils.createErrorResponse(request, '404') );
    }
    else {
        // Get a list of all URLs
        urls = buildParentURLs(request.path.split('/'));

        // Check the pattern list to find the functions.
        // If there is no handler, a 500 will be thrown
        // TODO v2: Execute the last function only with a flag that no cascading is in place
        handlers = findHandlers.call(this, urls);

        // No handlers?
        if( null === handlers ) {
            deferred.reject( utils.createErrorResponse(request, '500') );
            return;
        }

        /* Execute handlers */

        // Setup the first handler
        currentHandler = (function(resource){
            var handler = resource.handler.callbacks[request.method];

            // Setup the request for the handler
            // TODO Create a function for this
            request.api.handler = handler;
            request.path = resource.path;

            // Return a (wrapped) promise
            return when(
                handler.call(
                    resource.handler.context,
                    request,
                    response,
                    api
                )
            );

        })( _.first(handlers) );

        // Create a chain of the other handlers
        _.each( _.rest(handlers), function(resource) {

            // `next` will be invoked by when.js when the previous
            // function was executed. It gets the fulfillment value.
            var next = function(value) {
                var handler = resource.handler.callbacks[request.method];
                request.api.handler = handler;
                request.path = resource.path;

                return handler.call(
                    resource.handler.context,
                    request,
                    response,
                    api,
                    value
                );
            };

            currentHandler = currentHandler.then(next);
        });

        // Let the serializer serialize the generated response
        currentHandler = currentHandler.then( function(value) {
            api._serializer.call(api, request, response, api, value);
        });


    }

    return deferred.promise;
};
