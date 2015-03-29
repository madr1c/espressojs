/**
 * Espresso.prototype.get
 * Returns a resource handler
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var metacarattere = require('metacarattere');
var utils = require('../utils');

module.exports = function(what) {

    if( ! _.isObject(what) )
        throw new Error('.delete needs an object with info');

    var target;

    // Case #0: deleting using `this`
    if( _.isObject(what) && _.isObject(what.__espressojs) ) {

        target = what.__espressojs.handler;

    }
    // Case #1: delete by name
    else if( _.isString(what.name) && ! _.isEmpty(what.name) ) {

        // Let's look if there is a handler with the given name
        target = this._names[what.name];

    }
    // Case #2: delete by pattern
    else if( _.isString(what.pattern) && ! _.isEmpty(what.pattern) ) {

        // The compiled regex is used as key in _ids
        var expr = new metacarattere(what.pattern).getExpression().toString();

        target = this._ids[expr];

    }
    // Case #3: delete by matching path
    else if( _.isString(what.path) && ! _.isEmpty(what.path) ) {

        target = _.find( this._resources, function(res) {
            return res.getPattern().matches( what.path );
        });

    }
    // Invalid argument
    else
        throw new Error('.delete needs at least one key [name|path|pattern] that is not empty');

    return _.isUndefined(target) ? null : target;

};
