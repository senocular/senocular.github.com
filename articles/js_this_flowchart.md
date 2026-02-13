# A Flowchart for JavaScript's `this`

[![this in JavaScript](js_this_flowchart/this_in_js.svg)](js_this_flowchart/this_in_js.svg)

## About the flowchart

This flowchart describes the process of determining what the value of `this` from anywhere within your JavaScript code. For more information about `this`, see:

- [MDN reference: this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)

The flowchart can be roughly divided into 4 sections:

- Top-right: eval and top-level scopes
- Center-bottom-right: class body scope
- Top-left: function construction
- Center-bottom-left/bottom: function calling

Some sections may loop back and enter other sections as decision paths are taken.

When using the flowchart you start at the green "What is this?" symbol and work through answering questions at diamond symbol decision points until reaching a red end symbol which would indicate the value of `this`. Other non-decision symbols exist to help determine how to proceed or make assertions about the current state of the process.

### Variables

Variables are used to represent values used by the flowchart for decision points and deriving a final `this` value. Variables include:

- **scope**: The JavaScript scope for the current context of code, starting with the scope where `this` is located. There are many kinds of scopes in JavaScript but here scope is being limited to:
    - Top-level scopes: scopes at the top level of script and module files
    - Function scopes: scopes defined by functions
    - Root eval scopes: scopes defined be eval strings. Note that while non-strict direct eval calls are effectively evaluating code in the current scope, the root of the eval string is still considered a scope for the purposes of the flowchart.
    - Class body scopes: scopes defined by the block representing the contents of a class defined with `class` syntax. This does not include `constructor` or method scopes as they are considered function scopes.

        Other scopes not matching these descriptions would refer to the closest scope higher in the scope chain that do.

- **function**: A function object. This is usually the function defining the current surrounding scope in which `this` is being used though may change throughout decision points in the flowchart.
- **target**: A JavaScript value that is used in the context of a function call to determine the value of `this`
- **newTarget**: A function used in construction that represents the direct function being constructed. This roughly translates to the value seen in the `new.target` meta-property in JavaScript.

### Assertions

At some points in the flowchart, assertions are made about assumptions that can be made at that point within the flowchart logic. If these assertions appear inaccurate, either an incorrect path was taken (or a better path was available) or the flowchart does not support a particular feature or syntax that would have led you to that point.

For example, the initial path downward determining the current **scope** will end with an assertion that the only scope remaining would be a class scope. Either this will be true if you've reached that condition, or its possible a different scope should have been selected for your circumstance. If not, the flowchart may not support support that circumstance which may happen if new features have been added since it was last updated.

## Examples

The following examples show what the values of `this` would be in different situations and how they would be determined by following the logic outlined by the flowchart.

### Eval and top-level scopes

#### Direct eval

When calling eval directly in any context, it executes a string as code as though it were in that context. This behavior slightly changes in strict mode where the eval code is run in a separate scope, though this does not affect how it sees the value of `this`. The value of `this` is the same value as `this` immediately outside of the eval call.

```js
const outerThis = this;
console.info(eval("this") === outerThis); // true
```

Docs:

