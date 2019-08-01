# Why JavaScript's class is Not Just Syntactic Sugar

The `class` syntax in JavaScript is often described as "syntactic sugar" for normal constructor functions, meaning it's just a different way of doing the same thing.  But this is not entirely true.  While JavaScript continues to use constructor functions to represent its version of classes - even when using the `class` syntax - constructors created using `class` are quite different from those created through normal function declarations.

## A Simple Desugaring

First we'll look at a breakdown of a `class`-defined constructor roughly see how it would desugar into a standard JavaScript function.  Given:

```javascript
class Foo {}
```

It would be approximately equivalent to:

```javascript
let Foo = function () {}
```

At its simplest, this is what `class` is doing, creating a function.  As with normal function declarations, all the plumbing that is necessary for using this definition as a constructor, for example, the presence of a `prototype` property, is all there.

Next, a more complicated example:

```javascript
class Foo {
  constructor (input) {
    this.input = input
  }
  getInput () {
    return this.input
  }
}

class Bar extends Foo {
  constructor (input) {
    super(input)
  }
  getInput () {
    const input = super.getInput()
    return `Bar: ${input}`
  }
}
```

This would roughly desugar to:

```javascript
let Foo = function (input) {
  this.input = input
}
Foo.prototype.getInput = function () {
  return this.input
}

let Bar = function (input) {
  Object.getPrototypeOf(Bar).call(this, input)
}
Bar.prototype.getInput = function () {
  const input = Object.getPrototypeOf(Bar.prototype).getInput.call(this)
  return `Bar: ${input}`
}
Object.setPrototypeOf(Bar, Foo)
Object.setPrototypeOf(Bar.prototype, Foo.prototype)
```

Here, the details around the implementation of the inheritance becomes more apparent in the desugaring.  When one class extends another, the prototype chain is updated to include that of the subclass's. The class's themselves are also linked for inheriting static definitions.  Also we can see how calls with `super` resolve into calls from the superclass against the current instance.

For the most part, the original and the desugaring are equivalent definitions.  But there are differences.

## `class` Functions Are Not Callable Without `new`

One feature of `class` functions is that you are required to call them with `new`.  Attempting to call them as normal functions will throw an error.

```javascript
class Foo {}
Foo() // Error
```

For better or worse, this is a protection keeping you from accidentally calling constructor code against an unexpected `this` value.  There may be cases where you might want this behavior, for example if re-using the constructor as a conversion function (not unlike what you see with `String()` and `Number()` etc.), but with the `class` syntax, this is not allowed.

Assuming you want this behavior, it can be emulated with the `function` constructor syntax as well:

```javascript
let Foo = function () {
  if (new.target === undefined) {
    throw new Error()
  }
}
```

However, unlike the `class` error, this error is thrown after the call to the function is already made.  For `class` functions, the error is thrown before the function gets a chance to be called.

## `class` Functions Can Correctly Extend Built-ins

At a high level, there are two categories of objects in JavaScript: ordinary objects and exotic objects.  Ordinary objects are objects anyone can create in JavaScript using the `Object` constructor or the object literal syntax (`{...}`) etc..  Exotic objects are special objects that have an additional internal behavior that go beyond ordinary objects.

Array objects are of the most common exotic objects.  Arrays are very much like ordinary JavaScript objects except for one special property: `length`.  The `length` property is unique in that it is able to automatically update based on changes to the indexed members of an array instance.

```javascript
const arr = []
arr.length // 0
arr[2] = 2
arr.length // 3
```

Prior to the `class` syntax, attempts to properly extend the `Array` class have largely failed because of this magical property.  Construction and inheritance could work, but not `length`.

```javascript
function MyArray () {
  Array.prototype.push.apply(this, arguments) // super
}
MyArray.prototype = Object.create(Array.prototype)
MyArray.prototype.constructor = MyArray

var myArr = new MyArray(0, 1, 2)
myArr.length // 3
myArr[3] = 3
myArr.length // 3 but expected 4
```

The reason for this is because the object created by the MyArray constructor is an ordinary object and the behavior of `length` in arrays is dependent on the behavior of an array's exotic definition.

With the `class` syntax, by extending `Array`, the instance created by the class is able to take on the exotic array behavior.

```javascript
class MyArray extends Array {} // default constructor/super

var myArr = new MyArray(0, 1, 2)
myArr.length // 3
myArr[3] = 3
myArr.length // 4 as expected
```

The same applies to other exotic types like `Date`, `Map`, etc..  Using the `class` syntax, the special exotic requirements needed during initialization are automatically applied to the instance created for the class constructor.

## `class` Function Instances Are Created From Superclasses

