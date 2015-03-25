# espressojs
## A framework for building REST APIs

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
read in [the wiki](https://github.com/dak0rn/espressojs/wiki/Cascading-requests).

## Installing

espressojs will be installable with `npm` when the first release is available.

## The espressojs API

> This API description is not meant to be very detailed, please refer to the [Wiki](https://github.com/dak0rn/espressojs/wiki)
> for more information about the way espressojs works

### Creating a new API

espressojs exposes a constructor function that can be used to create new API objects.

```javascript
var Espresso = require('espressojs');
var api = new Espresso();
```

### Registering resources

Resources can be registered using the `.resource` function:

```javascript
Espresso.prototype.resource = function(pattern, fn, context);
Espresso.prototype.resource = function(pattern, handlers, context);
```

`pattern` is a relative URL identifying a resource. It may contain placeholders
starting with a colon, like `/api/:version/users/:userid`.

The second argument can either be a function (`fn`) that is meant to handle all
requests or an object (`handlers`) mapping HTTP verbs to handler functions. Any HTTP verb that
does not have a mapper will return a `405 Method not supported` response if requested.

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

Handler functions may also return a [Promise](#promises):

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

### Setting the serializer function
Serializer functions are used to create a serialized version of the last handler's
return/fulfillment value. They have the same signature as resource handlers and should return
something that can be sent to the client.



### Getting the serializer function

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
