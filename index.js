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
    var defaults = require('./lib/DefaultOptions');
    var replaceRegex = /(.*)\.js/;


    /**
     * espressojs constructor function
     *
     * @param {object}  options     Optional options object
     */
    var Espresso = function(options) {

        this._resources = [];
        this._serializer = require('./lib/Serializer');

        this._options = _.extend({}, defaults, options);

    };

    // Expose parts
    Espresso.Request = require('./lib/Request');
    Espresso.Response = require('./lib/Response');


    var path = "./lib/espresso/";
    var isJS = function(w) { return _.endsWith(w,'.js'); };
    var normalize = function(w) { return replaceRegex.exec(w)[1]; };

    var injectToPrototype = function(w) { Espresso.prototype[w] = require(path+w); };

    // Load prototype injections
    _( fs.readdirSync(path) )
        .filter( isJS )
        .map(normalize)
        .each(injectToPrototype).value();

    return Espresso;

})();
