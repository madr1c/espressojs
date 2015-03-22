/**
 * Response
 * A response created by the API
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');

var Response = function(base) {

    this.status = '200';    // Default status => Everything's okay
    this.headers = {};      // Response headers
    this.body = undefined;  // Response body
    this.cookies = {};      // Key-value-mapping of cookies

    // Extend the new object if a
    // base is given
    if( _.isObject(base) )
        _.extend(this, base);
};

Response.prototype.setStatus = function(what) {
    if( 'string' !== typeof what && 'number' !== typeof what )
        return;

    this.status = what;
};

module.exports = Response;
