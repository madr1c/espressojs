/**
 * chainComplete
 * Can be used inside of handlers to found out if the
 * handler chain is complete.
 */
module.exports = function(ctx) {
    if( 'undefined' === typeof ctx || 'undefined' === typeof ctx.__espressojs )
        return undefined;

    return ctx.__espressojs.chainIsComplete;
};
