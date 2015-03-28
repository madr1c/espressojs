/**
 * Espresso.prototype.delete
 * A function in the prototype returning a promise
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var metacarattere = require('metacarattere');
var _ = require('lodash');
var utils = require('../utils');

module.exports = function(what) {

    if( ! _.isObject(what) )
        throw new Error('.delete needs an object with info');

    var target;
    var name;

    // Case #0: deleting using `this`
    if( _.isObject(what) && _.isObject(what.__espressojs) ) {

        target = what.__espressojs.handler;

        if( _.isUndefined(target) )
            return;

        name = target.getOption('name');
        // utils.handler.unregister(this, target);
        // utils.handler.buildResourceTable(this);

        if( _.isString( name ) )
            this._names[ name ] = undefined;

        this._ids[ target.getPattern().getExpression().toString() ] = undefined;

        _.remove(this._resources, function(resource){
            return resource.getPattern().getPattern() === target.getPattern().getPattern();
        });

        return;
    }

    // Case #1: delete by name
    if( _.isString(what.name) && ! _.isEmpty(what.name) ) {

        // Let's look if there is a handler with the given name
        target = this._names[what.name];

        if( _.isUndefined(target) )
            return;

        // The name list uses `undefined` due to performance reasons
        this._names[what.name] = undefined;

        // The id table also uses `undefined`
        this._ids[ target.getPattern().getExpression().toString() ] = undefined;

        // The handler has to be deleted since these are stored in an array
        _.remove(this._resources, function(resource){
            return resource.getOption('name') === what.name;
        });

        return;
    }

    // Case #2: delete by pattern
    if( _.isString(what.pattern) && ! _.isEmpty(what.pattern) ) {

        // The compiled regex is used as key in _ids
        var expr = new metacarattere(what.pattern).getExpression().toString();

        target = this._ids[expr];

        if( _.isUndefined(target) )
            return;

        name = target.getOption('name');
        // "Delete" it from the name table if available
        if( _.isString( name ) )
            this._names[ name ] = undefined;

        // The id table also uses `undefined`
        this._ids[expr] = undefined;

        // The handler has to be deleted since these are stored in an array
        _.remove(this._resources, function(resource){
            return resource.getPattern().getPattern() === what.pattern;
        });

        return;
    }

    // Case #3: delete by matching path
    if( _.isString(what.path) && ! _.isEmpty(what.path) ) {

        target = _.find( this._resources, function(res) {
            return res.getPattern().matches( what.path );
        });

        if( _.isUndefined(target) )
            return;

        name = target.getOption('name');
        // The name list uses `undefined` due to performance reasons
        if( _.isString( name ) )
            this._names[ name ] = undefined;

        this._ids[ target.getPattern().getExpression().toString() ] = undefined;

        _.remove(this._resources, function(resource){
            return resource === target;
        });

        return;
    }

    throw new Error('.delete needs at least one key [name|path|pattern] that is not empty');

};
