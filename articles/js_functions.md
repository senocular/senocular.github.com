# WIP

# Kinds of Functions and Their Differences

There are many different ways to create a function in JavaScript.  TODO: more summary

## Function Variations

There are two primary kinds of function variations on top of normal functions. These include:

* generator functions
* async functions

Most, but not all, function types support both of these, either individually or both at the same time.

### Generator Functions

Generator functions are defined using an asterisk (`*`) as a prefix to the function name (syntax may vary).  They are special in that they always create and return generator objects when called.  They can also be suspended, pausing execution allowing other code to run before continuing from where they left off.  Generator functions will pause at `yield` statements and will resume when the `next()` method of the generator object that function call returned is called. The value returned from `next()` is a generator result object.

```javascript
function * generatorFunction () {
    yield 1
    return 2
}

const generatorObject = generatorFunction()
console.log(generatorObject.next()) // { value: 1, done: false }
console.log(generatorObject.next()) // { value: 2, done: true }
```

When a function is a generator, it cannot be used as a constructor in conjunction with `new`.

### Async Functions

Async functions are defined using an `async` prefix. They are special in that they always create and return a promise object when called.  Like generator functions, they too can be suspended and continue executing at a later time only async function resumption is determined by the fulfillment of promises that are being awaited using the `await` keyword rather than through `yield` and explicit calls from a generator object's API.

```javascript
async function asyncFunction () {
    await Promise.resolve()
    return 1
}

const promise = asyncFunction()
promise.then(value => console.log(value)) // 1
```

When a function is async, it cannot be used as a constructor in conjunction with `new`.

### Async Generator Functions

Async generator functions are both async and generators.  They are used to create streams of data and are often used with `for await...of`.  Async generators are generators first, meaning their return values are generator objects. When `next()` is called for these generator objects, the return value is a promise that resolves into a generator result object rather than being a generator result object itself.

```javascript
async function * asyncGeneratorFunction () {
    yield Promise.resolve(1)
    return 2
}

const asyncGeneratorObject = asyncGeneratorFunction()
asyncGeneratorObject
    .next()
    .then(result => console.log(result)) // { value: 1, done: false }
asyncGeneratorObject
    .next()
    .then(result => console.log(result)) // { value: 2, done: true }

for await (let value of asyncGeneratorFunction()) {
    console.log(value) // 1 (note: returns are not captured by for await...of)
}
```

When a function is an async generator, it cannot be used as a constructor in conjunction with `new`.

## Function Styles

There are many different ways to write functions.  Most also differ from the others in how they function or what they're capable of.  The biggest example of this is with arrow functions which treat `this` completely differently from other functions.  Other differences tend to be more subtle.

### Function declaration
Since: ES1

Function declarations are your standard function style using the `function` keyword in a standalone definition within the current scope.

```javascript
function name () {}
function * name () {}
async function name () {}
async function * name () {}
export default function () {}
```

| Feature | Supported |
| --- | --- |
| callable | yes |
| constructable | yes (non async/generator) |
| hoisted | yes |
| async | yes |
| generator | yes |
| anonymous | no (exception: default export) |

### Function from constructor
Since: ES1

```javascript
new Function();
new Function('body');
new Function('param', 'body');
new Function('param', 'paramN', 'body');
new Function('param,paramN', 'body');
```

| Feature | Supported |
| --- | --- |
| callable | yes |
| constructable | yes (non async/generator) |
| hoisted | no |
| async | yes |
| generator | yes |
| anonymous | always |

* callable
* constructable (non async/generator)
* (Since: ES2015) can be generator (GeneratorFunction)
* (Since: ES2017) can be async (AsyncFunction)
* (Since: ES2018) can be async generator (AsyncGeneratorFunction)
* anonymous
* name set to "anonymous"

### Function expression
Since: ES3

```javascript
(function name () {})
(function * name () {})
(async function name () {})
(async function * name () {})
(function () {})
```