The biggest and probably most important difference with `class` constructors is how they create instances.  With normal function constructors, instances are created immediately with the invocation of the constructor function.  This instance object is an ordinary JavaScript object whose prototype has been set to equal the value currently referenced by the `prototype` property of the constructor.  At this point it then becomes the responsibility of the constructor to make super-like calls to any superclasses to provide any initialization defined there.

```javascript
function Foo () {}
function Bar (input) {
  // `this` created as part of new Bar() call
  Foo.call(this) // super(), using existing `this`
  this.input = input
}
Object.setPrototypeOf(Bar.prototype, Foo.prototype);

new Bar()
```

With `class` constructors, the instance is not created immediately for the constructor, but rather provided by the superclass.  In fact its this behavior that allows `class`-defined classes to properly extend exotic built-ins.

```javascript
class Foo {}
class Bar extends Foo {
  constructor (input) {
    super() // creates `this`
    this.input = input // `this` here is determined by superclass
  }
}

new Bar()
```

It's this behavior that causes an error if access to `this` is attempted prior to `super` (assuming extending another class).

```javascript
class Foo {}
class Bar extends Foo {
  constructor (input) {
    this.input = input // Error, `this` not yet defined
    super() // now `this` is available
  }
}

new Bar()
```

In the above example, the value of `this` would be coming from the `Foo` constructor (though `super` will also perform the necessary updates to the instance's prototype for inheritance), so attempting to set a property on `this` before the `Foo` constructor has run via the call to `super` causes an error.  Any access to `this` needs to happen after `super` because it's not until then that `this` exists.

### Abusing Instance Creation in Superclass

One thing about this behavior is that it can also potentially cause problems depending on what the superclass is doing.  Consider the following:

```javascript
class Foo {
  constructor () {
    Object.freeze(this)
  }
}

class Bar extends Foo {
  constructor (input) {
    super()
    this.input = input // Error
  }
}

new Bar()
```

Here, the superclass froze the instance with `Object.freeze` so the subclass is not able to add any more properties to it.  Because the subclass has no access to `this` until after the superclass returns it via `super`, there's nothing it can do.  Using the `function` syntax for constructors, however, `this` could be accessed before calling into the superclass.

```javascript
function Foo () {
  Object.freeze(this)
}
function Bar (input) {
  this.input = input
  Foo.call(this) // freezes, but property already added
}
Object.setPrototypeOf(Bar.prototype, Foo.prototype);

new Bar()
```

Taking this further, we can use superclass initialization behavior to do some very unconventional things, such as adding private properties to any arbitrary, ordinary object.

```javascript
class SetThis {
  constructor (thisValue) {
    return thisValue
  }
}

class AddPrivateFoo extends SetThis {
  #foo
  constructor (obj, initValue) {
    super(obj)
    this.#foo = initValue
  }
  getFoo () {
    return this.#foo
  }
}

const { getFoo } = AddPrivateFoo.prototype
const myObj = {}
getFoo.call(myObj) // Error
new AddPrivateFoo(myObj, 'bar')
getFoo.call(myObj) // 'bar'
```

This example uses two classes to add a private property to an arbitrary JavaScript object.  The object, `myObj`, is passed into the `AddPrivateFoo` constructor which then passes it to the `SetThis` superclass through `super`.  `SetThis` simply returns the object it was given overriding it's own, automatically created version of `this`.  Then, because superclasses in the `class` syntax determine `this`, `this` in `AddPrivateFoo` becomes `myObj` which allowed the private property `#foo` to be initialized for it.  After the constructor resolves, the `getFoo` method correctly runs identifying the `#foo` property in `myObj`.

## Additional Differences

Here are some additional, smaller differences you might also see with `class` functions:

- `class` `toString` returns the `class` syntax
- `class` functions are always in strict mode (e.g. accessing `arguments` from a class always throws an error)
- `class` `prototype` properties added by the class are not writable
- Unlike `function` declarations, `class` declarations are not hoisted
- A `class` name binding is available everywhere within a class for named classes, for both expressions and declarations

### Internal Slots Used with `class`

A list of internal slot values which are unique to `class` definitions.

| Slot | Where | Value | Description |
| ---: | ---  | --- | --- |
| `[[FunctionKind]]` | class constructor functions | "classConstructor" | Differentiates between different kinds of functions where only `class`-defined constructors get "classConstructor" |
| `[[ConstructorKind]]` | class constructor functions | "derived" | Will be "derived" if extending another class (otherwise is "base" like normal functions) |
| `[[HomeObject]]` | class methods | _class prototype_ | Used to determine how `super` calls are made within methods defined within `class` bodies |
