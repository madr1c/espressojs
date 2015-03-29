# espressojs
## A framework for building REST APIs

![Build status](https://travis-ci.org/dak0rn/espressojs.svg?branch=master)

espressojs is a small Open Source framework that can be used to build HTTP REST APIs
in JavaScript. It's core concept are
[cascading requests](https://github.com/dak0rn/espressojs/wiki/Cascading-requests)
that allow you to keep your resource handlers very DRY.

Also, it is a framework on top of any kind of server functionality, it does not
come with a built-in server. It provides you a way of managing resources in a
flexible way.

## Cascading requests

The idea behind cascading requests is that a request may be handled with multiple
handlers invoked from general ones to more specific ones and results are passed
to the next handler every time.
This allows you to write DRY and small handlers for resources.

![](https://raw.githubusercontent.com/dak0rn/espressojs/master/img/cascading-requests.png)

More information about the way espressojs uses resources handlers can be
read in [the wiki](https://github.com/dak0rn/espressojs/wiki/0.1-Cascading-requests).

## Installing

espressojs can be installed using the node package manager.

```bash
npm install --save espressojs
```

## The espressojs API

> This API description is not meant to be very detailed, please refer to the [Wiki](https://github.com/dak0rn/espressojs/wiki)
> for more information about the way espressojs works

### Creating a new API

espressojs exposes a constructor function that can be used to create new API instances.

```javascript
var Espresso = require('espressojs');
var api = new Espresso();
```

The constructor function takes an optional argument with configuration options.

```javascript
var Espresso = require('espressojs');

var options = {
    // ...
};
var api = new Espresso(options);
```

The following options are supported:
```javascript
{
  "skipMissingHandlers": true,       // Skip non-existing handlers for URI segments

  // Can be used to turn off cascading request handling globally
  "cascading": true,

  // These options will be used later to
  // dynamically build URLs
  "hostname": "localhost",          // Name of the server
  "protocol": "http",               // Protocol
  "apiRoot":  "/"                   // Root of the API,
  "port": ""                        // Port
}
```

More details about this can be found [here](https://github.com/dak0rn/espressojs/wiki/2-API-options).
These options can be accessed using the [Configurable](#configurable) interface
every API instance provides.

### Registering resources

Resources can be registered using the `.resource` function:

```javascript
Espresso.prototype.resource = function(pattern, fn, options, context);
Espresso.prototype.resource = function(pattern, handlers, options, context);
```

`pattern` is a relative URL identifying a resource. It may contain placeholders
starting with a colon, like `/api/:version/users/:userid`.

The second argument can either be a function (`fn`) that is meant to handle all
requests or an object (`handlers`) mapping HTTP verbs to handler functions. Any HTTP verb that
does not have a mapper will return a `405 Method not supported` response if requested.

`options` is an optional argument with configuration items for this handler.
The following flags are supported:

```javascript
{
    name: '',       // Unique name for this resource. Used to get access to it later.
    cascading: true // Indicates if cascading should be available for parent handlers
}
```

More details can be found [here](https://github.com/dak0rn/espressojs/wiki/3.1.1-Handler-options).

`context` is an optional argument that is used as `this` when invoking a handler function.
If not submitted, `this` will be the empty object (`{}`).

Here are some short examples:

```javascript
api.resource('/api', function(request, response, api) {
    return 'API';
});

api.resource('/api/:version', {
    // We want GET requests only
    'get': function(request, response, api, value) {
        // value will be 'API'
        return value + request.params.version;  // 'API' + :version
    }
});
```

Handler functions may also return a [promise](#promises):

```javascript
api.resource('/api/:version/:collectionName', function(req, res, api, value) {
    var deferred = api.deferred();

    myAsyncTask(function(){
        deferred.resolve( ':collectionName contents' );
    });

    return deferred.promise;
});
```

### Handler functions

As shown above, handler function have the following signature:

```javascript
function(request, response, api, value)
```

* `request` is a [request](#request) given to the API. `request.path` will
  be the path of the resource handled by this function.
* `response` is a [response](#response) created by handler functions. This object
is **shared between every** handler and the [serializer function](#setting-the-serializer-function).
* `api` is the currently used API object
* `value` is the return or fulfillment value of the previous handler.

### Getting resources
Registering handlers can be accessed with the `.get()` function.

```javascript
Espresso.prototype.get = function(what) {};
```

The given argument has to be an object identifying a resource.

```javascript
{
    name: 'name of the handler',   // Unique name of the handler
    // or
    pattern: '/handler/:pattern',  // Pattern of the handler
    // or
    path: '/handler/something'     // Handler that would handle this path
}
```

`.get()` will return `null` if no handler can be found.

The function returns a [`Handler` object](#handler);

### Deleting resources

Resources can be deleted with the `.delete()` function.

```javascript
Espresso.prototype.delete = function(what) {};
```

The given argument has to be an object identifying a resource.

```javascript
{
    name: 'name of the handler',   // Unique name of the handler
    // or
    pattern: '/handler/:pattern',  // Pattern of the handler
    // or
    path: '/handler/something'     // Handler that would handle this path
}
```

The properties are checked exactly in this order, so if you submit both
`.pattern` and `.name` only `.name` will be used to find a handler.

If you do not submit a valid object with valid values or if no handler was found the function will exit silently.

```javascript
api.resource('/a', function(){}, { name: 'a' }); // #1
api.resource('/a/:b', function(){});             // #2
api.resource('/a/b/:c', function(){});           // #3

// This would remove #1 even though the pattern for
// #2 is also given
api.delete({ pattern: '/a/:b', name: 'a'});

// This would remove #3
api.delete({ path: '/a/b/42' });

// This would remove #2
api.delete({ pattern: '/a/:b' });
```

It is also possible to delete the currently executed handler:

```javascript
api.resource('/something', function(request, response, api) {
    api.delete(this);
});
```

More information can be found [here](https://github.com/dak0rn/espressojs/wiki/3.3-Deleting-resources).

### Setting the serializer function
Serializer functions are used to create a serialized version of the last handler's
return/fulfillment value. They have the same signature as resource handlers and should return
something that can be sent to the client. It also can return a [promise](#promise) that will provide
its fulfillment value to the function that has sent the request.

```javascript
api.setSerializer( function(req, res, api, value) {

    if( "application/json" === res.headers['Content-type'] )
        return JSON.stringify( value );
    else
        // Something else here

});
```

* `request` is a [request](#request) given to the API. `request.path` will
  be the path of the resource handled by this function.
* `response` is a [response](#response) created by handler functions. This object
is **shared between every** handler and the [serializer function](#setting-the-serializer-function).
* `api` is the currently used API object
* `value` is the return or fulfillment value of the last handler.


The **default handler** will just invoke `JSON.stringify` on whatever it gets.

### Getting the serializer function
If you want to get the serializer function use the `.getSerializer` function for that.

```javascript
var fn = function() {};

api.setSerializer(fn);
api.getSerializer() === fn; // true
```


### Promises
An espressojs object offers a `.deferred()` function that returns a deferred object
and can be used to perform asynchronous operations without getting annoyed by callbacks.

```javascript
function(res, res, api) {
    var deferred = api.deferred();

    databaseOperation(function(err, result) {
        if( err )
            deferred.reject(err);
        else
            deferred.resolve(result);
    });

    return deferred.promise;        // Return only the promise part
}
```

### Request

espressojs offers a `Request` object used to send requests to the API.
It stores important information about the request including the required
fields for the HTTP method (`.method`) and the relative path (`.path`).

```javascript
Request
    .method = undefined;            // Request method, required
    .body   = {};                   // Request body, key-value-mappings
    .hostname = undefined;          // Name of the host
    .ip       = undefined;          // Client's IP address
    .path     = undefined;          // The request path, required
    .protocol = undefined;          // Request protocol, e.g. 'https'
    .query    = {};                 // Request's query string, key-value-mappings
    .cookie   = {};                 // Key-value-mapping of cookie values
    .header   = {};                 // Key-value-mapping of all header fields
    .params   = {};                 // Key-value-mapping of parameters from URL patterns
```

The constructor function allows you to provide an object to overwrite
properties or add custom attributes.

```javascript
var req = new Espresso.Request({ method: 'get', path: '/api/v1/users/dartvader' });

req.method; // get
req.path;   // /api/v1/users/darthvader
```

### Response

espressojs offers a `Response` object used to store meta data about the generated
request. An instance of it is shared between resource handlers and may be changed
multiple times. While it offers some generic properties it depends a lot
on the underlying server and the rest of the application.

```javascript
Response
    .status = '200';        // HTTP status code
    .headers = {};          // Response headers
    .body = undefined;      // Response body
    .cookies = {};          // Key-value-mapping of cookies
    .rawBody = undefined;   // Raw body, not serialized. Will be set before
                            // given the response to the invoking function
```

### Handler

A `Handler` represents a resource handler in the API. It stores information about
the pattern, handlers for HTTP verbs and the context to be executed in. Since it
uses the [Configurable](#configurable) interface there are also options available
described [here](#Registering-resources).

```javascript
handler.getPattern();       // metacarattere pattern
handler.getCallback('get'); // handler function for HTTP GET
handler.getCallbacks();     // all callbacks
handler.getContext();       // Handler's `this` context
```

### Configurable
All espressojs classes that inherits from the `Configurable` class provide the
following methods:

* `.setOption(key, value)` sets the option named `key` to `value`
* `.getOption(key)` returns the value of the option named `key`
* `.setAll(options)` sets all options from the given object
* `.getAll()` returns all options

### Dispatching a request

The `.dispatchRequest()` function is the interface to your application.
It takes a [request](#request) and returns a [promise](#promise) that will
be resolved with a [response](#response).

Make sure to set at least `.path` and `.method` if your request so that
it can be handled correctly.

```javascript
Espresso.prototype.dispatchRequest = function(request) {
    // magic
    return response;
};
```

```javascript
var r = new Espresso.Request({
    method: 'get',
    path: '/api/v2/users/_all'
});

api.dispatchRequest(r).then(function(response) {
    // Request successful
}).catch(function(response){
    // Request failed
});
```

An error is always provided as an object in `response.body`. It has a key `error`
containing the error message.

The following rules concerning **errors** apply:

* If the given `Request` is `undefined`, `null` or not a valid object a `Response` with status
  code `500` will be created. It's body contains the error message `'"invalid Espresso.Request given"'`.
* If the given `Request` does not have a `.method` set a `Response` with status
  code `500` will be created. It's body contains the error message `'"invalid Espresso.Request given"'`.
* If the given `Request` does have `.method` set to something that is not a `string` a `Response` with status
  code `500` will be created. It's body contains the error message `'"invalid Espresso.Request given"'`.
* If the given `Request` does not have a `.method` set a `Response` with status
  code `500` will be created. It's body contains the error message `'"invalid Espresso.Request given"'`.
* If the given `Request` does not have a `.path` set a `Response` with status
  code `500` will be created. It's body contains the error message `'"invalid Espresso.Request given"'`.
* If the given `Request` does have `.path` set to something that is not a `string` a `Response` with status
  code `500` will be created. It's body contains the error message `'"invalid Espresso.Request given"'`.

* If no handler for the requested path is available a `Response` with status code
  `400` will be created. It's body contains the error message `'"resource not found"'`.

* If the [global option](#creating-a-new-api) `cascading` is set to `true` and the
  global option `skipMissingHandlers` is set to `false` ( = all handlers in a cascade chain
  have to be executed ) and if a handler for a parent URI of the requested one
  is missing a `Response` with status code `500` will be created. It's body contains
  the error message `'"incomplete resource handler chain"'`.


**Side note:** Errors listed above will not be passed to the [serializer](#setting-the-serializer-function)
but given to the returned [Promise](#promises) directly when it is **rejected**.

### Utility functions

#### chainComplete
The `api.chainComplete()` function can be used to detect if the current handler
has been invoked in a chain. It expects one argument, the context of the handler.

```javascript
Espresso.prototype.chainComplete = function( handlerContext ){};
```

```javascript
api.resource('/some/thing', function(response, request, api) {

    if( api.chainComplete(this) )
        // ...

});
```

### linkTo
The `api.linkTo()` function can be used to create hypermedia links to a resource.
All of its two arguments are optional and it returns an URL which is built using the [server options](#creating-a-new-api)
stored in the API.

```javascript
Espresso.prototype.linkTo = function(what, replacers){};
```
The first argument can be

* omitted, the API URL is returned then
* a string which will be appended to the API URL
* an object `{name: 'something'}` where `'something'` is the name of a resource handler
* the `this` context of the current handler. The API URL + the current path will be returned

If you use the object argument to link to a handler the second argument will be used
to replace placeholder values in its URI.

```javascript
var api = new Espresso({
    protocol: 'https',
    hostname: 'apiserver.example.org',
    apiRoot: '/api/v1',
    port: '1024'
});

api.resource('/key/:storage/all', function(){}, {name: 'allkeys'});

api.linkTo();                       // https://apiserver.example.org:1024/api/v1
api.linkTo('/permission');          // https://apiserver.example.org:1024/api/v1/permission
api.linkTo( { name: 'allkeys'} );   // https://apiserver.example.org:1024/api/v1/key/:storage/all
api.linkTo(
    {name: 'allkeys'},
    {storage: 'users'});   // https://apiserver.example.org:1024/api/v1/key/users/all

```
