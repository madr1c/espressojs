/**
 * Configurable
 * Parent function for objects that should be configurable
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var Configurable = function() {
    this._options = {};
};

Configurable.prototype = {

    setOption: function(key, value) {
        this._options[key] = value;
    },

    getOption: function(key) {
        return this._options[key];
    }
};

module.exports = Configurable;