- [MDN reference: eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

#### Indirect eval

Anytime eval is called indirectly, whether through an alias or optional chaining, it does not evaluate code in the current scope. Instead it gets evaluated in the global scope.

```js
console.info(eval?.("this") === globalThis); // true
```

Docs:

- [MDN reference: eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
- [MDN reference: globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

#### Top-level global

In global scripts, `this` is the global object. While in other contexts `this` in strict mode changes from the global object to `undefined`, it is always the global object in the top-level global scope.

```js
console.info(this === globalThis); // true
```

Docs:

- [MDN reference: eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)
- [MDN reference: globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

#### Top-level CJS module

CJS modules are not native to JavaScript but they used to be the only module system available in NodeJS so felt worth including. CJS modules are unique in that within the top-level module scope the value of `this` refers to the `module.exports` object, an object provided by CJS modules indicating the externally available values coming from that module.

```js
console.info(this === module.exports); // true
```

Docs:

- [NodeJS api: modules](https://nodejs.org/api/modules.html)
- [NodeJS api: module](https://nodejs.org/api/module.html)

#### Top-level ES module

ECMAScript modules (ESM) are modules native to JavaScript. While they are considered top-level code, a module's scope is still a child scope of the global scope. ESM are always in strict mode and `this` in their own top-level scope `this` is `undefined`.

```js
console.info(this === undefined); // true
```

Docs:

- [MDN guide: modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### Class body scope

#### Computed class properties

Computed class properties are evaluated for a class before the class is defined. As a result, the only value for `this` available to expressions used in these properties is the `this` outside of the class block. This applies to all computed properties for fields and methods, both static and not.

```js
const outerThis = this;
class Example {
    [console.info(this === outerThis)]; // true
}
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: computed property names](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#computed_property_names)

#### Instance field initializer

With instance field initializers, though they appear to run directly within the class block, they are instead run in hidden methods called when instances are constructed. As a method, `this` will defined as the instance constructed.

```js
let initializerThis;
class Example {
    field = (initializerThis = this);
    constructor() {
        console.info(initializerThis === this); // true
    }
}
new Example();
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

#### Static field initializer

As with instance field initializers, static initializers are run as static methods of the class. Methods of the class have a `this` as the class itself.

```js
class Example {
    static field = console.info(this === Example); // true
}
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: static](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/static)
- [MDN reference: public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

#### Static block

Static blocks are run in the context of the class with a `this` of the class itself.

```js
class Example {
    static {
        console.info(this === Example); // true
    }
}
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks)

### Function construction

#### Function constructor

Functions called with `new` are treated as constructors and create new objects that get assigned to `this` inside the function. New objects from function constructors inherit from the `prototype` property of `new.target`. When the function is called with `new`, `new.target` will be that function.

```js
function Example() {
    // New object
    console.info(Object.getPrototypeOf(this) === Example.prototype); // true
    console.info(new.target === Example); // true
}
new Example();
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [MDN reference: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

#### Class constructor

Classes are specialized functions which are meant only for construction. Their implementation is defined by a method-like `constructor` definition within the class block. When classes are called with `new` they create new objects that get assigned to `this` inside the class constructor. New objects from class constructors inherit from the `prototype` property of `new.target`. When the class is called with `new`, `new.target` will be that class.

```js
class Example {
    constructor() {
        // New object
        console.info(Object.getPrototypeOf(this) === Example.prototype); // true
        console.info(new.target === Example); // true
    }
}
new Example();
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [MDN reference: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

#### Base class constructor

When one class extends another class, in the context of the base class, which is invoked by a call to `super()` in the derived class, the value of `this` will be based on the derived class given that the derived class that is the `new.target`.

```js
class Base {
    constructor() {
        // New object
        console.info(Object.getPrototypeOf(this) === Derived.prototype); // true
        console.info(new.target === Derived); // true
    }
}
class Derived extends Base {
    constructor() {
        super();
    }
}
new Derived();
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [MDN reference: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

#### Accessing this before super

If in a derived class you attempt to access this before `super()`, an error will be thrown because `this` will be uninitialized.

```js
class Example extends Object {
    constructor() {
        try {
            this;
            console.assert(false, "Unreachable code");
        } catch (error) {
            console.info(error instanceof ReferenceError); // true
        }
        super();
    }
}
new Example();
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)
- [MDN error: super not called](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Super_not_called)

#### Base constructor returning object

If a base class returns an object from its constructor, a derived class will see that object as its `this` value. This supersedes the implicit `this` transfer that would normally be provided to derived classes. This only applies if the returned value is an object. If a primitive value is returned this way, it is ignored and `this` is implicitly provided as normal.

```js
const returnedObject = {};
class Base {
    constructor() {
        return returnedObject;
    }
}
class Derived extends Base {
    constructor() {
        super();
        console.info(this === returnedObject); // true
    }
}
new Derived();
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)

#### Reflect construct without newTarget

`Reflect.construct()` allows you to construct a function without the `new` keyword. It allows you to specify a specific value for `new.target` in its `newTarget` argument, but if left undefined, it will default to the function being constructed.

```js
class Example {
    constructor() {
        // New object
        console.info(Object.getPrototypeOf(this) === Example.prototype); // true
        console.info(new.target === Example); // true
    }
}
Reflect.construct(Example, []);
```

- [MDN reference: Reflect.construct](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct)
- [MDN reference: getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [MDN reference: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

#### Reflect construct with newTarget

`Reflect.construct()` allows you to construct a function without the `new` keyword. It allows you to specify a specific value for `new.target` in its `newTarget` argument, and when set, it will use that value for the `new.target` during construction.

```js
class Target {}
class Example {
    constructor() {
        // New object
        console.info(Object.getPrototypeOf(this) === Target.prototype); // true
        console.info(new.target === Target); // true
    }
}
Reflect.construct(Example, [], Target);
```

- [MDN reference: Reflect.construct](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct)
- [MDN reference: getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [MDN reference: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

#### Bound constructor

When a function is constructed, if it was created with `bind()` construction will instead target the original, unbound function.

```js
class Example {
    constructor() {
        // New object
        console.info(Object.getPrototypeOf(this) === Example.prototype); // true
        console.info(new.target === Example); // true
    }
}
const Bound = Example.bind({});
new Bound();
```

- [MDN reference: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: getPrototypeOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf)
- [MDN reference: new.target](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new.target)

### Function calling

#### Normal function

Normal, non-arrow functions called as stand-alone functions will use see the global object for `this` in non-strict mode.

```js
function example() {
    console.info(this === globalThis); // true
}
example();
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: globalThis](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/globalThis)

#### Strict mode normal function

In strict mode, normal, non-arrow functions called as stand-alone functions will use see `undefined` for `this`.

```js
"use strict";
function example() {
    console.info(this === undefined); // true
}
example();
```

Docs:

- [MDN reference: strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

#### Object method

Object methods called from the object will have a `this` set to the object. The value of `this` is determined by the call, not where the method was defined.

```js
const object = {
    method() {
        console.info(this === object); // true
    },
};
object.method();
```

Docs:

- [MDN reference: object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
- [MDN reference: method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)

#### Object method as function

When object methods are called as normal, unqualified functions rather than from an object, the value of `this` will be determined the same way it is determined for normal functions.

```js
const object = {
    method() {
        console.info(this === globalThis); // true
    },
};
const detachedMethod = object.method;
detachedMethod();
```

Docs:

- [MDN reference: object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
- [MDN reference: method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)

#### Function as method

When a normal, non-method function is assigned to an object and called from that object, the value of `this` will be that object. The value of `this` is determined by the call, not where the function was defined.

```js
const object = {};
function example() {
    console.info(this === object); // true
}
object.attachedExample = example;
object.attachedExample();
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)

#### Bound function

Functions created from `bind()` have a `this` value equal to the `thisArg` argument passed in to `bind()`.

```js
const bindObject = {};
function example() {
    console.info(this === bindObject); // true
}
const bound = example.bind(bindObject);
bound();
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

#### Bound method

Object methods created from `bind()` have a `this` value equal to the `thisArg` argument passed in to `bind()`. The object the method was called from is ignored if that method was created from `bind()`.

```js
const bindObject = {};
const object = {
    method() {
        console.info(this === bindObject); // true
    },
};
object.boundMethod = object.method.bind(bindObject);
object.boundMethod();
```

Docs:

- [MDN reference: method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)
- [MDN reference: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

#### Multiple bound function

A function from a call to `bind()` cannot have it's `this` value change from another call to `bind()`. A `this` value will always use the first call to `bind()`.

```js
const firstBindObject = {};
const secondBindObject = {};
function example() {
    console.info(this === firstBindObject); // true
}
const firstBound = example.bind(firstBindObject);
const secondBound = firstBound.bind(secondBindObject);
secondBound();
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

#### Call method

The `call()` method of functions is used to call a function with a specific `this` value and a specified set of arguments.

```js
const callObject = {};
function example() {
    console.info(this === callObject); // true
}
example.call(callObject);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

#### Apply method

The `apply()` method of functions is used to call a function with a specific `this` value and a specified set of arguments in the form of an array-like object.

```js
const applyObject = {};
function example() {
    console.info(this === applyObject); // true
}
example.apply(applyObject);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

#### Reflect apply

The `Reflect.apply()` function is used to call a function with a specific `this` value and a specified set of arguments in the form of an array-like object.

```js
const applyObject = {};
function example() {
    console.info(this === applyObject); // true
}
Reflect.apply(example, applyObject, []);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: Reflect.apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)

#### Call method on bound function

Methods used to call a function (e.g. `call()`, `apply()`, `Reflect.apply()`) does not supersede the `this` value defined by a function created by `bind()`.

```js
const bindObject = {};
const callObject = {};
function example() {
    console.info(this === bindObject); // true
}
const bound = example.bind(bindObject);
bound.call(callObject);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
- [MDN reference: call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

#### Non-nullish primitive method

Method calls in non-strict mode for non-nullish primitive values will create a new object for `this` in the method that will be object version of the primitive value.

```js
function example() {
    // this = Object(1)
    console.info(typeof this === "object"); // true
    console.info(this.valueOf() === 1); // true
}
example.call(1);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)
- [MDN reference: typeof](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof)
- [MDN reference: valueOf](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/valueOf)

#### Nullish primitive method

Method calls in non-strict mode for nullish primitive values will have a `this` value of the global object.

```js
function example() {
    console.info(this === globalThis); // true
}
example.call(undefined);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

#### Strict primitive method

Method calls in strict mode for primitive values will use the primitive value for the value of `this`. This applies to both nullish and non-nullish values.

```js
"use strict";
function example() {
    console.info(this === 1); // true
}
example.call(1);
```

Docs:

- [MDN reference: strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

#### Method from super

Methods called from the `super` keyword are largely treated as if the method were called from `this`. Non-arrow, unbound methods called this way will have a `this` value matching the object they're called from which would be the `this` value in the scope where the method was called.

```js
let derivedThis;
class Base {
    method() {
        console.info(this === derivedThis); // true
    }
}
class Derived extends Base {
    constructor() {
        super();
        derivedThis = this;
        super.method();
    }
}
new Derived();
```

Docs:

- [MDN reference: classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)
- [MDN reference: new](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new)
- [MDN reference: super](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super)

#### Arrow function

Arrow functions use a lexical `this`, meaning they pull the `this` value from the surrounding scope rather than have a specific `this` created in the context of the function for each function call.

```js
const outerThis = this;
const arrow = () => {
    console.info(this === outerThis); // true
};
arrow();
```

Docs:

- [MDN reference: arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)

#### Arrow function method

Arrow functions as methods (via fields) will use the surrounding scope for the value of `this`. While the arrow function may be defined within an object literal initializer, those initializers do not define scopes. The scope seen by arrow function for the value of `this` will be the scope outside of the object's definition.

```js
const outerThis = this;
const obj = {
    arrowMethod: () => {
        console.info(this === outerThis); // true
    },
};
obj.arrowMethod();
```

Docs:

- [MDN reference: arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN reference: public class fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields)

#### Bound arrow function

If a function created from `bind()` was called on an arrow function, that function will still use the `this` scoping rules of the original arrow function rather than the value provided to `bind()`. A call to `bind()` cannot supersede `this` values seen in arrow functions.

```js
const outerThis = this;
const bindObject = {};
const arrow = () => {
    console.info(this === outerThis); // true
};
const bound = arrow.bind(bindObject);
bound();
```

Docs:

- [MDN reference: arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- [MDN reference: bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)

#### Default parameters

Though not in the function body, expressions defining default parameters in a function's parameter list is considered in the scope of the function. The value of `this` in a default parameter expression is the same as `this` in the function.

```js
const callObject = {};
function example(param = this) {
    console.info(this === callObject); // true
    console.info(param === callObject); // true
}
example.call(callObject);
```

Docs:

- [MDN reference: function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)
- [MDN guide: functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- [MDN reference: default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters)
- [MDN reference: call](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call)

#### Proxy traps

A proxy trap is used to define the implementation for a trapped behavior in a proxy object. Traps are called internally by the Proxy implementation and when they're called, they're treated as methods of the handler object provided to the proxy constructor. If a proxy trap is a trap for a function, the value of `this` in that method will be determined by the trap and if/how it provides or calls the original function.

```js
function target() {}
const handler = {
    apply() {
        console.info(this === handler); // true
    },
};
const proxiedTarget = new Proxy(target, handler);
proxiedTarget();
```

Docs:

- [MDN reference: Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN reference: handler apply](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/apply)

#### With object method

The `with` statement is used to create an object scope. When an unqualified reference is made within a `with` object scope, it is seen as reference from the `with` object assuming that object has a property matching the name of that references. For method calls called as unqualified functions, `this` in the methods will be object used for the `with` scope.

```js
const object = {
    method() {
        console.info(this === object); // true
    },
};
with (object) {
    method();
}
```

Docs:

- [MDN reference: object initializer](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer)
- [MDN reference: method definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions)
- [MDN reference: with](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/with)
