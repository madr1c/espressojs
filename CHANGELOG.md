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
