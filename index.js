/**
 * espressojs - A framework for building REST APIs
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */

module.exports = (function() {
    var _ = require('lodash');
    var fs = require('fs');


    /**
     * espressojs constructor function
     */
    var Espresso = function() {

        this._resources = [];
        this._serializer = require('./lib/Serializer');

    };

    // Expose parts
    Espresso.Request = require('./lib/Request');
    Espresso.Response = require('./lib/Response');


    var path = "./lib/espresso";
    var isJS = function(w) { return _.endsWith(w,'.js'); };
    var normalize = function(w) { return _.trimRight(w,'.js'); };
    var injectToPrototype = function(w) { Espresso.prototype[w] = require(path+'/'+w); };

    // Load prototype injections
    _( fs.readdirSync(path) )
        .filter( isJS )
        .map(normalize)
        .each(injectToPrototype).value();

    return Espresso;

})();
