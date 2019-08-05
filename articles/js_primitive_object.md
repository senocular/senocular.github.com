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

Sometimes you'll hear that the difference between primitives and objects is that primitives pass by value while objects pass by reference.  This is also not true.  Everything in JavaScript passes by value.  Whether or not you pass a primitive or an object into a function call, the values given to that function are equal to their originals.

```javascript
let obj = {}
let str = 'string'

function compare (a, b) {
  console.log(obj === a) // true
  console.log(str === b) // true
}

compare(obj, str)
```

Primitive values may also be representations of references.  You may have noticed this when working with strings.  If you copy a large string many times, memory in your application does not explode to reflect those copies.  Instead an optimization in the runtime will use references to manage those string copies efficiently, each string in JavaScript ultimately referencing the same string data in memory.

```javascript
let str = 'A very long string...'
let duplicates = []
for (let i = 0; i < 1000000; i++) {
    duplicates.push(str) // reference to the same string data under the hood
}
```

But ultimately, the language provides an abstraction for these values which keeps you from having to worry about anything related to memory.  All you need to know is that if you pass a value into a function call, the same value is seen in the function body.

## Primitives are Immutable

The key differentiator for primitives is that they're immutable.  Why does it seem like they pass by value and not reference?  Because you cannot change any of their properties and have that change reflected in the original - this assuming there's a property to even change.

```javascript
let obj = {}
let str = 'string'

function mutate (a, b) {
  a.property = true // OK, changes obj
  b // ... nothing to change
}

mutate(obj, str)
```

Note that primitives _can_ behave like objects.  This is what allows them to use properties and methods defined by their respective types, methods like String's `toUpperCase()`.  This behavior is enabled through _autoboxing_, a temporary wrapping of primitive values into their respective object type that grants them access to the primitive type's API.

```javascript
let str = 'string'
str.toUpperCase() // OK

// autoboxing secretly turns the above into
let temporaryBox = new String(str)
temporaryBox.toUpperCase()
```

While primitives are inherently immutable, JavaScript also provides tools for making objects immutable too.

## The Primitive Object

If primitives and objects are so similar, how far can we go to make an object like a primitive?  That's what we're here to find out. Say hello to the primitive object:

```javascript
function PrimitiveObject() {
  return Object.freeze({})
}
let primitive = PrimitiveObject()
```

This is the first step in making an object that appears to be a primitive.  It starts with a function, `PrimitiveObject`, that creates the primitive. When called, it returns an immutable value that can't have properties added, removed, or otherwise altered thanks to `Object.freeze` - our new primitive.

You may recognize this pattern for primitive creation as it is also used for creating symbols.

```javascript
let symbol = Symbol()
```

While not true with other primitives, like symbols, PrimitiveObject instances are also not equal.

```javascript
console.log(Symbol() === Symbol()) // false
console.log(PrimitiveObject() === PrimitiveObject()) // false
```

### Associating with a Type

Most primitives (except Null or Undefined) also have a respective type.  We should also have one for PrimitiveObject.  This means creating a type - like `String` for strings - to represent PrimitiveObject and its properties and methods.  Additionally, like other primitives, using `instanceOf` should not return true when checking for a primitive value when checked against its type.  Luckily, we can achieve this using `Symbol.hasInstance`.

Because we're creating instances with a function mirroring symbols, we'll need to use a constructor function instead of `class` since `class`-defined constructors can't be called as functions.

```javascript
let PrimitiveObject
{
  let canConstruct = false

  PrimitiveObject = function () {
    if (new.target === PrimitiveObject) { // called with new
      if (!canConstruct) {
        throw new TypeError('PrimitiveObject is not a constructor')
      }
    } else { // called as function
      canConstruct = true
      const instance = new PrimitiveObject()
      canConstruct = false
      return Object.freeze(instance)
    }
  }

  PrimitiveObject.prototype.isPrimitive = function () {
    return true
  }

  Object.defineProperty(PrimitiveObject, Symbol.hasInstance, {
    value () {
      return false
    }
  })
}
let primitive = PrimitiveObject()
console.log(primitive.isPrimitive()) // true
console.log(primitive.isPrimitive === PrimitiveObject.prototype.isPrimitive) // true
console.log(primitive instanceof PrimitiveObject) // false
```

With this, `PrimitiveObject` is a proper constructor for PrimitiveObject instances with an API inherited from its prototype. However, as with symbols, the constructor can't be called with `new` in user code and instead it needs to be used as a factory function (which internally uses `new`).

What about `typeof`?  While `typeof` does help in identifying primitives, it does not do so consistently, so we're not going to worry about it.  For example, `typeof null` results in "object", even though `null` is a primitive.  Also functions, another kind of non-primitive object, also has its own entry for `typeof`: "function".  So `typeof` doesn't really exist as a way to completely separate primitives from objects.  Also, there's nothing we could do to change its output for our PrimitiveObject even if we wanted to.

### Putting PrimitiveObject to the Test

