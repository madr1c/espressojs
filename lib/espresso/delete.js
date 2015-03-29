/**
 * Espresso.prototype.delete
 * Deletes a resource handler
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
var _ = require('lodash');
var metacarattere = require('metacarattere');
var utils = require('../utils');
var Handler = require('../Handler');

module.exports = function(what) {
    var target = this.get(what);

    if( null === target )
        return;

    // Remove it
    utils.handler.unregister(this, target);
    utils.handler.buildResourceTable(this);
};
