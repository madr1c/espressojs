/**
 * Espresso.prototype.setSerializer
 * Sets the instance's serializer function
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');

module.exports = function(fn) {
    if( ! _.isFunction(fn) )
        throw new Error('Espresso.setSerializer expects a function');

    this._serializer = fn;
};
