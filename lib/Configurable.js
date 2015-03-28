/**
 * Configurable
 * Parent function for objects that should be configurable
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');

var Configurable = function() {
    this._options = {};
};

Configurable.prototype = {

    setOption: function(key, value) {
        this._options[key] = value;
    },

    getOption: function(key) {
        return this._options[key];
    },

    setAll: function(options) {
        if( ! _.isObject(options) )
            return;

        var transform = _.bind(function(v,k){
            this._options[k] = v;
        }, this);

        _.each(options, transform);
    },

    getAll: function() {
        return this._options;
    }
};

module.exports = Configurable;
