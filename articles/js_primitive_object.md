# The Custom Object Primitive

At one point in time, it wasn't uncommon to hear people say "everything in JavaScript is an object."  Unfortunately, even though sometimes it can seem that way, this statement is not true.  There are objects in JavaScript, and then there are primitive values, which are specifically not objects.  People are often confused about the differences between primitive and object types in JavaScript - and with good reason. The line can be a blurry one.

Here we will explore some of those differences with an exercise.  In this exercise we will see how far we can go in making an object appear as a primitive in JavaScript.

## What is a Primitive?

The specification (2019) [includes a description for primitives](http://www.ecma-international.org/ecma-262/10.0/index.html#sec-primitive-value) that states:

> A primitive value is a datum that is represented directly at the lowest level of the language implementation.

At a high level, this is telling us that primitive values can't be broken down into other, smaller values.  Object types, for example, are essentially containers for other values.  Primitives, on the other hand, are themselves, representations of the lowest possible level of a value.

There are 7 primitive types in JavaScript:

* BigInt
* Boolean
* Null
* Number
* String
* Symbol
* Undefined

Everything else, including arrays and functions, fall under the object type.
