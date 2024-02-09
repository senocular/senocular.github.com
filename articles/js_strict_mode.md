# Changes in Strict Mode

A quick reference to the changes made in JavaScript's strict mode.

| WIP |
|---|

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

Labeled function declarations

```js
label: function fn() {}
// sloppy: No error
// strict: Error
```

Duplicate parameter names

```js
function fn(a, a) {}
// sloppy: No error, last parameter of that name used in function body
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

`with` blocks

```js
with({}) {}
// sloppy: No error
// strict: Error
```

No in-scope declarations with `eval`

```js
eval("var fromEval = 0")
// sloppy: Declaration in eval added to current scope
// strict: Declaration does not get added to current scope
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
