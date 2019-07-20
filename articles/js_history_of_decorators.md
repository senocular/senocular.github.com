# A Brief History of Decorators in JavaScript

JavaScript doesn't support decorators, not officially, not yet.  But they are planned for to the language, as suggested by the current stage 2 [decorator proposal](https://github.com/tc39/proposal-decorators).  Even so, developers have been using them in production for years.  Unfortunately, what they've been using is very likely not like what will eventually become part of the standard.

Here, we'll look into the changes of the decorators spec over its last couple of revisions, from where it started (what's out there now) to where it looks like its going to end up.

## What are Decorators?

Decorators are custom modifiers, similar to those you might see for functions like `static` or `async`, that end-users can create and apply to various definitions within their code.  Decorators can modify, or "decorate", anything from functions to variables or even [number literals](https://github.com/tc39/proposal-extended-numeric-literals).  Initial support for decorators will be limited to `class` definitions (classes and their members), but are planned to be expanded to include other use cases, such as number literals, later on.

A example of a decorator would be an `@enumerable` decorator that could expose a class's method to enumeration.

```javascript
class MyClass {
  
  @enumerable // decorator applied to the exposed method
  exposed () {}
}

const myInstance = new MyClass()
for (let member in myInstance) console.log(member) // "exposed"
```

Normally methods do not get exposed to iteration through `for...in` loops. However, here, the `@enumerable` decorator was able to alter the implementation of the `exposed` method so that it would.

## Iteration 1: Legacy Decorators

The first iteration of decorators was the simplest and, currently, is still the most widely used.  You'll see this implementation, or a variation of it, in [TypeScript](https://www.typescriptlang.org/) and used by libraries like [MobX](https://mobx.js.org/).

Legacy decorators have the simplest implementation.  They use normal JavaScript functions as decorators and are able to decorate both classes and the members defined within them.  Class decorators simply wrap the class in a function while method and accessor decorators get passed the class prototype, the name of the member, and an object descriptor (as used with [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)) for that member as arguments.  The `@enumerable` decorator from earlier, given that it decorates a class method, could be defined as:

```javascript
function enumerable (target, key, descriptor) {
    descriptor.enumerable = true
}
```

When applied to a class method, placing the function before the definition with an `@` character prefix in its name...

```javascript
class MyClass {
  
  @enumerable
  exposed () {}
}
```

the function gets run as:

```javascript
const descriptor = Object.getOwnPropertyDescriptor(MyClass.prototype, 'exposed')
enumerable(MyClass.prototype, 'exposed', descriptor)
```

Any changes to the descriptor then gets applied back to the definition, or if a new descriptor was returned, that would be used in its place.

The simplicity of these kinds of decorators made them easy implement, and even as simple as they were,they provided enough functionality to handle most of the common use cases.  Unfortunately, the feature set of classes was expanding (for example, with the inclusion of private members) and decorators needed to catch up.

## Iteration 2: Enhanced Decorators

The next iteration of the decorators specification greatly expanded the capabilities of legacy decorators.  The overall approach was very similar, still using functions to represent decorators, but the improved design allowed for much more than was possible before.

These new, enhanced decorators took the normal object descriptor used by the legacy decorators and super charged it, added additional properties that provided access to virtually every part of the definition.  Additions include:

* **kind**: Identifies the kind of property decorated or the kind of decoration being applied. Values include: `"class"`, `"method"`, `"field"`, `"accessor"`, or `"hook"`.
* **key**: The name of the member or class being decorated.
* **placement**: Where the definition is being defined. Values include: `"prototype"`, `"static"`, or `"own"` where "static" is defined on the class constructor and "own" is defined on class instances.
* **elements**: (Classes) A list of the definitions defined for the class.
* **initialize**: (Fields) A function run to define the initial value of a field.
* **method**: (Methods) The value of the method.
* **start**: (Hooks) Callback for hook side effects.
* **replace**: (Hooks) Callback for replacing definitions in hooks.
* **finish**: (Hooks) Callback for hook side effects.
* **extras**: An array of additional descriptor objects that represent new definitions or hooks that can be handled in addition to the current decorated item.

Using the `placement` property, for example, you could take a method that would normally get placed on the prototype and instead define it on the instance by changing its value to `"own"`.

Also introduced was the concept of hooks. Hooks are callbacks that can be run at different times during the definition process.  A normal decorator can be transformed into a hook by adding a hook callback to the descriptor, or they can be added separately to a decoration by adding them to the `extras` array.

Looking back to the `@enumerable` decorator example, we can update it for this new iteration:

```javascript
function enumerable (descriptor) {
    descriptor.enumerable = true
    return descriptor
}
```

The definition has changed slightly since all of the information for the decorator is encapsulated in the new descriptor object which also now needs to be returned.

While the `@enumerable` example doesn't do much to show off the added functionality of these new decorators, the additional complexity needed to support this added functionality did come at a cost - a cost that was to be addressed in the next iteration.

## Iteration 3: Static Decorators

While the second iteration of decorators added a lot of power and functionality to decorators, it also made them complicated - not only more complicated to author, but also in a way that could affect runtime performance.  The third iteration of decorators (the current iteration, currently at stage 2) addressed these issues by taking a step back, largely reverting to the functionality of legacy decorators along with a few exceptions, such as support for private member decoration which was not explicitly included before.

More significantly, with static decorators, decorators are no longer simple JavaScript functions.  They are, instead, a brand new entity with their own declarations created with the use of a new `decorator` keyword.  Decorators are defined through the composition of other decorators, either other custom decorators and/or any of the built-in decorator primitives.

For the `@enumerable` example, we would now have:

```javascript
decorator @enumerable {
  @register((target, name) => {
    const descriptor = Object.getOwnPropertyDescriptor(target, name)
    Object.defineProperty(target, name, { ...descriptor, enumerable: true })
  })
}
```

This custom decorator uses the built-in `@register` decorator primitive to make the decorated class member enumerable.  Unlike with previous iterations, a descriptor object is not automatically provided.  Instead, primitives provide hooks into the definition process and any changes to a definition's description would need to be handled manually.

Built-in decorators include:

* **`@wrap`**: Wraps a definition in a function call.
* **`@initialize`**: Provides a callback that is called during instance construction.
* **`@register`**: Provides a callback for after the class is defined.
* **`@expose`**: A version of `@register` that allows access to private members.

With these primitives, you should be able to obtain the same functionality as legacy decorators.  This will help in making the transition from legacy decorators to this newest iteration, except for the fact that any custom decorators would have to be re-written to use the new decorator declaration syntax. 

## Summary

TBD


# References

- Spec iteration 1: [README.md](https://github.com/wycats/javascript-decorators/blob/e1bf8d41bfa2591d949dd3bbf013514c8904b913/README.md)
- Spec iteration 2: [README.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/README.md)
- Spec iteration 3: [README.md](https://github.com/tc39/proposal-decorators/blob/e480e0659534567a7edb28ffe968f583a91c7e0c/README.md)
