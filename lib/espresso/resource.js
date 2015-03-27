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
 * @param {object|function} responsible     An object with HTTP_VERB=>function mappings or a function
 * @paran {object}          config      Optional configuration object
 * @param {object}          context     Optional context the given functions will be executed in
 */
module.exports = function(pattern, responsible, options, context) {

    if( 2 > arguments.length )
        throw new Error('.resource() needs at least two arguments');

    if( ! _.isString(pattern) )
        throw new Error('.resource() needs a string as a pattern');

    if( ! _.isFunction(responsible) && ! _.isObject(responsible) )
        throw new Error('.resource() needs a valid callback fn or an option with functions');

    if( ! _.isUndefined(options) && ! _.isPlainObject(options) )
        throw new Error('.resources() needs options as a plain object');

    // Setup context
    if( _.isUndefined(context) )
        context = {};

    // Setup handlers
    var handlers = {};

    // User submitted a function?
    if( _.isFunction(responsible) )
        // Let the function handle just everything
        _.each( _.keys(utils.verbs), function(verb) {
            handlers[verb] = responsible;
        });
    else {
        // If not, we build a assignment of verbs and functions
        _.each( _.keys(utils.verbs), function(verb) {
        // We use either the given or the default callback
            handlers[verb] = ( _.isFunction(responsible[verb]) ? responsible[verb] : utils.verbs[verb] );
        });
    }

    // Make sure we have an object
    if( ! _.isObject(options) )
        options = {};

    // Setup the pattern
    pattern = new metacarattere(pattern);

    // Let's look if there's already a handler
    var handler = this._ids[ pattern.getExpression().toString() ];

    // No handler? Create one in the table
    if( _.isUndefined(handler) ){
        handler = new Handler();
        this._ids[ pattern.getExpression().toString() ] = handler;

        // Create a name reference if we have a valid name given
        if( _.isString(options.name) && ! _.isEmpty(options.name) ) {
            this._names[ options.name ] = handler;
        }

    }
    else {
        // Oh look, there is already a handler

        if( _.isString(options.name) && ! _.isEmpty(options.name) ) {

            // A handler for the same resource but with a different name
            if( options.name !== handler.options.name ) {

                // Remove the old one
                this._names[ handler.options.name ] = undefined;

                // Add a new reference
                this._names[ options.name ] = handler;
            }

        }
    }

    handler.pattern = pattern;
    handler.callbacks = handlers;
    handler.context = context;

    // Merge options overwriting defaults
    handler.options = _.extend( handler.options, options );

    this._resources.push(handler);
};
