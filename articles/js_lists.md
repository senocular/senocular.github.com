# JavaScript Lists

A random collection of different lists related to the JavaScript language.

## Primitives

| Primitive | Literals |
| --- | --- |
| bigint | `1n`, `0xFn`, `0o7n`, `0b1n` |
| boolean | `true`, `false` |
| null | `null` |
| number | `1`, `1.2`, `0xF`, `0o7`, `0b1`, `1e2`, `1e-2` |
| string | `'string'`, `"string"`, `` `string` `` |
| symbol | _none_ |
| undefined | _none_ (though accessible via global `undefined`) |

Be on the look out for the upcoming [BigDecimal](https://github.com/tc39/proposal-decimal).

## Object Literals

| Object | Literals |
| --- | --- |
| Object | `{ key0: value0, key1: value1, keyN: valueN }` |
| Array | `[ value0, value1, valueN ]` |
| RegExp | `/expression/flags` |

## Primitive Objects

| Object Type | Constructor | Conversion |
| --- | --- | --- |
| BigInt | No | Yes |
| Boolean | Yes | Yes |
| Number | Yes | Yes |
| String | Yes | Yes |
| Symbol | No | No |

## BigInt vs. Number

Where `value` in the examples represents a BigInt or Number value.

| | BigInt | Number |
| ---: | --- | --- |
| Constructor | No | Yes |
| Exponential Notation | No | Yes |
| Supports Decimal Values | No | Yes |
| Supported in JSON | No | Yes |
| `typeof value` | 'bigint' | 'number' |
| `Object.is(value, -value)` where `value` is 0 | true | false |
| `1 + value` (or other arithmetic operatation) | Error | Number |
| `1n + value` (or other arithmetic operatation) | BigInt | Error |
| `1 ^ value` (or other bitwise operatation) | Error | Number |
| `1n ^ value` (or other bitwise operatation) | BigInt | Error |
| `+value` | Error | Number |
| `Math.round(value)` (or other `Math` operation) | Error | Number |
| `Array` index in methods (e.g. `array.slice(value)`) | Error | Yes |

## Identifiers

Where `name` is the identifier being created and `/* scope */` represents the scope where that identifier is available

| Kind | Example |
| --- | --- |
| Catch error binding | `try { } catch (name) { /* scope */ }` |
| Class | `/* scope */ class name {}` |
| Named class name | `(class name { /* scope */ })` |
| Const | `/* scope */ const name = value;` |
| Function | `/* scope */ function name () {}` |
| Function parameter | `(function (name /* scope */ ) { /* scope */ })` |
| Named function expression name | `(function name ( /* scope */ ) { /* scope */ })` |
| Import | `/* scope */ import name from 'path'` |
| Label | `name: { /* scope */ }` |
| Let | `/* scope */ let name;` |
| Var | `/* scope */ var name;` |

_Note: Scopes within the parameter list refers to default parameter expressions._

## Assign vs. Define

Assign sets a property through getter/setters (if they exist) while define will not.

| Operation | Example | Method |
| --- | --- | --- |
| Assignment Operator | `object.prop = value` | Assign |
| Array Methods | `object.push(value)`<br>`object.unshift(value)`<br> _etc._ | Assign |
| Object.assign | `Object.assign(object, { prop: value })` | Assign |
| Reflect.set | `Reflect.set(object, 'prop', value)` | Assign |
| Array Literal | `[ value ]` | Define |
| Array Spread | `[ ...[ value ] ]` | Define |
| Class Declaration Fields | `class { prop = value }` | Define |
| Class Declaration Methods | `class { prop() {} }` | Define |
| JSON.parse | `JSON.parse('{"prop":value}')` | Define |
| Object Literal | `{ prop: value }` | Define |
| Object Spread | `{ ...{ prop: value } }` | Define |
| Object.create | `Object.create(object, { prop: { value } })` | Define |
| Object.defineProperty | `Object.defineProperty(object, 'prop', { value })` | Define |
| Object.fromEntries | `Object.fromEntries([['prop', value]])` | Define |

## Default Property Descriptors

| Operation | Example | Default Descriptor |
| --- | --- | --- |
| Assignment | `object.prop = value` | `configurable: true`<br>`enumerable: true`<br>`writable: true` |
| Global var Declaration | `var prop = value` | `configurable: false`<br>`enumerable: true`<br>`writable: true` |
| Class Field | `class { prop = value }` | `configurable: true`<br>`enumerable: true`<br>`writable: true` |
| Class Method | `class { prop () {} }` | `configurable: true`<br>`enumerable: false`<br>`writable: true` |
| Define Property | `Object.defineProperty(object, 'prop', { value })` | `configurable: false`<br>`enumerable: false`<br>`writable: false` |
| Imports (prop in Module) | `import * as Module from './module.js'` | `configurable: false`<br>`enumerable: true`<br>`writable: true` |

Every [assign operation](#assign-vs-define) as well as many of the other define operations (those that don't explicitly say "define") will use the same Assignment descriptor configuration.

## Loops

### Statements

| Statement | Loops Over |
| --- | --- |
| `do...while` | _User-defined condition_ |
| `for` | _User-defined condition_ |
| `for...in` | Objects |
| `for...of` | Iterables |
| `for await...of` | Async Iterables |
| `while` | _User-defined condition_ |

### Collection Methods

| Method | Return Value | Early Exit | In Array | In Map | In Set |
| --- | --- | --- | --- | --- | --- |
| `every` | Boolean | Yes | Yes | No | No |
| `some` | Boolean | Yes | Yes | No | No |
| `filter` | _any_ | No | Yes | No | No |
| `find` | _any_ | Yes | Yes | No | No |
| `findIndex` | Number | Yes | Yes | No | No |
| `flatMap` | Array | No | Yes | No | No |
| `forEach` | _none_ | No | Yes | Yes | Yes |
| `map` | Array | No | Yes | No | No |
| `reduce` | _any_ | No | Yes | No | No |
| `reduceRight` | _any_ | No | Yes | No | No |

### Metadata Collections

Metadata collections can be created for objects and iterated over.

| For | Operation | Returns |
| --- | --- | --- |
| Array/Map/Set | `value.entries()` | Iterable |
| Array/Map/Set | `value.keys()` | Iterable |
| Array/Map/Set | `value.values()` | Iterable |
| _non-null_ | `Object.entries(value)` | Array |
| _non-null_ | `Object.keys(value)` | Array |
| _non-null_ | `Object.values(value)` | Array |
| _non-null_ | `Object.getOwnPropertyDescriptors(value)` | Object |
| _non-null_ | `Object.getOwnPropertyNames(value)` | Array |
| _non-null_ | `Object.getOwnPropertySymbols(value)` | Array |
| Object | `Reflect.ownKeys(object)` | Array |

### Object Iteration Values

When iterating over an object, what values are used for that iteration.

| Operation | String Keys | Symbol Keys | Own | Inherited | Non-enumerable |
| --- | --- | --- | --- | --- | --- |
| `for...in` | Yes | No | Yes | Yes | No |
| `JSON.stringify` |  Yes | No | Yes | No | No |
| `Object.entries` | Yes | No | Yes | No | No |
| `Object.keys` | Yes | No | Yes | No | No |
| `Object.values` | Yes | No | Yes | No | No |
| `Object.assign` |  Yes | Yes | Yes | No | No |
| `Object.defineProperties` |  Yes | Yes | Yes | No | No |
| `Object.getOwnPropertyDescriptors` | Yes | Yes | Yes | No | Yes |
| `Object.getOwnPropertyNames` | Yes | No | Yes | No | Yes |
| `Object.getOwnPropertySymbols` | No | Yes | Yes | No | Yes |
| `Reflect.ownKeys` | Yes | Yes | Yes | No | Yes |
| Object Spread | Yes | Yes | Yes | No | No |

## Creating Functions

Creating functions named `name` (or anonymous).

| Kind | Example | Name | Constructable |
| --- | --- | --- | --- |
| Function Declaration | `function name () {}` | Explicit | Yes |
| Default Function Declaration | `export default function () {}` | Anonymous | Yes |
| Async Function Declaration | `async function name () {}` | Explicit | No |
| Generator Function Declaration | `function * name () {}` | Explicit | No |
| Async Generator Function Declaration | `async function * name () {}` | Explicit | No |
| Function Expression | `(function () {})` | Anonymous | Yes |
| Async Function Expression | `(async function () {})` | Anonymous | No |
| Generator Function Expression | `(function * () {})` | Anonymous | No |
| Async Generator Function Expression | `(async function * () {})` | Anonymous | No |
| Named Function Expression | `(function name () {})` | Explicit | Yes |
| Named Async Function Expression | `(async function name () {})` | Explicit | No |
| Named Generator Function Expression | `(function * name () {})` | Explicit | No |
| Named Async Generator Function Expression | `(async function * name () {})` | Explicit | No |
| Arrow Function | `() => {}` | Anonymous | No |
| Async Arrow Function | `async () => {}` | Anonymous | No |
| Class Declaration | `class name { constructor () {} }` | Explicit | Yes |
| Class Expression | `(class { constructor () {} })` | Anonymous | Yes |
| Named Class Expression | `(class name { constructor () {} })` | Explicit | Yes |
| Class Method | `class { name () {} }` | Explicit | No |
| Async Class Method | `class { async name () {} }` | Explicit | No |
| Class Method Generator | `class { * name () {} }` | Explicit | No |
| Async Class Method Generator | `class { async * name() {} }` | Explicit | No |
| Class Getter | `class { get name() {} }` | Explicit | No |
| Class Setter | `class { set name(value) {} }` | Explicit | No |
| Object Method (Shorthand) | `({ name () {} })` | Explicit | No |
| Async Object Method (Shorthand) | `({ async name () {} })` | Explicit | No |
| Object Method Generator (Shorthand) | `({ * name () {} })` | Explicit | No |
| Async Object Method Generator (Shorthand) | `({ async * name() {} })` | Explicit | No |
| Object Getter | `({ get name() {} })` | Explicit | No |
| Object Setter | `({ set name(value) {} })` | Explicit | No |
| Function Constructor | `new Function()`, `Function()` | Anonymous | Yes |
| AsyncFunction Constructor | `new AsyncFunction()`, `AsyncFunction()` | Anonymous | No |
| GeneratorFunction Constructor | `new GeneratorFunction()`, `GeneratorFunction()` | Anonymous | No |
| AsyncGeneratorFunction Constructor | `new AsyncGeneratorFunction()`, `AsyncGeneratorFunction()` | Anonymous | No |

_Note: Any expression context will work for expression variations, not just the grouping (`()`) used in the examples shown._

_Note: The `AsyncFunction`, `GeneratorFunction` and `AsyncGeneratorFunction` constructors are not globally accessible but can be obtained from existing instances/declarations._

### Function Syntax

Square brackets (`[]`) represent optional keywords or names whereas angle brackets (`<>`) represents a required item.  Not all combinations are compatible.

| Kind | Syntax |
| --- | --- |
| Function Declaration or Expression | `[async] function [*] [name] () {}` |
| Arrow Function | `[async] () => {}` |
| Class Declaration or Expression |  `[@<decorator>] class [name] [extends <expression>] {}` |
| Class Method | `class { [@<decorator>] [static] [async] [get] [set] [*] [#]<name> () {} }` |
| Object Method (Shorthand) | `{ [async] [get] [set] [*] <name> () {} }` |

## Calling Functions

Calling a function identified as `name`.

| Kind | Call |
| --- | --- |
| Call | `name()` |
| Call | `name.call()` |
| Call | `name.apply()` |
| Template Literal Tag (Call) | ``` name`` ``` |
| Construct | `new name` |
| Construct | `new name()` |
| Call | `Refect.apply(name)` |
| Construct | `Reflect.construct(name)` |

### Additional Ways to Make Calls

This lists more obscure ways of function calling which may require special function definitions.

| Kind | Definition | Call |
| --- | --- | --- |
| Getter | `obj = { get name () {} }` | `obj.name` |
| Setter | `obj = { set name (value) {} }` | `obj.name = null` |
| Thenable | `obj = { then () {} }` | `await obj` |
| Iterator | `obj = { [Symbol.iterator] () {} }` | `[...obj]` |
| Iterator | `obj = { [Symbol.iterator] () {} }` | `for (let i of obj);` |
| Asynchronous Iterator | `obj = { [Symbol.asyncIterator] () {} }` | `for await (let i of obj);` |
| To Primitive | `obj = { toString () {} }` | `Object[obj]` |
| To Primitive | `obj = { valueOf () {} }` | `+obj` |
| To Primitive | `obj = { [Symbol.toPrimitive] () {} }` | `+obj` |
| Has Instance | `obj = { [Symbol.hasInstance] () {} }` | `null instanceof obj` |

## To Primitive Precedence

Different methods get prioritization when converting objects to primitives.  If present, a `Symbol.toPrimitive` will always be used. If not, conversion will rely on `toString()` and `valueOf()`, using the other as a fallback if the first attempted fails to produce a primitive.  Which is called first depends on the "hint" of the operation.  This can have one of 3 values: "string", "number", or "default".  "string" prefers `toString()` while "number" and "default" prefer `valueOf()`.  If `Symbol.toPrimitive` is available, the hint will be passed in as an argument.

Where `value` is an ordinary object.

| Operation | Primary | Hint | Secondary | Backup |
| ---: | --- | --- | --- | --- |
| `'' == value` | `Symbol.toPrimitive` | "default" | `valueOf` | `toString` |
| `'' + value` | `Symbol.toPrimitive` | "default" | `valueOf` | `toString` |
| `new Date(value)` | `Symbol.toPrimitive` | "default" | `valueOf` | `toString` |
| `1 > value` (or other relational operation) | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `1 * value` (or other arithmetic operation) | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `1 ^ value` (or other bitwise operation) | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `+value` (or other unary operation) | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `Math.round(value)` (or other `Math` operation) | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `Number(value)` | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `BigInt(value)` | `Symbol.toPrimitive` | "number" | `valueOf` | `toString` |
| `` `${value}` `` | `Symbol.toPrimitive` | "string" | `toString` | `valueOf` |
| `String(value)` | `Symbol.toPrimitive` | "string" | `toString` | `valueOf` |
| `Symbol(value)` | `Symbol.toPrimitive` | "string" | `toString` | `valueOf` |
| `Object[value]` | `Symbol.toPrimitive` | "string" | `toString` | `valueOf` |
| `value in object` | `Symbol.toPrimitive` | "string" | `toString` | `valueOf` |


## Use of Braces in Syntax

Use parentheses `()` for:

* [grouping](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Grouping)
* [function parameter lists](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions#function_parameters)
* [function calling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#calling_functions)
* [if conditions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/if...else)
* [while conditions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/while)
* [for setup](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for) ([for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in), [for...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of), [for await...of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of))
* [switch expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/switch)
* [with expression (deprecated)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with)
* [catch exception identifier](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)

Use square braces `[]` for:

* [property access](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_Accessors)
* [array literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#array_literals)
* [array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#array_destructuring)
* [computed properties](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)

Use curly braces `{}` for:

* [code blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/block)
* [try catch blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch)
* [function bodies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions#defining_functions)
* [class bodies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_Classes#declaring_a_class)
* [class static blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks)
* [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#object_literals)
* [object destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#object_destructuring)
* [string interpolation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#string_interpolation)
* [unicode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#escape_sequences)
* [named imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#named_import)
* [named exports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export#using_named_exports)

Each of these also have special meaning when used in [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions):

* `()`: [assertions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions), [groups](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Groups_and_Backreferences)
* `[]`: [character classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes),
* `{}`: [character classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes), [quantifiers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Quantifiers), [unicode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes)

## ASI Considerations

There can be ambiguity between operations when starting a line with the following characters where ASI (Automatic Semicolon Insertion) will not insert a semicolon to terminate the previous line's expression.

| Line Starts With | Semicolon Before | No Semicolon Before |
| --- | --- | --- |
| `[` | Array literal | Array access |
| `(` | Grouping | Function call |
| `` ` `` | Template literal | Tagged template literal |
| `+` | Unary `+` | Addition |
| `-` | Unary `-` | Subtraction |
| `*` | Generator method | Multiplication (of preceding field initializer) |
| `/` | RegExp literal | Division |

# Deprecated

These were older lists entries that no longer apply.

## Loops

### Iteration Order

A specification-defined order known as [[[OwnPropertyKeys]]](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys) is set for some operations. Other operations (like `for...in`) do not have to follow this order and are implementation-dependent.  `[[OwnPropertyKeys]]` ordering uses:

1. Integer keys between 0 and 2^53-1 (inclusive) in ascending order
2. Other non-symbol keys in creation order
3. Symbol keys in creation order

| Operation | Ordering |
| --- | --- |
| `for...in` | Not guaranteed |
| `JSON.stringify` | Not guaranteed |
| `JSON.parse` | Not guaranteed |
| `Object.entries` | Not guaranteed |
| `Object.keys` | Not guaranteed |
| `Object.values` | Not guaranteed |
| `Object.assign` | Well-defined |
| `Object.defineProperties` | Well-defined |
| `Object.getOwnPropertyDescriptors` | Well-defined |
| `Object.getOwnPropertyNames` | Well-defined |
| `Object.getOwnPropertySymbols` | Well-defined |
| `Reflect.ownKeys` | Well-defined |

Where well-defined refers to `[[OwnPropertyKeys]]` ordering.

:put_litter_in_its_place: &nbsp; **Deprecation:** As of ES2020's [for-in mechanics](https://github.com/tc39/proposal-for-in-order), iteration order is now well defined for the places where before it was not guaranteed.
