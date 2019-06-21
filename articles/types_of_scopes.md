# Types of Scopes in JavaScript

Scopes represent areas in code within which variables are available.  Locally declared variables are kept within scopes and any access of those variables must be made within that or another scope nested within it.  JavaScript has a number of different kinds of scopes. They include:

- global
- script
- module
- function
- block
- with

## Global Scope

The highest level scope is the global scope. This is inherently accessible everywhere within JavaScript, though there may be more than one global scope available at a time (e.g. a different browser window will have its own global).  The global scope is also accessible through an object, often `global` or `window` (depending on your environment), or through a more universally available, but newer `globalThis`.

```javascript
// built-ins are defined in the global scope
Math // Math object
globalThis.Math // Math object
```

`var` and `function` declarations made in the top level of a non-module script automatically become properties of the global object.  In sloppy mode (non-strict) undeclared variable assignments also get added directly to the global scope.  Declarations, however, create unconfigurable properties within the global object whereas undeclared variables are configurable, just as though assigned directly to the global object directly.

```javascript
var foo = 1
globalThis.foo // 1
Object.getOwnPropertyDescriptor(globalThis, 'foo').configurable // false

function bar () { return 2 }
globalThis.bar // function bar
Object.getOwnPropertyDescriptor(globalThis, 'bar').configurable // false

// sloppy mode:
baz = 3
globalThis.baz // 3
Object.getOwnPropertyDescriptor(globalThis, 'baz').configurable // true
```

## Script Scope

The script scope represents a global-like scope that is created directly under the global scope but does not contribute to the global object.  While top level `var` and `function` declarations (in non-module scripts) get added to the global scope, declarations for `let`, `const`, and `class` get instead added to the script scope.  Though variables in the script scope are not added to the global object, this scope is available everywhere, much like the global scope (at least on Chromium & Firefox; Safari hides them from module scopes).

```javascript
let foo = 1
globalThis.foo // undefined
foo === 1 // true
```

## Module Scope

JavaScript modules have their own scope, a level under the global scope. This keeps module declarations from having collisions with global variables.  Any declarations made within the top level of a module become local to that module's scope.

```javascript
// in module
var foo = 1
globalThis.foo // undefined
```

Modules are always in strict mode, so variable assignments without declarations are considered an error and would not be added to the global scope.

```javascript
// in module
baz = 3 // Error
```

## Function Scope

TODO

## Block Scope

TODO

## With Scope

TODO

## Additional Scope Behaviors

### Mutability in Scopes

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
