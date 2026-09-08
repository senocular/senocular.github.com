# Global is Complicated

There is a lot of hidden complexity in JavaScript's global. Here we'll discuss everything you need to know about it, and maybe a little more.

## An Object and a Scope

Unlike most other scopes in JavaScript, the global scope exists both as an object and a scope. If you add properties to the global object, those properties become available to the global scope.

Using `globalThis` to refer to the global object, we can add properties that are then made available anywhere in the program (within the same realm).

```javascript
globalThis.myProperty = "my value";
console.log(myProperty); // "my value"
```

While other object scopes exist in JavaScript, they are uncommon. One way to create an object scope is using the `with` statement. The `with` statement, however, is considered deprecated and will not work at all in strict code, throwing a SyntaxError when encountered.

```javascript
// Sloppy mode only
const myObject = {
    myProperty: "my value",
};
with (myObject) {
    console.log(myProperty); // "my value"
    myProperty = "new value";
}
console.log(myObject.myProperty); // "new value"
```

It's more likely that the only object scope you'll ever have to deal with is the global scope.

## Multiple Scopes

The global scope is not a single scope, rather a composite scope consisting of two different scopes. One scope is the global object scope which most people associate with being the global scope. There is another normal scope, i.e. a declarative scope, in the global scope. It is used for lexical declarations.

This second scope didn't always exist. It was introduced in ES2015 along with the lexical declarations `let`, `const`, and `class`. This scope allows lexical declarations to live along side object global properties of the same name without directly conflicting with them. This means you can have multiple identifiers with the same name in the global scope.

When referring to a global value through an unqualified name, the declarative scope will checked first, followed by the object scope. If you specifically want to check the object scope without going through the declarative scope, you can go through the global object.

```javascript
globalThis.myProperty = "object scope";
let myProperty = "declarative scope";
console.log(myProperty); // "declarative scope"
console.log(globalThis.myProperty); // "object scope"
```

## Global Built-ins

Language and environment built-ins live in the global object. This includes global. values like `Object`, `Array`, `NaN`, and `undefined`. For web browsers, it also includes values like `setTimeout`, `document`, and `navigator`, definitions specific to that environment.

```javascript
console.log(globalThis.Object); // ƒ Object() { [native code] }
```

New globals, as they're introduced to the language, will continue to be added to the global object and not the declarative scope of global as that exists solely for user-defined declarations. User-defined declarations, as long as they're in the declarative scope, will (largely) not conflict with new language globals as they're added given the separation and precedence the declarative scope has over global object properties.

```javascript
let Iterator = "defined before Iterator was global";
console.log(Iterator); // "defined before Iterator was global"
console.log(globalThis.Iterator); // ƒ Iterator() { [native code] }
```

## Global Declarations

Different declarations behave in different ways when declared in the global scope. Lexical declarations all go in the declarative scope. These include:

- `let`
- `const`
- `class`
- `using`
- `await using`

Non-lexical declarations are created in the global object. These include:

- `var`
- `function`

```javascript
var myVar = "object scope";
let myLet = "declarative scope";

console.log(myVar); // "object scope"
console.log(globalThis.myVar); // "object scope"
console.log(myLet); // "declarative scope"
console.log(globalThis.myLet); // undefined
```

While these declarations may defined in different parts of the global scope, there are still protections to prevent them from having the same name, a behavior making them consistent with other, non-global scopes.

```javascript
var myDeclaration = "object scope";
let myDeclaration = "declarative scope";
// SyntaxError: Identifier 'myDeclaration' has already been declared
```

These protections do not apply when global properties are added to the global object. For lexical declarations global properties are ignored and the lexical declarations gets added to the declarative scope.

```javascript
globalThis.myDeclaration = "object scope";
let myDeclaration = "declarative scope";
// OK
```

For non-lexical declarations, if a property of the same exists in the global object, the declaration is ignored and any assignment made to the declaration acts as thought it were being made to the existing property.

```javascript
globalThis.myProperty = "first value";
var myProperty = "second value";
console.log(globalThis.myProperty); // "second value"
```

