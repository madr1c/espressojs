/**
 * Espresso.prototype.resource
 * Registers a new resource handler in
 * the api
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var metacarattere = require('metacarattere');
var utils = require('../utils');
var Handler = require('../Handler');


/**
 * Registers a resource
 *
 * @param {string}          pattern     A URL pattern (see metacarattere)
 * @param {object|function} options     An object with HTTP_VERB=>function mappings or a function
 * @param {object}          context     Optional context the given functions will be executed in
 */
module.exports = function(pattern, options, context) {

    if( 2 > arguments.length )
        throw new Error('.resource() needs at least two arguments');

    if( ! _.isString(pattern) )
        throw new Error('.resource() needs a string as a pattern');

    if( ! _.isFunction(options) && ! _.isObject(options) )
        throw new Error('.resource() needs a valid callback fn or an option with functions');

    // Setup context
    if( _.isUndefined(context) )
        context = {};

    // Setup handlers
    var handlers = {};

    // User submitted a function?
    if( _.isFunction(options) )
        // Let the function handle just everything
        _.each( _.keys(util.verbs), function(verb) {
            handlers[verb] = options;
        });
    else {
        // If not, we build a assignment of verbs and functions
        _.each( _.keys(utils.verbs), function(verb) {
        // We use either the given or the default callback
            handlers[verb] = ( _.isFunction(options[verb]) ? options[verb] : utils.verbs[verb] );
        });
    }

    // Setup the pattern
    pattern = new metacarattere(pattern);

    // Create a new entry in the resources table
    var handler = new Handler(pattern, handlers, context);

    this._resources.push(handler);
};
