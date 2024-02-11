# Quick Reference for Changes in Strict Mode

The following is a quick reference containing a list of changes made in JavaScript's strict mode. For more information on how and when strict mode is enabled, refer to [MDN's page on strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode). That page also includes much (but not all) that's listed below in greater detail.

Reserved words

```js
let implements
let interface
let let
let package
let private
let protected
let public
let static
let yield

// sloppy: Variables created
// strict: Error
```

Assign undeclared

```js
doesNotExist = 0

// sloppy: Creates global property
// strict: Error
```

Assign built-in globals

```js
undefined = 0
Infinity = 0
NaN = 0

// sloppy: Silently fails assignment
// strict: Error
```

Assign getter

```js
const hasGetter = {
  get getter() {}
}
hasGetter.getter = 0

// sloppy: Silently fails assignment
// strict: Error
```

Assign non-writable

```js
const hasReadOnly = {}
Object.defineProperty(hasReadOnly, "readOnly", { value: 1, writable: false })
hasReadOnly.readOnly = 0

// sloppy: Silently fails assignment
// strict: Error
```

Assign to non-extensible

```js
const nonExtensible = Object.preventExtensions({})
nonExtensible.any = 0

// sloppy: Silently fails assignment
// strict: Error
```

Assign primitive properties

```js
"string".prop = 0
true.prop = 0
0.0.prop = 0

// sloppy: Silently fails assignment
// strict: Error
```

Delete non-configurable

```js
const hasNonConfig = {}
Object.defineProperty(hasNonConfig, "nonConfig", { value: 1, configurable: false })
delete hasNonConfig.nonConfig

// sloppy: Does not delete, evaluates to false
// strict: Error
```

Delete unqualified identifier

```js
delete identifier

// sloppy: Deletes and evaluates to true if identifier is a deletable global,
//    otherwise does not delete and evaluates to false
// strict: Error
```

Delete from proxy with trap returning falsy

```js
const hasDeleteTrap = new Proxy({}, {
  deleteProperty() {
    return false
  }
})
delete hasDeleteTrap.any

// sloppy: No error
// strict: Error
```

`with` blocks

```js
with({}) {}

// sloppy: No error
// strict: Error
```

Initializers in `for-in` variable declarations

```js
for (var x = 0 in {}) {}

// sloppy: No error, identifier will be assigned to initializer value if no iterations
// strict: Error
```

0-prefixed numeric literals

```js
01
08

// sloppy: Evaluates to octal value if digit after 0 < 8, decimal if > 7 
// strict: Error
```

Octal escapes in string literals

```js
"\7"

// sloppy: Creates string '\x07'
// strict: Error
``` 

No in-scope declarations with `eval`

```js
eval("var fromEval = 0")

// sloppy: Declaration in eval added to current scope
// strict: Declaration does not get added to current scope
```

`eval` rebinding

```js
eval = 0
let eval
function eval() {}
function fn(eval) {}

// sloppy: Rebinding succeeds
// strict: Error
```

Assign function expression name

```js
const fn = function name() {
  name = 0
}

// sloppy: No error
// strict: Error
```

Labeled function declarations

```js
label: function fn() {}

// sloppy: No error
// strict: Error
```

Block-scope function declarations

```js
function outer() {
  {
    function inner() {}
  }
  inner()
}

// sloppy: Inner function scoped to outer function and can be called outside of block
// strict: Inner function scoped to block and cannot be called outside of block
```

Duplicate parameter names

```js
function fn(a, a) {}

// sloppy: No error, last parameter of that name used in function body
// strict: Error
```

Function `caller`, `arguments` properties

```js
function fn() {
  fn.caller
  fn.arguments
}

// sloppy: No error
// strict: Error
```

Arguments `callee` property

```js
function fn() {
  arguments.callee
}

// sloppy: No error
// strict: Error
```

Parameters mapped to `arguments`

```js
function assignArg(param) {
  arguments[0] = 1;
  param = 2;
}

// sloppy: Assignment to arguments changes parameter value, assigning parameter changes arguments
// strict: Assignments do not change other values
```

`arguments` rebinding

```js
arguments = 0
let arguments
function arguments() {}
function fn(arguments) {}

// sloppy: Rebinding succeeds
// strict: Error
```

`this` in function calls

```js
function fn() {
  return this
}

// sloppy: Function sees `this` as global object
// strict: Function sees `this` as undefined
```

Nullish primitive `this` in function calls

```js
function fn() {
  return this
}
fn.call(null)
fn.call(undefined)

// sloppy: Function sees `this` as global object
// strict: Function sees `this` as original primitive
```

Non-nullish primitive `this` in function calls

```js
function fn() {
  return this
}
fn.call("string")
fn.call(true)
fn.call(0)

// sloppy: Function sees `this` as `Object(this)`
// strict: Function sees `this` as original primitive
```

## Changes in modules

Modules are always in strict mode, but there are some additional changes that are specific to modules that do not apply to strict mode in other contexts.

Reserved words

```js
let await

// scripts: Variable created
// modules: Error
```

Duplicate function declarations

```js
function fn() {}
function fn() {}

// scripts: Last declaration assigned to identifier
// modules: Error
```

## Changes with parameters

Features used within parameter lists can also impact how JavaScript behaves with some strict mode-like behaviors observable in sloppy mode depending on how a parameter list is defined.  These changes are seen when parameter lists contains any advanced features such as default parameters, rest parameters, or destructured parameters.

Duplicate parameter names

```js
function simple(a, a) {}
function nonSimple(a, a = 0) {}

// simple parameter list: No error, last parameter of that name used in function body
// non-simple parameter list: Error
```

"use strict" directive

```js
function simple(a) {
  "use strict"
}
function nonSimple(a = 0) {
  "use strict"
}

// simple parameter list: No error
// non-simple parameter list: Error
```


Parameters mapped to `arguments`

```js
function simple(param) {
  arguments[0] = 1;
  param = 2;
}
function nonSimple(param = 0) {
  arguments[0] = 1;
  param = 2;
}

// simple parameter list: Assignment to arguments changes parameter value, assigning parameter changes arguments
// non-simple parameter list: Assignments do not change other values
```
