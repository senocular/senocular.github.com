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
| `Math.round(value)` (or other `Math` operation) | Number | Error |
| `Array` index in methods (e.g. `array.slice(value)`) | Yes | Error |

## Identifiers

Where `identifier` is the identifier being created and `/* scope */` represents the scope where that identifier is available

| Kind | Example |
| --- | --- |
| Catch error binding | `try { } catch (identifier) { /* scope */ }` |
| Class | `/* scope */ class identifier {}` |
| Named class name | `(class identifier { /* scope */ })` |
| Const | `/* scope */ const identifier = value;` |
| Decorator (stage 2) | `/* scope */ decorator @identifier () {}` |
| Decorator parameter | `decorator @name (identifier /* scope */ ) { /* scope */ }` |
| Function | `/* scope */ function identifier () {}` |
| Function parameter | `(function (identifier /* scope */ ) { /* scope */ })` |
| Named function expression name | `(function identifier ( /* scope */ ) { /* scope */ })` |
| Import | `/* scope */ import identifier from 'path'` |
| Label | `identifier: { /* scope */ }` |
| Let | `/* scope */ let identifier;` |
| Var | `/* scope */ var identifier;` |

_Note: Scopes within the parameter list refers to default parameter expressions._

## Loops

### Statements

| Statement | Loops Over |
| --- | --- |
| do...while | _User-defined condition_ |
| for | _User-defined condition_ |
| for...in | Objects |
| for...of | Iterables |
| for await...of | Async Iterables |
| while | _User-defined condition_ |

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

### Metadata Collections

Metadata collections can be created for objects and iterated over.

| For | Operation | Returns |
| --- | --- | --- |
| Array | `array.entries()` | Iterable |
| Array | `array.keys()` | Iterable |
| Array | `array.values()` | Iterable |
| _non-null_ | `Object.entries(value)` | Array |
| _non-null_ | `Object.keys(value)` | Array |
| _non-null_ | `Object.values(value)` | Array |
| _non-null_ | `Object.getOwnPropertyDescriptors(value)` | Object |
| _non-null_ | `Object.getOwnPropertyNames(value)` | Array |
| _non-null_ | `Object.getOwnPropertySymbols(value)` | Array |
| Object | `Reflect.ownKeys(object)` | Array |

### Iteration Order

A specification-defined order known as [[[OwnPropertyKeys]]](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-ordinary-object-internal-methods-and-internal-slots-ownpropertykeys) is set for some operations. Other operations (like `for...in`) do not have to follow this order and are implementation-dependent.  `[[OwnPropertyKeys]]` ordering uses:

1. Integer keys between 0 and 2^53-1 (inclusive) in ascending order
2. Other non-symbol keys in creation order
3. Symbol keys in creation order

| Operation | Ordering |
| --- | --- |
| `for..in` | Not guaranteed |
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

## Creating Functions

Creating functions named `name` (or anonymous).

| Kind | Example | Name | Constructable |
| --- | --- | --- | --- |
| Function Declaration | `function name () {}` | Explicit | Yes |
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
| Object Method (Shorthand) | `({ name () {} })` | Explicit | No |
| Async Object Method (Shorthand) | `({ async name () {} })` | Explicit | No |
| Object Method Generator (Shorthand) | `({ * name () {} })` | Explicit | No |
| Async Object Method Generator (Shorthand) | `({ async * name() {} })` | Explicit | No |
| Function Constructor | `new Function()`, `Function()` | Anonymous | Yes |
| AsyncFunction Constructor | `new AsyncFunction()`, `AsyncFunction()` | Anonymous | No |
| GeneratorFunction Constructor | `new GeneratorFunction()`, `GeneratorFunction()` | Anonymous | No |
| AsyncGeneratorFunction Constructor | `new AsyncGeneratorFunction()`, `AsyncGeneratorFunction()` | Anonymous | No |

_Note: Any expression context will work for expression variations, not just the grouping (`()`) used in the examples shown._

_Note: The `AsyncFunction`, `GeneratorFunction` and `AsyncGeneratorFunction` constructors are not globally accessible but can be obtained from existing instances/declarations._

### Function Syntax

Square brackets (`[]`) represent optional keywords or names whereas angle brackets (`<>`) represents a required item.

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
| Template Literal Tag | ``` name`` ``` |
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

Where `value` is an ordinary object.

| Operation | First | Second | Third |
| ---: | --- | --- | --- |
| `'' == value` | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `'' == new Date` | `Symbol.toPrimitive` | `toString` | `valueOf` |
| `'' + value` | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `'' + new Date` | `Symbol.toPrimitive` | `toString` | `valueOf` |
| `1 + value` (or other arithmetic operatation) | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `1 + new Date` (or other arithmetic operatation) | `Symbol.toPrimitive` | `toString` | `valueOf` |
| `1 ^ value` (or other bitwise operatation) | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `+value` (or other unary operatation) | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `Math.round(value)` (or other `Math` operation) | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `Number(value)` | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `BigInt(value)` | `Symbol.toPrimitive` | `valueOf` | `toString` |
| `String(value)` | `Symbol.toPrimitive` | `toString` | `valueOf` |
| `Symbol(value)` | `Symbol.toPrimitive` | `toString` | `valueOf` |
| `Object[value]` | `Symbol.toPrimitive` | `toString` | `valueOf` |


## ASI Considerations

There can be abiguity between operations when starting a line with the following characters where ASI (Automatic Semicolon Insertion) will not insert a semicolon to terminate the previous line's expression.

| Line Starts With | Semicolon Before | No Semicolon Before |
| --- | --- | --- |
| `[` | Array literal | Array access |
| `(` | Grouping | Function call |
| `/` | RegExp literal | Division |
| `` ` `` | Template literal | Tagged template literal |
| `+` | Unary `+` | Addition |
| `-` | Unary `-` | Subtraction |
