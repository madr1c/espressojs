/**
 * Espressojs's default options
 */
module.exports = {

    // Server properties
    protocol: 'http',
    hostname: 'localhost',
    apiRoot:  '',

    // Indicates if a complete chain has to be forced
    // If set to true, missing handlers will just be ignored
    skipMissingHandlers: true,

    // Indicates if cascading handlers should be used
    cascading: true
};
