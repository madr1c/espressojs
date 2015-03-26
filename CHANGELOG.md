# Version 1.1.0

## External

* The espressojs constructor function now takes an optional configuration object
  - the `.skipMissingHandlers` property indicates if missing segment handlers may be skipped or will produce a `500 Internal server error` response. Default is `true`.
  - Fields that configure the server properties
    - `.protocol` is the protocol, default `"http"`
    - `.hostname` is the name of the server, default `"localhost"`
    - `.apiRoot` is the relative root of the API, default `""`
* Options configured in the constructor can be accessed using `.getOption()` and `.setOption()`
* The `api.chainComplete(this)` can be used to test if a complete chain was handled or if handlers were missing and skipped

## Internal

* If `.skipMissingHandlers` is `true` cascading requests will no longer create a 500 if a segment handler is missing

# Version 1.0.0

**Initial release**

- Resources can be registered using the `.resource()` function
- `.resource()` allows you to submit a function for all methods or an object with mappings
  for HTTP verbs
- `.resource()` will create responses with status 500 if an error occurs
- `.resource()` will create a response with status 400 if the path cannot be found in the registered resources
- The following HTTP verbs are considered now:
    - GET
    - POST
    - PUT
    - DELETE
    - HEAD
    - OPTIONS
- Requests can be made using the `.dispatchRequest()` function
- The serializer function can be set and gotten with with `.setSerializer()` or `.getSerializer()`
- Requests and responses are accessible using `.Request` and `.Response`
