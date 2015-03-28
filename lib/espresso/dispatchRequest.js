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
    var deferred = this.deferred();

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

    // We may need that later
    var originalRequest = request;

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
        return res.getPattern().matches( request.path );
    });

    // List of functions to be executed.
    var handlers = [];

    // The currently processed handler
    var currentHandler;

    // Response object.
    // Shared between URL handlers
    var response = new Response();

    // Raw body object
    // This is stored explicitely because we want the serializer not being
    // able to overwrite it
    var rawBody;

    // Indicates if the handler chain is complete or if there are any empty segments
    var chainIsComplete = true;

    // Reference to the API + mixins
    var api = this;

    /**
     * Finds all handlers for the given URLs.
     * If `skipMissing` is `false`, `null` will be returned
     * if a handler was not found.
     *
     * this = api$this
     *
     * @param {array}   urls    List of URLs to handle
     * @param {boolean} skipMissing Skip missing "holes"?
     */
    var findHandlers = function(urls, skipMissing) {
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

                if( ! resource.getPattern().matches(url) )
                    continue;

                // If this handler does not want to use cascading
                // we remove every handler that might have been executed
                // before it
                if( false === resource.getOption('cascading') )
                    handlers = [];

                handlers.push({ path: url, handler: resource });
                foundHandler = resource;
                break;
            }

            // One handler missing? Chain is broken, return an error if required
            if( _.isUndefined(foundHandler) && ! skipMissing )
                return null;
        }


        return handlers;
    };

    if( ! _.isObject(last) ) {
        // Nothing found -> construct an error response
        deferred.reject( utils.createErrorResponse(request, '404') );
    }
    else {

        // We only search for cascading handlers if
        // the cascading flag of the handler is true
        // and if cascading is allowed globally
        if( true === this.getOption('cascading') && true === last.getOption('cascading') ) {
            // Get a list of all URLs
            urls = buildParentURLs(request.path.split('/'));

            // Check the pattern list to find the functions.
            // If there is no handler, a 500 will be thrown
            handlers = findHandlers.call(this, urls, this.getOption('skipMissingHandlers'));

            // No handlers?
            if( null === handlers ) {
                deferred.reject( utils.createErrorResponse(request, '500') );
                return;
            }

            // If the chain is complete we have a handler for ever URL
            chainIsComplete = ( urls.length === handlers.length );

        }
        // Otherwise: only one handler
        else {
            handlers = [ {handler: last, path: request.path }];
        }


        /* Execute handlers */

        // Setup the first handler
        currentHandler = (function(resource){
            var handler = resource.handler.getCallback(request.method);

            // Setup the request for the handler
            // TODO Create a function for this
            request.api.handler = handler;
            request.path = resource.path;

            // Create a context
            var context = resource.handler.getContext();
            context.__espressojs = {
                chainIsComplete: chainIsComplete,
                // Reference to the currently processed handler
                handler: resource.handler
            };

            // Return a (wrapped) promise
            return when(
                handler.call(
                    context,
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
                var handler = resource.handler.getCallback(request.method);
                request.api.handler = handler;
                request.path = resource.path;
                request.params = resource.handler.getPattern().parse(resource.path);

                var context = resource.handler.getContext();
                context.__espressojs = {
                    chainIsComplete: chainIsComplete,
                    // Reference to the currently processed handler
                    handler: resource.handler
                };

                return handler.call(
                    context,
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

            // Reset request parameters and the path, serializer does not need it
            request.path = originalRequest.path;
            request.params = {};

            // Store the unserialized value
            rawBody = value;

            return api._serializer.call(api, request, response, api, value);
        });

        // Last but not least, we resolve the promise
        currentHandler.then( function(value) {
            // Move the value created by the serializer to the request
            response.body = value;

            // Set the raw body result
            response.rawBody = rawBody;

            // Resolve the promise
            deferred.resolve(response);
        });

        // Catches all rejected promises in the chain
        // Will be executed, when a handler returns a reject promise
        currentHandler.catch( function(reason){

            request.params = {};
            request.path = originalRequest.path;

            response.body = api._serializer.call(api, request, response, api, reason);
            response.rawBody = reason;
            deferred.reject( response );
        });


    }

    return deferred.promise;
};
