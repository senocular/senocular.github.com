# Types of Scopes in JavaScript

Scopes represent areas in code within which variables are available.  Locally declared variables are kept within scopes and any access of those variables must be made within that or another scope nested within it.  JavaScript has a number of different kinds of scopes. They include:

- global
- script
- module
- closure
- block
- with
- catch

## Global Scope

The highest level scope is the global scope. This is inherently accessible everywhere within JavaScript.  The global scope is also accessible through an object, often represented as `global` or `window` (depending on your environment), or through a more universally available, but newer `globalThis`. JavaScript built-ins are defined in the global scope.

```javascript
Math // Math object
globalThis.Math // Math object
```

User-defined `var` and `function` declarations made in the top level of a script automatically become properties of the global object.  In sloppy mode (non-strict) undeclared variable assignments also get added directly to the global scope.  `var` and `function` declarations, however, create non-configurable properties within the global object whereas undeclared variables are configurable, just as though assigned directly to the global object directly.

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
```

## Script Scope

The script scope represents a part of the global scope that does not contribute to the global object.  While top level `var` and `function` declarations get added to the global scope and the global object, declarations using `let`, `const`, and `class` get instead added to the script scope.  Being a part of the global scope, the script scope is available everywhere, much like the global scope as defined by the global object (note: as of this writing Safari does not expose the script scope to modules).

```javascript
let foo = 1
foo // 1
globalThis.foo // undefined
```

## Module Scope

JavaScript modules have their own, independent scopes, a level under the global scope. The module scope keeps declarations within modules from having direct collisions with global variables.  Any declarations made within the top level of a module become local to that module's scope.

```javascript
// in module
var foo = 1
foo // 1
globalThis.foo // undefined
```

Modules are always run in strict mode, so variable assignments without declarations - which would normally result in a global definition - are considered an error.

```javascript
// in module
bar = 2 // Error
```

## Closure Scope

Closure scopes are non-global scopes within which all declarations are able to be scoped. Function scopes are the most common closure scopes.  Function scopes represent the top level scope of a function body.  When using `var` anywhere within the body of a function, that declaration will be scoped to that function's closure scope.  Function scopes are created for each of a function's invocations and often destroyed immediately after unless held onto by some other persisting function scope.

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
eval('var baz = 3') // run in a closure
baz // Error
```

## Block Scope

Block scopes are scopes available to block-level declarations including `let`, `const`, and `class` when declared within a non-function code block.  `var` (and sloppy mode `function`) declarations are not blocked scoped and are instead scoped to the next highest closure scope, or global.

```javascript
{
  let foo = 1
  var bar = 2
}
foo // Error
bar // 2
```

Blocks are defined by uses of curly braces (`{}`) which can be added arbitrarily to create blocks around code or be parts of other statements like `if`, `while` and `for`.  Braces for object literals do not represent block scopes.

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

With scopes, which are only available in sloppy mode, are created using `with` statements.  `with` blocks create bindings to an object that allow unqualified variables to implicitly target the specified object assuming the object contains a property of the same name and there is no other locally scoped variables that would shadow it.

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

Note that `var` declarations would not be scoped to the `with` block and would not cause variale shadowing to occur for the `with` object.

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

`try..catch` statements are made up of 2 or more scopes, a block scope for the `try`, and an additional scope or scopes for any `catch` and/or `finally` if present.  `catch` blocks that capture exception variables are given their own block-like scope, identified as a capture scope, which automatically binds the exception variable to that scope.

```javascript
try {
  throw 1
} catch (error) {
  error // 1
}
```

Exception variable binding is optional. When not present, the catch block uses a block scope.

```javascript
try {
  throw 1
} catch {
  // block scope
}
```

## Additional Scope Behaviors

### Mutability of Scopes

TODO

- global and with have dynamic lookups
- script can change in browsers with new script loads
- sloppy mode scopes can change with eval
- strict mode prevents change in other scopes

### Shadowing

TODO

### Identifiers in Scopes

TODO

- var
- function
- let
- const
- class
- function parameters
- function names in named function expressions
- import
- catch error name
- property assignment (undeclared to global in sloppy)

## Labels

Labels are a special kind of identifier that live in their own namespace separate from other scoped variable identifiers.  They are only recognized within label, break, and continue statements.  Like variables, they too respect normal scoping rules which require labels to be in scope in order to be accessed.

TODO: example
