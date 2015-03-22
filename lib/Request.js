/**
 * Request
 * A request made to the API
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');

var Request = function(base) {

    this.method = undefined;            // Request method
    this.body   = {};                   // Request body, key-value-mappings
    this.hostname = undefined;          // Name of the host
    this.ip       = undefined;          // Client's IP address
    this.path     = undefined;          // The request path
    this.protocol = undefined;          // Request protocol, e.g. 'https'
    this.query    = {};                 // Request's query string, key-value-mappings
    this.cookie   = {};                 // Key-value-mapping of cookie values
    this.header   = {};                 // Key-value-mapping of all header fields

    this.api = {
        handler: undefined              // Handler for this request. Set by espressojs
    };

    // Extend the new object is a base
    // is given
    if( _.isObject(base) )
        _.extend(this, base);

};


module.exports = Request;
