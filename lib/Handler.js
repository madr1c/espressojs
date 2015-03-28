/**
 * Handler
 * A handler for a request. This class is used internally only.
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var Configurable = require('./Configurable');
var metacarattere = require('metacarattere');

// Default properties
var defaults = {
    cascading: true
};

var Handler = function(pattern, callbacks, options, context) {

    // Parent
    Configurable.call(this);

    // TODO Remove
    this.callbacks = callbacks || {};          // Verb => function mapping
    this.context   = context   || {};          // Invokation context
    this.pattern   = pattern   || undefined;   // metacarattere pattern

    _.isPlainObject(options) || (options = {});
    this.options   = _.extend({}, defaults, options);

    // New stuff
    this._callbacks = callbacks || {};          // Verb => function mapping
    this._context   = context   || {};          // Invocation context
    // TODO Better pattern check, please

    if( ! (pattern instanceof metacarattere) )
        this._pattern = new metacarattere(pattern);
    else
        this._pattern   = pattern;

    // Set all options
    this.setAll(
       _.extend({}, defaults, (options || {}) )
    );

};

Handler.prototype = _.create( Configurable.prototype, {
    constructor: Handler,

    setCallback: function(verb, fn) {

        if( 0 === arguments.length )
            return;

        if( ! _.isFunction(fn) )
            throw new Error('.setCallback would like to have a function');

        this._callbacks[verb] = fn;
    },

    setCallbacks: function(callbacks) {

        if( ! _.isObject(callbacks) )
            throw new Error('.setCallbacks neeeds an object with mappings');

        this._callbacks = callbacks;
    },

    getCallback: function(verb) {
        return this._callbacks[verb];
    },

    setContext: function(ctx) {
        this._context = ctx;
    },

    getContext: function() {
        return this._context;
    },

    setPattern: function(what) {
        if( _.isUndefined(what) )
            return;

        if( what instanceof metacarattere ) {
            this._pattern = what;
            return;
        }

        if( ! _.isString(what) )
            throw new Error('.setPattern would love to get a string');

        this._pattern = new metacarattere(what);
    },

    getPattern: function() {
        return this._pattern;
    }

});

module.exports = Handler;
