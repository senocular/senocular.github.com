# Types of Scopes in JavaScript

Scopes represent areas in code from which variables and other identifiers are available.  Locally declared variables are kept within scopes and any access of those variables must be made within that or another scope nested within it.  JavaScript has a number of different kinds of scopes. They include:

- global
- script
- module
- closure
- block
- with
- catch

## Global Scope

The highest level scope is the global scope. This is inherently accessible everywhere within a JavaScript application.  The global scope is also accessible through an object, often represented as `global` or `window`, depending on your environment, or through a more universally available, but newer `globalThis`. Standard JavaScript built-ins are defined in the global scope.

```javascript
Math // Math object
globalThis.Math // Math object
```

User-defined `var` and `function` declarations made in the top level of a script become global scope variables and automatically become properties of the global object.  In sloppy mode (non-strict) undeclared variable assignments also get added to the global object, whether in the global scope or not.  `var` and `function` declarations, however, create non-configurable properties within the global object whereas undeclared variables are configurable, just as they would be as though assigned directly to the global object directly.

```javascript
var foo = 1
foo // 1
globalThis.foo // 1
Object.getOwnPropertyDescriptor(globalThis, 'foo').configurable // false

function bar () { return 2 }
bar // function bar
globalThis.bar // function bar
Object.getOwnPropertyDescriptor(globalThis, 'bar').configurable // false

// sloppy mode
baz = 3
baz // 3
globalThis.baz // 3
Object.getOwnPropertyDescriptor(globalThis, 'baz').configurable // true

globalThis.qux = 4
qux // 4
globalThis.qux // 4
Object.getOwnPropertyDescriptor(globalThis, 'qux').configurable // true
```

_Note: Currently Chrome/Safari incorrectly allows you to delete or overwrite global `var`-declared variables if defined first as a property of the global object._

## Script Scope

The script scope represents a part of the global scope that does not contribute to the global object.  While top level `var` and `function` declarations get added to the global scope and the global object, declarations using `let`, `const`, and `class` get instead added to the script scope and are not added to the global object.  Being a part of the global scope, the script scope is available everywhere, much like the global scope as defined by the global object.

```javascript
let foo = 1
foo // 1
globalThis.foo // undefined
```

_Note: Currently Safari incorrectly does not expose the script scope to modules._

## Module Scope

JavaScript modules each have their own, independent scopes, a level under the global scope. The module scope keeps declarations within modules from having direct collisions with global variables.  Any declarations made within the top level of a module become local to that module and only that module.

```javascript
// in module
var foo = 1
foo // 1
globalThis.foo // undefined
```

Modules are always run in strict mode so variable assignments without declarations - which would normally result in a global definition - are considered an error.

```javascript
// in module
bar = 2 // Error
```

## Closure Scope

Closure scopes are non-global scopes within which all declarations are able to be scoped. `var` declarations, for example, will be scoped to the nearest closure scope, or global if there are no other closure scopes in the scope chain.  Function scopes are the most common closure scopes.  Function scopes represent the top level scope of a function body.  Function scopes are created for each of a function's invocations.

```javascript
function foo () {
  var bar = 2
  bar // 2
}
foo()
bar // Error
```

`eval` can also create a closure scope when used in strict mode.  Strict mode does not allow `eval` to add declarations to the current scope, so instead the evaluated code is added to a closure.

```javascript
// sloppy mode
eval('var baz = 3')
baz // 3
```

```javascript
// strict mode
eval('var baz = 3') // runs in a closure
baz // Error
```

## Block Scope

Block scopes are scopes available to block-level declarations including `let`, `const`, and `class` when declared within a non-function code block.  `var` and sloppy mode `function` declarations are not blocked scoped and are instead scoped to the next highest closure scope, or global.

```javascript
{
  let foo = 1
  var bar = 2
}
foo // Error
bar // 2
```

Blocks are defined by uses of curly braces (`{}`) which can be added arbitrarily to create blocks around code (seen above) or be parts of other statements like `if`, `while` and `for`.  Braces for object literals do not represent block scopes.

```javascript
obj = { // not a block scope
  foo: 1,
  bar: 2
}
```

`for` loop statements are exceptional in that declarations within the `for` initialization are scoped to the block even though not lexically located there.

```javascript
for (let baz = 3; baz < 4; baz++) {
  baz // 3
}
baz // Error
```

## With Scope

With scopes, which are only available in sloppy mode, are created using `with` statements.  `with` statement blocks create bindings to an object that allow unqualified variables to implicitly target the specified object given that the object contains a property of the same name and there is no other locally scoped variables that would shadow it.

```javascript
obj = { foo: 1, bar: 2 }
with (obj) {
  foo = 10
  let bar
  bar = 20
  baz = 30
}
obj.foo // 10
obj.bar // 2
obj.baz // undefined
baz // 30
```

Note that `var` declarations would not be scoped to the `with` block (instead the nearest closure scope or global) and would not result in variable shadowing.

```javascript
obj = { foo: 1, bar: 2 }
with (obj) {
  var bar
  bar = 20
}
obj.bar // 20
bar // undefined
```

## Catch Scope

`try..catch` statements are made up of 2 or more scopes, a block scope for the `try`, and an additional scope or scopes for any `catch` and/or `finally` blocks if present.  `catch` blocks that capture exception variables are given their own block-like scope identified as a capture scope.  Capture scopes automatically bind to the exception variable associated with that catch.  This variable is not available outside of the capture scope.

```javascript
try {
  throw 1
} catch (error) {
  error // 1
}
error // Error
```

Exception variable binding is optional. When not present, the catch block uses a normal block scope without any special bindings.

```javascript
try {
  throw 1
} catch {
  // block scope
}
```

## Mutability of Scopes

Often, identifiers within scopes can change over time.  This is especially true with the global and with scopes given that they are backed by objects.

```javascript
foo // Error
globalThis.foo = 1
foo // 1

obj = {}
with (obj) {
  bar // Error
  obj.bar = 2
  bar // 2
}
```

Even though the script scope is not backed by an object, it too can change as new scripts are loaded in and evaluated in the global scope, for example as the browser parses a page, evaluating code in each `<script>` element if finds along the way.

```html
<script>typeof foo // undefined</script>
<script>const foo = 1</script>
<script>typeof foo // number</script>
```

The use of `typeof` in the above example shows that the TDZ for the `const foo` does not extend beyond its own script.  However, once its defined, it becomes part of the script scope and therefore available everywhere, including the next script and even the first script if it had waited for it, for example in a `setTimeout` or some other asynchronous operation.

In sloppy mode, `var` and `function` declarations can be added to scopes over time through the use of `eval`.

```javascript
function foo () {
  bar // Error
  eval('var bar = 2')
  bar // 2
}
foo()
```

In strict mode, `eval` creates its own closure so it does not have an impact on the current scope.  This is always the case for modules since they always run in strict mode.

```javascript
function foo () {
  "use strict"
  bar // Error
  eval('var bar = 2')
  bar // Error
}
foo()
```

## Labels

Labels are a special kind of scoped identifier that live in their own namespace separate from other scoped variable identifiers.  They are only recognized within label, `break`, and `continue` statements.  Like variables, they too respect normal scoping rules which require labels to be in scope in order to be accessed.  Labels themselves are scoped to the block they label

```javascript
foo: {
  const foo = 1 // no conflict
  break foo
}
break foo // Error
```
