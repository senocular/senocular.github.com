# A History of Decorators in JavaScript

JavaScript doesn't support decorators, not officially, not yet.  But they are planned for to the language (the current [decorator proposal](https://github.com/tc39/proposal-decorators) is in stage 2).  Even so, they're history has been a turbulent one, with multiple, substantial revisions having been made to their specification.

## What are Decorators?

Decorators are custom modifiers, similar to those you might see like `static` or `async`, that end-users can create and apply to various definitions within their own code.  Decorators can modify, or "decorate", anything from functions to variables or even [number literals](https://github.com/tc39/proposal-extended-numeric-literals).  Initial support for decorators will be limited to `class` definitions, but are planned to be expanded to include other use cases (such as number literals) later on.

A example of a decorator would be an `@enumerable` decorator that could expose a class's method to enumeration.

```javascript
class MyClass {
  
  @enumerable // decorator applied to exposed method
  exposed () {}
}

const myInstance = new MyClass()
for (let member in myInstance) console.log(member) // exposed
```

Normally methods do not get exposed to iteration through `for...in` loops. However, the `@enumerable` decorator was able to alter the implementation of the `exposed` method so that it would be.

## Iteration 1: Legacy Decorators

The first iteration of decorators was the simplest and, currently, is still the most widely used.  You'll see this implementation, or a variation of it, in [TypeScript](https://www.typescriptlang.org/) and used by libraries like [MobX](https://mobx.js.org/).

Legacy decorators have the simplest implementation.  They use normal JavaScript functions as decorators and are able to decorate both classes and class methods and accessors.  Class decorators simply wrap the class in a function while method and accessor decorators get passed the class prototype, the name of the member, and an object descriptor (as used with [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)) for that member.  The enumerable decorator from earlier could be defined as:

```javascript
function enumerable(target, key, descriptor) {
    descriptor.enumerable = true;
}
```

When applied to a class definition (here a method) using the function as a prefix to a definition with an `@` character before its name...

```javascript
class MyClass {
  
  @enumerable
  exposed () {}
}
```

the function gets run as:

```javascript
enumerable(MyClass.prototype, 'exposed', Object.getOwnPropertyDescriptor(MyClass.prototype, 'exposed'))
```

The descriptor then gets applied back to the definition, or if a new descriptor was returned, that would be used in its place.

## Iteration 2: Enhanced Decorators

The next iteration of the decorators specification greatly expanded on legacy decorators adding additional functionality and adding to the capabilities of decorators.  With these improvements, decorators could be used with fields as well as methods, and even supported interacting with private members.  A single decorator was also capable of creating additional definitions within a class on top of the one being decorated.

To support the extra functionality, the object descriptor used by decorators was expanded to include the original values along with the following new properties:

* **kind**: Identifies the kind of property decorated or the kind of decoration being applied. Values include: `"class"`, `"method"`, `"field"`, `"accessor"`, or `"hook"`.
* **key**: The name of the member or class being decorated.
* **placement**: Where the definition is being defined. Values include: `"prototype"`, `"static"`, or `"own"` where "static" is defined on the class constructor and "own" is defined on class instances.
* **Elements**: (Classes) A list of the definitions defined for the class.
* **initialize**: (Fields) A function run to define the initial value of a field.
* **method**: (Methods) The value of the method.
* **start**: (Hooks) Callback for hook side effects.
* **replace**: (Hooks) Callback for replacing definitions in hooks.
* **finish**: (Hooks) Callback for hook side effects.
* **extras**: Additional definition objects that represent new definitions or hooks that can be handled in addition to the current decorated item.

Hooks are a notable feature that represent decorator descriptors that don't necessarily apply to a decorated member, rather allow callbacks to be run at different times during the definition process.

With these changes, decorators were given the ability to completely change any and all definitions within a class, even in ways beyond that which is allowed by the `class` syntax.

## Iteration 3: Static Decorators

While the second iteration of decorators added a lot of power and functionality to decorators, it also made them complicated - not only more complicated to author, but also in a way that could affect runtime performance.  The third iteration of decorators (the current iteration, currently at stage 2) addressed these issues by taking a step back, largely reverting to the functionality of legacy decorators along with a few exceptions, such as support for private member decoration which was not explicitly included before.

More significantly, with static decorators, decorators are no longer simple JavaScript functions.  They are, instead, a brand new entity with their own declarations created with the use of a new `decorator` keyword.  Decorators are defined through the composition of other decorators, either other custom decorators and/or any of the built-in decorator primitives.

Going back to the `enumerable` example from earlier, we would now have:

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
- Spec iteration 2: [README.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/README.md), [METAPROGRAMMING.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/METAPROGRAMMING.md)
- Spec iteration 3: [README.md](https://github.com/tc39/proposal-decorators/blob/e480e0659534567a7edb28ffe968f583a91c7e0c/README.md)
