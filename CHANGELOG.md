# Version 2.2.0

## External

* The `.linkTo()` function can be used to get a fully qualified hypermedia link to a registered resource. This is also possible with `.linkTo(this)` in handlers.
* Resource handlers can be accessed using `.get()`
* Errors in `.dispatchRequest()` now contains an error message
* There is now a `.port` config

## Internal

* The `__espressojs` context now contains the path of the currently processed handler
* The `.delete()` function now uses `.get()` to find the handler it has to delete
* The utility function `createErrorResponse()` now takes an extra message argument

# Version 2.1.0

## External
* `.delete()` can now be used to delete the currently processed handler using `api.delete(this)`.
* Cascading can be turned off globally using the global `.cascading` option
* The previously internal-only class `Handler` is now accessible using `Espresso.Handler`. It uses the new `Configurable` interface.
* The default value for `apiRoot` used in Espresso is now `"/"`

## Internal
* The utility function `buildResourceTable()` is used to build the list of resource handlers from the internal `._ids` list. This should improve the performance of functions like `.delete()` and makes stuff easier.
* The context hook `this.__espressojs` now contains a reference to the currently processed handler
* The utility function `handler.register()` is used to add a resource handler to the name table and the ID table
* The utility function `handler.unregister()` is used to remove a resource handler from the name table and the ID table

# Version 2.0.0

**This release contains breaking changes**

## External

* The `.resource()` function now takes an `options` argument with per-resource-configurations [**breaking**]
  - `.name` is a unique name the user can use to identify this resource and its handler later
  - `.cascading` indicates if cascading is allowed for this resource. If not, only the resource handler will be executed.
* The `.delete()` function can be used to delete a resource from the API. It takes an object that may contain `.name` with a resource handler name or `.pattern` containing a pattern of the resource or `.path` with a path matching a resource to delete. `.delete()` will search in this order.

## Internal

* The compiled regex is stored internally in an extra object. This is a fast way to prevent users from creating multiple handlers for the same resource.
* Resource handlers names are stored in an internal object

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
