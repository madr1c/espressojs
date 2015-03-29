/**
 * Espresso.prototype.linkTo
 * Returns a hypermedia link to a resource
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */

var _ = require('lodash');
var metacarattere = require('metacarattere');

module.exports = function(what, replacers) {

    // Build the URL
    var url = this.getOption('protocol') + '://' + this.getOption('hostname');

    if( '' !== this.getOption('port') )
        url += ':' + this.getOption('port');

    url += this.getOption('apiRoot');

    var handler;
    var appendix = '';

    // Case #1: this
    if( _.isObject(what) && _.isObject(what.__espressojs) ) {
        appendix = what.__espressojs.path;
    }

    // Case #2: we have a simple string
    if( _.isString(what) ) {
        appendix = what;
    }

    // Case #3: we have an object with a name key
    if( _.isObject(what) && _.isString(what.name) && ! _.isEmpty(what.name) ) {
        handler = this.get(what);

        if( null !== handler ) {

            // Case #3.1: we have an object with replacers
            if( _.isObject(replacers) )
                appendix =  handler.getPattern().build(replacers);
            else
                appendix = handler.getPattern().getPattern();

        }
    }

    return url + appendix;

};
