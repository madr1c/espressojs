/**
 * Espresso.prototype.setOption
 * Updates API options
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */
module.exports = function(key, value) {
    this._options[key] = value;
};
