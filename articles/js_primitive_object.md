# The Custom Object Primitive

At one point in time, it wasn't uncommon to hear people say "everything in JavaScript is an object."  Unfortunately, even though sometimes it can seem that way, this statement is not true.  There are objects in JavaScript, and then there are primitive values, which are specifically not objects.  People are often confused about the differences between primitive and object types in JavaScript - and with good reason. The line between them can be a blurry one.

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

## Pass by Reference or Pass by Value?

Sometimes you'll hear that the difference between primitives and objects is that primitives pass by value while objects pass by reference.  This is also not true.  Everything in JavaScript passes by value.  Whether or not you pass a primitive or an object into a function call, for example, the values given to that function are equal to their original.

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
let list = []
for (let i = 0; i < 1000000; i++) {
    list.push(str) // reference to the same string data
}
```

## Primitives are Immutable

The key differentiator for primitives is that they're immutable.  Why does it seem like they pass by value and not reference?  Because you cannot change any of their properties and have that change reflected in the original - this assuming there's a property to even change.

```javascript
let obj = {}
let str = 'string'

function mutate (a, b) {
  a.property = true // OK, changes obj
  b // ... nothing can change
}

mutate(obj, str)
```

Note that primitives _can_ behave like objects.  This is what allows them to use properties and methods defined by their respective types.  This is what allows string primitives to use methods like `toUpperCase()`.  This behavior is enabled through _autoboxing_, a temporary wrapping of primitive values into their respective object type that grants them access to the type's API.

```javascript
let str = 'string'
str.toUpperCase() // OK

// autoboxing secretly turns the above into
let temporaryBox = new String(str)
temporaryBox.toUpperCase()
```

The thing about immutability is that JavaScript provides tools for making objects immutable too.  So if primitives can be references like objects, and both can be immutable, what really separates the two?

## The Primitive Object

If primitives and objects are so similar, how far can we go to make an object like a primitive?  Say hello to the primitive object:

```javascript
function PrimitiveObject() {
  return Object.freeze({})
}
let primitive = PrimitiveObject()
primitive.property = true // Fails, like other primitives
```

Here, the function `PrimitiveObject` is being used to create a new primitive object instance which is simply an plain JavaScript object made immutable with `Object.freeze`.  Because its frozen, properties can't be added, removed, or otherwise altered.