This can cause some unforeseen circumstances, especially if the existing global property is more than just a data property. For example, the `name` property of `window` (the global object in browsers) is an accessor property with a setter that converts all of its assignments to strings. Attempting to declare a `var name` in a browser with a non-string value will cause that value to be converted into a string because the existing setter will be called rather than the value being assigned to a new variable.

```javascript
// In browsers
var name = {};
console.log(name); // "[object Object]"
```

This is where lexical declarations come in handy because they use the declarative scope.

```javascript
// In browsers
let name = {};
console.log(name); // {}
```

Declarations made with `var` and `function` are similar to assigning properties directly to the global object but they're not exactly the same. What separates them from normal assignments is that they create non-configurable properties. A non-configurable property can't be deleted or reconfigured with `Object.defineProperty()`.

```javascript
globalThis.myProperty = "property";
var myVar = "variable";

console.log(Object.getOwnPropertyDescriptor(globalThis, "myProperty"));
// {value: 'property', writable: true, enumerable: true, configurable: true}

console.log(Object.getOwnPropertyDescriptor(globalThis, "myVar"));
// {value: 'variable', writable: true, enumerable: true, configurable: false}
```

Additionally, if a global property is non-configurable, lexical declarations will fail to be able create declarations of the same name in the declarative scope. This allows `var` and `function` declarations to continue to enforce duplicate declarations even if executed in different scripts.

```html
<script>
    var myDeclaration = "var";
</script>
<script>
    let myDeclaration = "let";
    // SyntaxError: Identifier 'myDeclaration' has already been declared
</script>
```

If the `var` declaration were only assigned to the global object as a normal property, the `let` declaration in the second script would have succeeded since assignment inherently defines a configurable property . You'd see the same behavior defining the property with `Object.defineProperty()` setting `configurable` to false.

```html
<script>
    Object.defineProperty(globalThis, "myDeclaration", { value: "var", configurable: false });
</script>
<script>
    let myDeclaration = "let";
    // SyntaxError: Identifier 'myDeclaration' has already been declared
</script>
```

There are some global built-ins that are also non-configurable, though most are not. A simple script can be used to identify those that are:

```javascript
for (const [key, desc] of Object.entries(Object.getOwnPropertyDescriptors(globalThis))) {
    if (!desc.configurable) {
        console.log(key);
    }
}
// Infinity
// NaN
// undefined
// window
// document
// location
// top
```

This list may be different depending on your environment.

Any attempt to create a lexical declaration with an identifier of the same name will result in an error.

```javascript
// In browsers
let top = 0;
// SyntaxError: Identifier 'top' has already been declared
```

## globalThis and the WindowProxy

Modern JavaScript favors the use of `globalThis` to refer to "the global object." This global (`globalThis` is, itself, a global property) didn't always exist, first being introduced in ES2020. Before that, there different ways to refer to the global object depending on where you were. In browsers it was `window`, on NodeJS it was `global`, and in workers you might see `self` being used. The introduction of `globalThis` was to have a way to consistently refer to the global object consistently irrespective of where your code was running.

But why "globalThis"? What role does `this` play in the global object?

As it turns out, technically, `globalThis` doesn't refer to _the_ global object. What it refers to is what its name suggests, the value of `this` in the global scope. For all events and purposes this is global object, except when it's not.

In browsers, its well known that the `window` object is the global object. But this isn't completely accurate. The value of `window` is actually a WindowProxy, a wrapper for the true global Window object. Interactions with the WindowProxy are forwarded to the underlying Window object so under normal circumstances, you wouldn't know it was there.

One way you can observe the WindowProxy as a wrapper is through an iframe. An iframe's `window` - the WindowProxy - doesn't change when it loads or reloads a document, but the underlying Window does.

```javascript
// In browsers
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

const iWindow = iframe.contentWindow;
iWindow.myProperty = "iframe value";
console.log(iWindow.myProperty); // "iframe value"

iframe.onload = () => {
    console.log(iWindow === iframe.contentWindow); // true
    console.log(iWindow.myProperty); // undefined
};
iWindow.location.reload();
```

