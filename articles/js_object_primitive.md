# The Custom Object Primitive

The custom object primitive is a new custom type created in JavaScript to give the appearance of a primitive despite the fact that it's actually an object.  Its creation was an exercise to discover how far an object could go in making itself indistinguishable from a primitive, largely spurred by misconceptions around how values work in JavaScript such as...

## "Everything is an Object"

False.

Though you may sometimes hear "everything is an object" in JavaScript, this is not true. There are a number of values known as primitives are explicitly not objects.  They are:

* BigInt
* Boolean
* Null
* Number
* String
* Symbol
* Undefined

Everything else, including arrays and functions, are considered objects.

While primitives are themselves not objects, many (not including null or undefined) can behave like objects.  This is thanks to a behavior known as _autoboxing_ which temporarily wraps primitive values in their respective object types when those primitives are being used as objects in code.

```javascript
let number = 10
number.toString() // OK, thanks to autoboxing
```

Behind the scenes, that expression looks something like:

```javascript
let number = 10
new Number(number).toString()
```

Its the `Number` type which defines the `toString()` method used here, so in order for it to be made available to the non-object primitive, a new `Number` object instance is created with the primitive value as its base value and the method is called from that.

When it comes to defining the custom object primitive, the goal is to act like a primitive.  Because primitives act like objects, the custom object primitive can safely _be_ an object.  As a starting point for its definition, we simply have:

```javascript
// generation 1
let objectPrimitive = {}

// test
objectPrimitive.toString() // {} - OK
```

This is a good beginning, but there's still much more to do.

## "Primitives Have Value Equality"

True.

This is not a misconception, just an observation of behavior. Whenever you have two primitives of the same value, despite being different instances of that value, when compared they are equal.

```javascript
1 === 1 // true
true === true // true
'string' === 'string' // true
```

This is not the case for objects.

```javascript
{} === {} // false
```

You might say objects don't really have their own value; that they're just containers for other values.  It's largely the literal syntax that's being used that makes the object values appear to be the same even though they're each separate instances of `Object`.  The above is really a shorthand for:

```javascript
new Object() === new Object() // false
```

When it comes to primitives, there is a primitive type that is similar to objects in this way: the symbol primitive.  Symbols don't have a literal syntax. To create one you call the `Symbol()` function.  Each time you call that function, a new symbol is created and each symbol is always unique and not equivalent to any other symbol. 

```javascript
Symbol() === Symbol() // false
```

This approach to creation can be used with the object primitive to help separate it from the literal syntax used by other objects.

```javascript
// generation 2
function ObjectPrimitive () {
  return {}
}

// test
ObjectPrimitive() === ObjectPrimitive() // false - OK
```

Now object primitive values are created with a function and each have their own unique values just like the symbol primitive.  One step closer.

## "Objects Pass by Reference, Primitives Pass by Value"

False.

Given the level abstraction JavaScript provides for its values there's no observable difference between how values are passed.  The easiest way to look at it is that all values are references and all passing is done by value.  So when a value is passed, it's passed by value, and the value being passed is a reference.  This would apply to both objects and primitives.


```javascript
let obj = {}
let str = 'string'

function compare (a, b) {
  console.log(obj === a) // true
  console.log(str === b) // true
}

compare(obj, str)
```

What makes this statement appear to be true is that you can alter properties of an object value passed to a function within that function and it would affect the value of the original.  This cannot be done with primitives.

```javascript
let obj = {}
let str = 'string'

function mutate (a, b) {
  a.property = true // OK, changes obj
  b.property = true // Fail, cannot change
}

mutate(obj, str)

console.log(obj.property) // true
console.log(str.property) // undefined
```

This, however, is not a consequence of the way the values are being passed into the function, rather a consequence of the fact that primitives are _immutable_.  In other words, there's nothing _to_ change in a primitive that would allow it to be reflected in the original value.

Objects can also be made immutable in JavaScript using `Object.freeze()`.  A frozen object, like primitives, can't have properties added, deleted, or changed.  The object primitive can be updated to be immutable as well.

```javascript
// generation 3
function ObjectPrimitive () {
  return Object.freeze({})
}

// test
function mutate (a) {
  a.property = true
}

let objectPrimitive = ObjectPrimitive()
mutate(objectPritive)
console.log(objectPritive.property) // undefined - OK
```

Just like any primitive passed into a function, now an object primitive instance would also not be changed.

## "Primitives Are Not Instances of Their Type"

True.

Simply, using `instanceof` on primitives returns false despite the fact that primitives behave like instances of those types (as seen with autoboxing).  This is because autoboxing doesn't get applied for uses of `instanceof`.