| Feature | Supported |
| --- | --- |
| callable | yes |
| constructable | yes (non async/generator) |
| hoisted | no |
| async | yes |
| generator | yes |
| anonymous | yes |

* callable
* constructable (non async/generator)
* (Since: ES2015) can be generator
* (Since: ES2017) can be async
* (Since: ES2018) can be async generator
* naming optional
* explicit name is locally scoped
* (Since: ES2015) name can be assigned implicitly (or '' if anonymous)

### Getter/setter
Since: ES5

Getter and/or setter methods are used to create accessor properties in object literals and classes.  Unlike other functions these methods are invoked when a property is accessed or assigned rather than being called directly.  To gain access to the functions themselves you can use `Object.getOwnPropertyDescriptor()`.

```javascript
{
    get name () {},
    set name (value) {}
};
class {
    get name () {}
    set name (value) {}
}
```

| Feature | Supported |
| --- | --- |
| callable | yes* |
| constructable | no |
| hoisted | no |
| async | no |
| generator | no |
| anonymous | no |

* callable (through property access [get] or assignment [set])
* (Since: ES2015) can use super
* (Since: ES2015) no prototype

### Method
Since: ES2015

The method syntax is used in classes and acts as a shorthand for assigning function members in object literals.  These are mostly equivalent to assigning a property to a named function expression except method functions cannot be used as constructors.

```javascript
{
    name () {}
};
class {
    name () {}
};
```

| Feature | Supported |
| --- | --- |
| callable | yes |
| constructable | no |
| hoisted | no |
| async | yes |
| generator | yes |
| anonymous | no |

* callable
* can be generator
* (Since: ES2017) can be async
* (Since: ES2018) can be async generator
* can use super
* no prototype (unless a generator)

### Arrow Function
Since: ES2015

Arrow functions use a minimal syntax for function expressions but also differ from all other functions in that they treat `this`, `super`, `arguments` and `new.target` differently.  Unlike other functions, arrow functions inherit these from the parent scope rather than having their own.  Because of this arrow functions work well as callback functions (notably for minimal syntax and inheriting `this` from parent scope) but can be problematic when used as object methods, especially for object literals where `this` would represent the context of the parent scope rather than the object in which it was defined.

```javascript
() => {};
async () => {};
param => expression;
```

| Feature | Supported |
| --- | --- |
| callable | yes |
| constructable | no |
| hoisted | no |
| async | yes |
| generator | no |
| anonymous | yes |

* callable
* (Since: ES2017) can be async
* uses parent scope's this/super/arguments/new.target
* anonymous
* name can be assigned implicitly (or '')
* no prototype
* supports implicit returns

### Class Declaration
Since: ES2015

```javascript
class name {
    constructor () {}
}
```

| Feature | Supported |
| --- | --- |
| callable | no |
| constructable | yes |
| hoisted | no |
| async | no |
| generator | no |
| anonymous | no |

* constructable
* naming optional
* explicit name is locally scoped
* name can be assigned implicitly (or '' if anonymous)
* can use super (both super() and super.method())
* in global scope does not create a globalThis property

### Class Expression
Since: ES2015

```javascript
class {
    constructor () {}
}
```

| Feature | Supported |
| --- | --- |
| callable | no |
| constructable | yes |
| hoisted | no |
| async | no |
| generator | no |
| anonymous | yes |

* constructable
* naming optional
* explicit name is locally scoped
* name can be assigned implicitly (or '' if anonymous)
* can use super (both super() and super.method())

---

## Specifics

### Function declaration



---

### Table

* hoisted
* callable
* constructable (1)
* can be generator
* can be async
* can be async generator
* own this/super/arguments/new.target
* named [Yes | No | Optional]
* name binding locally scoped
* name can be assigned implicitly (2, 3)
* can use super
* prototype (4)
* implicit returns

1) async, generator, and async generator functions can't be constructors
2) constructor: anonymous name = "anonymous"
3) expression, arrow, class: anonymous name = ""
4) methods: only have a prototype when generators

## Possible Upcoming Features

* async class constructors
* generator arrow functions