This example stores the iframe's `window` in a `iWindow` property which we can observe doesn't change when the iframe is reloaded, still equalling the same `contentWindow`. However, the `myProperty` property no longer exists after the reload because it was defined in the underlying Window of the original iframe document.

In this context, `globalThis` refers to the value of `this` in global, or `window`, which is a WindowProxy, and not the true global which is a Window object that proxy wraps.

## Multiple Globals and Realms

In JavaScript applications, you may have more than one global. Each iframe in a browser, for example, has its own global which is a separate global from that of the parent document.

```javascript
// In browsers
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

console.log(iframe.contentWindow === Window); // false
```

Different global objects have different global definitions. The global `Array` in one global is different from the `Array` in another. This can cause operators like `instanceof` to fail when working with instances from other global contexts.

```javascript
// In browsers
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

const iArray = new iframe.contentWindow.Array(1, 2, 3);
console.log(iArray); // [1, 2, 3]
console.log(iArray instanceof Array); // false
```

Above, the `iArray` is an instance of `Array` from the iframe's global, so when `instanceof` tries to identify it as an instance of the current global's `Array`, it returns false because they're two different arrays.

There are alternatives for checking arrays like `Array.isArray()` which will work regardless of what global the array originated.

```javascript
// In browsers
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

const iArray = new iframe.contentWindow.Array(1, 2, 3);
console.log(iArray); // [1, 2, 3]
console.log(Array.isArray(iArray)); // true
```

The `Array.isArray()` method is considered a method that works "cross-realm," in that it can recognize arrays from different realms. A Realm in JavaScript tracks loaded modules, string template literal templates, a global object, and the set of intrinsics values used by the language (and often exposed by the global object).

Intrinsics include things like the core definitions for Object and Array, but in the realm are maintained separately from those in the global object. If someone replaces `Array` in the global object with something else, the intrinsic version of Array does not change. This is why the literal syntax for an array (`[]`) does not change when the global `Array` changes.

```javascript
globalThis.Array = Date;
console.log(new Array(1, 2, 3)); // Sun Mar 03 1901 00:00:00 GMT-0500
console.log([1, 2, 3]); // [1, 2, 3]
```

For every realm there is one global. Every global is owned by only one realm. An execution context, which is a part of the agent, may interact with one or more realms. Same-origin iframes all share the same execution context though they have different realms. Cross-origin iframes have different realms and different execution contexts/agents. This is why you can't directly access code or definitions in those realms and need to use other forms of communication like `postMessage()`.

When sharing data with `postMessage()` values are cloned using the structured clone algorithm and recreated in the current realm. So while you may get an Array from a different Array global when digging directly into a (same-domain) iframe, it would be seen as an Array from the current realm when passed through `postMessage()`.

```javascript
// In browsers
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

const iArray = new iframe.contentWindow.Array(1, 2, 3);
console.log(iArray instanceof Array); // false

window.onmessage = ({ data }) => {
    console.log(data instanceof Array); // true
};
iframe.contentWindow.parent.postMessage(iArray);
```

It's worth noting that while modules and string templates live with the realm, the symbol registry for registered symbols created by `Symbol.for()` live with the agent. A symbol created from two different realms using `Symbol.for()` from their respective realm intrinsics will create the same symbol if in the same agent.

```javascript
// In browsers
const iframe = document.createElement("iframe");
document.body.appendChild(iframe);

console.log(iframe.contentWindow.Symbol.for("foo") === Symbol.for("foo")); // true
```

## Conclusion

There's a lot going on with global in JavaScript. Luckily, with modern JavaScript, code more likely to be written in the context of modules which saves it from many of the complications of the global scope. Regardless, here are some tips to help you avoid some of the potential pitfalls that involve global:

- Always use lexical declarations like `let` and `const` to help avoid collisions with global object properties when in the global scope
- Recognize that there may be some variables which will collide regardless (e.g. `top` and `location` in browsers) and either need to be renamed or defined in different scopes - and the same could apply to any user-defined global `var` declarations or non-configurable global properties
- In fact, if possible, avoid declarations in the global scope all together, wrapping code in a function or even a block scope (`{}`)
- Use realm-safe methods for checking types of values when available, methods like `Array.isArray()` and `Error.isError()`