```javascript
1 instanceof Number // false
'string' instanceof String // false
Symbol() instanceof Symbol // false
```

For the object primitive there's a few things to do here.  First, it needs to have a type.  There's an `ObjectPrimitive` function for creating new instances, but there's nothing that ties those instances to that function.  Symbol instances, for example, inherit from `Symbol.prototype`.  Object primitive instances should do the same with `ObjectPrimitive.prototype`.

Once thats in place, `instanceof` needs to be fixed so that object primitives, despite appearing as instances of `ObjectPrimitive` when used, aren't reported as being so.  Luckily this can be achieved with the help of `Symbol.hasInstance`.

```javascript
// generation 4
function ObjectPrimitive () {
  if (new.target === ObjectPrimitive) {
    throw new TypeError('ObjectPrimitive is not a constructor')
  }

  return Object.freeze(Object.create(ObjectPrimitive.prototype))
}

ObjectPrimitive.prototype.toString = function () {
  return 'ObjectPrimitive()'
}

Object.defineProperty(ObjectPrimitive, Symbol.hasInstance, {
  value () {
    return false
  }
})

// test
let objectPrimitive = ObjectPrimitive()
console.log(objectPrimitive.toString === ObjectPrimitive.prototype.toString) // true - OK
console.log(objectPrimitive.toString()) // ObjectPrimitive() - OK
console.log(objectPrimitive instanceof ObjectPrimitive) // false - OK
new ObjectPrimitive() // Error, ObjectPrimitive is not a constructor - OK
```

Object primitives now have access to methods in `ObjectPrimitive.prototype`, as seen with the custom `toString()` thanks to `Object.create()` in the `ObjectPrimitive` function.

Additionally, again mirroring symbols, `ObjectPrimitive` blocks itself from being called with `new`.  This prevents an alternative object-based version of the object primitive that would be expected to pass the `instanceof` test.  For example, string primitives are not instances of `String` but String objects are.

```javascript
'string' instanceof String // false
new String('string') instanceof String // true
```

Finally, because `instanceof` works by checking the prototype chain, we are able to block it from returning true for `ObjectPrimitive` using `Symbol.hasInstance`.  This approach, however, does _not_ prevent `instanceof` checks against `Object`.

```javascript
ObjectPrimitive() instanceof Object // true - Fail
```

The `Object` type _could_ be modified with `Symbol.hasInstance` to account for this as well, but it is not scalable and bad practice to modify built-ins.

| What About `typeof`? |
| :--- |
| While `typeof` does help in identifying primitives, it does not do so consistently, so we're not going to worry about it.  For example, `typeof null` results in "object", even though `null` is a primitive.  But there's also nothing we could do to change the `typeof` result for the object primitive even if we wanted to as it is not configurable. |

## The Downfall of the Object Primitive

The custom object primitive has come a long way in appearing to be a primitive (mostly the symbol primitive) despite really being an object.  The tests speak for themselves.

```javascript
let objectPrimitive = ObjectPrimitive()

// acts like an object
console.log(objectPrimitive.toString()) // ObjectPrimitive() - OK

// symbol primitive-like equality
ObjectPrimitive() === ObjectPrimitive() // false - OK

// immutable, "pass by value"-like behavior
function mutate (a) {
  a.property = true
}

mutate(objectPritive)
console.log(objectPritive.property) // undefined - OK

// inherits from type while not being instanceof type
console.log(objectPrimitive.toString === ObjectPrimitive.prototype.toString) // true - OK
console.log(objectPrimitive instanceof ObjectPrimitive) // false - OK
new ObjectPrimitive() // Error, ObjectPrimitive is not a constructor - OK
```

There is, however, one flaw in the object primitive that has not yet been addressed.  That is, primitives do not equal their object equivalents.  While the last generation of the object primitive has taken a step to prevent creating what may be considered its object equivalent by blocking `new ObjectPrimitive()`, there is still another way to get object values from primitives: using the `Object` conversion function. 

```javascript
'string' instanceof String // false
Object('string') instanceof String // true
Object('string') === 'string' // false
```

Given that object primitive values are already objects, converting one with `Object()` does not result in a new object version of the value. Instead it returns the same value.

```javascript
let objectPrimitive = ObjectPrimitive()
console.log(Object(objectPrimitive) === objectPrimitive) // true - Fail
```

Despite all the masquerading, there's still no hiding that the object primitive is still an object.  Nevertheless, it does come close, especially when compared to the symbol primitive given its all its peculiarities.
