/**
 * Handler
 * A handler for a request. This class is used internally only.
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');

// Default properties
var defaults = {
    cascading: true
};

var Handler = function(pattern, callbacks, options, context) {

    this.callbacks = callbacks || {};          // Verb => function mapping
    this.context   = context   || {};          // Invokation context
    this.pattern   = pattern   || undefined;   // metacarattere pattern

    _.isPlainObject(options) || (options = {});
    this.options   = _.extend({}, defaults, options);

};

module.exports = Handler;
