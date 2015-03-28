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
    var Configurable = require('./lib/Configurable');
    var defaults = require('./lib/DefaultOptions');
    var replaceRegex = /(.*)\.js/;


    /**
     * espressojs constructor function
     *
     * @param {object}  options     Optional options object
     */
    var Espresso = function(options) {

        Configurable.call(this);

        this._resources = [];
        this._serializer = require('./lib/Serializer');

        this.setAll( _.extend({}, defaults, options) );

        // List of IDs used to find duplicate handlers fast
        this._ids = {
            // id: handler
        };

        // List of names for handlers set by the user
        this._names = {
            // name: handler
        };
    };

    var proto = {
        constructor: Espresso
    };

    // Expose parts
    Espresso.Request  = require('./lib/Request');
    Espresso.Response = require('./lib/Response');
    Espresso.Handler  = require('./lib/Handler');

    var path = "./lib/espresso/";
    var isJS = function(w) { return _.endsWith(w,'.js'); };
    var normalize = function(w) { return replaceRegex.exec(w)[1]; };

    var injectToPrototype = function(w) { proto[w] = require(path+w); };

    // Load prototype injections
    _( fs.readdirSync(path) )
        .filter( isJS )
        .map(normalize)
        .each(injectToPrototype).value();

    Espresso.prototype = _.create( Configurable.prototype, proto);

    return Espresso;

})();
