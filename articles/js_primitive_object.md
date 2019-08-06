# The Custom Object Primitive

At one point in time, it wasn't uncommon to hear people say "everything in JavaScript is an object."  Unfortunately, even though sometimes it can seem that way, this statement is not true.  There are objects in JavaScript, and then there are primitive values, which are specifically not objects.  People are often confused about the differences between primitive and object types in JavaScript - and with good reason. The line between them can be a blurry one.

Here we will explore some of those differences with an exercise.  In this exercise we will see how far we can go in making an object appear as a primitive in JavaScript.

## What is a Primitive?

The specification (2019) [includes a description for primitives](http://www.ecma-international.org/ecma-262/10.0/index.html#sec-primitive-value) that states:

> A primitive value is a datum that is represented directly at the lowest level of the language implementation.

This is basically telling us that primitive values can't be broken down into other, smaller values.  Object types, for example, are essentially containers for other values.  Primitives, on the other hand, are themselves, representations of the lowest possible level of a value.

There are 7 primitive types in JavaScript:

* BigInt
* Boolean
* Null
* Number
* String
* Symbol
* Undefined

Everything else, including arrays and functions, fall under the object type.

## Pass by Reference or Pass by Value?

Sometimes you'll hear that the difference between primitives and objects is that primitives pass by value while objects pass by reference.  This is also not true.  Everything in JavaScript passes by value.  Whether or not you pass a primitive or an object into a function call, the value given to that function is equal to its original.  It's only the variable referring to that value that has changed.

```javascript
let obj = {}
let str = 'string'

function compare (a, b) {
  console.log(obj === a) // true
  console.log(str === b) // true
}

compare(obj, str)
```

There's nothing about this passing behavior that is distinctively unique for either objects or primitives.  The fact that you can alter the object value and have its changes reflected back in the original is not a consequence of how that value was passed, rather a consequence of primitives being immutable.

## Primitives are Immutable

A key differentiator for primitives is that they're always immutable.  Why does it seem like they pass by value and not reference?  Because you cannot change any of their properties and have that change reflected in the original.

```javascript
let obj = {}
let str = 'string'

function mutate (a, b) {
  a.property = true // OK, changes obj
  b.property = true // Fail, cannot change
}

mutate(obj, str)
```

Because the `str` string is an immutable primitive, new properties cannot be added to it (nor existing properties changed).  This means there's no way of knowing if `b` was passed in any differently than `a`.  Even if you made changes to the string value, those changes, as is the case with all primitives, would result in new values being created rather than updates to the original.  All we know is that, comparatively, `b` is the same value as `str` in the outer scope.

What if the `obj` object were also immutable?  Would there be any difference with the `str` string then?

```javascript
let obj = Object.freeze({})
let str = 'string'

function mutate (a, b) {
  a.property = true // Fail, cannot change
  b.property = true // Fail, cannot change
}

mutate(obj, str)
```

In this case both `a` and `b` cannot be changed within the function yet one is an object and the other is a primitive.

## The Primitive Object

Given the similarities of primitives and immutable objects, lets create a new, custom primitive that is based on an immutable object and see how far we can go to make it appear like any other primitive in JavaScript.

```javascript
function PrimitiveObject() {
  return Object.freeze({})
}
```

Since we can't define a new literal syntax - as most literals have - we will follow symbol's lead and use a function to create new instances of our primitive.  When called, it creates and returns a new primitive object. Like other primitives, it too is immutable.

```javascript
let primitive = PrimitiveObject()
primitive.property = true // Fail, cannot change
```

Like symbols, PrimitiveObject instances are also not equal.

```javascript
console.log(Symbol() === Symbol()) // false
console.log(PrimitiveObject() === PrimitiveObject()) // false
```

Thankfully, this is a precedent set by symbols that we can take advantage of since we have no value to compare with in this new primitive (nor any way to make this work if we wanted to).

### Associating with a Type

Most primitives (except null or undefined) also have a respective type.  We should also have one for PrimitiveObject.  This means creating a type - like `String` for strings - to represent PrimitiveObject and its properties and methods.  

Additionally, like other primitives, using `instanceof` should not return true when checking for a primitive value when checked against its type.  Luckily, we can (mostly) achieve this using `Symbol.hasInstance`.

Because we're creating instances with a function mirroring symbols, we'll need to use a constructor function instead of `class` given that `class`-defined constructors can't be called as functions.

```javascript
function PrimitiveObject () {
  if (new.target === PrimitiveObject) { // called with new
    throw new TypeError('PrimitiveObject is not a constructor')
  }

  return Object.freeze(Object.create(PrimitiveObject.prototype))
}

PrimitiveObject.prototype.isPrimitive = function () {
  return true
}

Object.defineProperty(PrimitiveObject, Symbol.hasInstance, {
  value () {
    return false
  }
})
```

With this, `PrimitiveObject` now also represents the primitive's type and has an API inherited from its `prototype`. Additionally, as with symbols, the constructor can't be called with `new`.  New instances can only be created using `PrimitiveObject` as a function.

| What About `typeof`? |
| :--- |
| While `typeof` does help in identifying primitives, it does not do so consistently, so we're not going to worry about it.  For example, `typeof null` results in "object", even though `null` is a primitive.  But there's also nothing we could do to change the `typeof` result for our PrimitiveObject even if we wanted to. |

### Putting PrimitiveObject to the Test

```
let primitive = PrimitiveObject()
console.log(primitive.isPrimitive()) // true
console.log(primitive.isPrimitive === PrimitiveObject.prototype.isPrimitive) // true
console.log(primitive instanceof PrimitiveObject) // false

try {
  new PrimitiveObject()
} catch (err) {
  console.error(err.message) // PrimitiveObject is not a constructor
}

function mutate (a) {
  a.property = true
}

mutate(primitive)
console.log(primitive.property) // undefined
```

