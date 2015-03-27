/**
 * Espresso.prototype.chainComplete
 * Utility detecting if the handler chain is complete
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
module.exports = function(ctx) {
    if( 'undefined' === typeof ctx || 'undefined' === typeof ctx.__espressojs )
        return undefined;

    return ctx.__espressojs.chainIsComplete;
};
