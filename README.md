# espressojs
## A framework for building REST APIs

espressojs is a small Open Source framework that can be used to build REST APIs
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

More information about the way espressojs handles resource handlers can be
read in [the wiki](https://github.com/dak0rn/espressojs/wiki/Cascading-requests).

## The espressojs API
