/**
 * handler
 * Utility functions for handler management
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var Handler = require('../Handler');

module.exports = {
    // Registers a handler in the API
    register: function(api, handler) {

        if( 0 === arguments.length )
            throw new Error('utils.handler.register needs arguments');

        if( ! _.isObject(api) )
            throw new Error('utils.handler.register needs an espressojs API');

        if( ! (handler instanceof Handler) )
            throw new Error('utils.handler.register needs a Handler');

        // Add it to _ids
        api._ids[ handler.getPattern().getExpression().toString() ] = handler;

        // Add it to _names if any
        var name = handler.getOption('name');

        if( _.isString(name) && ! _.isEmpty(name) )
            api._names[ name ] = handler;
    },

    // Removes a handler from the API
    unregister: function(api, handler) {

        if( 0 === arguments.length )
            throw new Error('utils.handler.unregister needs arguments');

        if( ! _.isObject(api) )
            throw new Error('utils.handler.unregister needs an espressojs API');

        if( ! (handler instanceof Handler) )
            throw new Error('utils.handler.unregister needs a Handler');

        // Remove it from _ids
        api._ids[ handler.getPattern().getExpression().toString() ] = undefined;

        // Add it to _names if any
        var name = handler.getOption('name');

        if( _.isString(name) && ! _.isEmpty(name) )
            api._names[ name ] = undefined;
    }
};
