/**
 * Response
 * A response created by the API
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var Response = function() {

    this.status = '200';    // Default status => Everything's okay
    this.headers = {};      // Response headers
    this.body = undefined;  // Response body
    this.cookies = {};      // Key-value-mapping of cookies
};

Response.prototype.setStatus = function(what) {
    if( 'string' !== typeof what && 'number' !== typeof what )
        return;

    this.status = what;
};

module.exports = Response;
