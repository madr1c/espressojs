/**
 * Handler
 * A handler for a request. This class is used internally only.
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */

var Handler = function(pattern, callbacks, options, context) {

    this.callbacks = callbacks || {};          // Verb => function mapping
    this.context   = context   || {};          // Invokation context
    this.pattern   = pattern   || undefined;   // metacarattere pattern
    this.options   = options   || {};          // Handler options

};

module.exports = Handler;
