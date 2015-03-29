/**
 * Espressojs's default options
 */
module.exports = {

    // Server properties
    protocol: 'http',
    hostname: 'localhost',
    apiRoot:  '/',
    port: '',

    // Indicates if a complete chain has to be forced
    // If set to true, missing handlers will just be ignored
    skipMissingHandlers: true,

    // Indicates if cascading handlers should be used
    cascading: true,

    // Location where empty path have to rewritten to
    rewriteEmpty: '/'
};
