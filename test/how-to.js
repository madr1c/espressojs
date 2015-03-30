/**
 * espressojs usage example
 *
 * Copyright (c) 2015 Daniel Koch
 *
 * https://github.com/dak0rn/espressojs
 */

// Please install
// * express
// * espressojs-express
// * body-parser
// * lodash
//
// npm install --save express espressojs-express body-parser lodash

var Espresso = require('espressojs');
var express  = require('express');
var espressoexpress = require('espressojs-express');
var bodyParser = require('body-parser');
var _ = require('lodash');


// Create a new API
var api = new Espresso({
    port: '9000',           // Only change the port
    apiRoot: '/pub/api'     // and the API root
});

// A list of people
var people = [
    { name: 'John Locke', number: 4 },
    { name: 'Hugo Reyes', number: 8 },
    { name: 'James Ford', number: 15 },
    { name: 'Sayid Jarrah', number: 16 },
    { name: 'Jack Shephard', number: 23 }
];

// Set a beautiful serializer function
api.setSerializer( function(req, res, api, value) {
    res.headers['Content-type'] = "application/json"; // We always want to use JSON
    return JSON.stringify(value, null, 4);
});

/* Define some resources */

                  // This function handles all HTTP requests
api.resource('/', function(request, response, api) {

    var url = api.linkTo(this);                 // Hypermedia link to the current URL
    var users = api.linkTo({name: 'survivors'});    // Hypermedia link to the resource named 'users'

    // This object is forwared to the serializer function
    return {
        title: 'My fancy API',
        version: '1.0.0',
        message: 'hello, world',
        api: url,
        users: users
    };

});

// Here are cascading resources!

/*
 * /survivors
 * Lists all available persons
 *
 */
api.resource('/survivors', {

    // GET requests
    get: function(req, res, api) {

        return _.map( people, function(survivor) {

            // We don't want to touch the original objecs
            return {
                name: survivor.name,
                number: survivor.number,

                // Link to resource named 'users' (see below) and replace ':number'
                // with the given number
                url: api.linkTo({name: 'survivor'}, {number: survivor.number})
            };

        });

    },

    // POST requests
    post: function(req, res, api) {
        var person = req.body;

        if( ! _.isString(person.name) || _.isEmpty(person.name) ||
            ! _.isNumber(person.number) ) {

            res.status = '400'; // Bad request
            return;
        }

        // Add the user and return a success response
        res.status = '201'; // 'Created'
        people.push( person );
    }

    /**
     * All other requests except for OPTIONS will create a '405 Method not supported'
     * response.
     */



    // This resource is named 'survivors'
}, {name: 'survivors'});

api.resource('/survivors/:number', function(req, res, api, users) {
    var num = parseInt(req.params.number); // :number
    var o;

    for( var index in users )
        if( num === users[index].number ) {
            o = users[index];

            // Create links to related resources
            o.urls = {
                number: api.linkTo({name:'survivor-number'},{number:o.number}),
                name: api.linkTo({name:'survivor-name'},{number:o.number})
            };

            return o;
        }


    res.status = '404';
    res.body = {error: 'Not found'};

}, { name: 'survivor' } ); // This resource is named 'survivor'

api.resource('/survivors/:number/name', function(req,res,api,user) {

    // status will already be set to 404
    if( 'undefined' === typeof user )
        return;

    return { name: user.name };
}, {name: 'survivor-name'}); // This resource is named 'survivor-name'

api.resource('/survivors/:number/number', function(req,res,api,user) {

    // status will already be set to 404
    if( 'undefined' === typeof user )
        return;

    return { number: user.number };
}, { name: 'survivor-number' } ); // This resource is named 'survivor-number'

// We definitely need
api.resource('/echo', function(request, response, api) {

    if( _.isString( request.body.message ) ) {

        return { echo: request.body.message };
    }

    response.status = '400'; // Bad request
    return { format: "{ message: $message }" };

});


var server = express();

server.use( bodyParser.json() );

// We tell express that we want to use a middleware function
// for everything below /pub/api
server.use('/pub/api*', espressoexpress(api) );

server.listen(9000);

/*
 * The server now listens on port 9000 on localhost
 *
 * Open
 *
 *      http://localhost:9000/pub/api
 *
 * in your web browser to access the API.
 *
 * If you are running a GNU/Linux or OS X operating system you can use
 * curl to query your API from the terminal.
 *
 * Say hello:
 *
 * curl -X POST -d '{ "message": "hello, world" }' -H "Content-type: application/json" -i http://localhost:9000/pub/api/echo
 *
 * Let's get all survivors:
 *
 * curl -X GET -i http://localhost:9000/pub/api/survivors
 *
 * Create a new survivor:
 *
 *      curl -X POST -d '{ "name": "Jin-Soo Kwon", "number": 42 }' -H "Content-type: application/json" -i http://localhost:9000/pub/api/survivors
 */
