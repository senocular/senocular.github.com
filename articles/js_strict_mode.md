# Changes in Strict Mode

A quick reference to the changes made in JavaScript's strict mode.

| WIP |
|---|

Reserved words

```js
var implements
var interface
var let
var package
var private
var protected
var public
var static
var yield
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
// sloppy: Deletes and evaluates to true if identifer is a deletable global,
//    otherwise does not delete and evaluates to false
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

0-prefixed octal numeric literals

```js
01
// sloppy: Evaluates to octal value
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

Parameter references in `arguments`

```js
function assignArg(param) {
  arguments[0] = 0;
}
function assignParam(param) {
  param = 0;
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

`this` in functions

```
function fn() {
  return this
}
// sloppy: Function sees `this` as global object
// strict: Function sees `this` as undefined
```

`this` boxing primitives in methods

```js
function method() {
  return this
}
method.call("string")
method.call(true)
method.call(0)
// sloppy: Method sees `this` as Object
// strict: Method sees `this` as primitive
```
