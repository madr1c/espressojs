/**
 * Espresso.prototype.deferred
 * A function in the prototype returning a promise
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var when = require('when');

module.exports = function() {
    return when.defer();
};
