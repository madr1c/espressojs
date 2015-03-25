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
