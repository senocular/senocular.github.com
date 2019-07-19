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

The first iteration of decorators was the simplest and, currently, is still the most widely used.  You'll see this implementation in [TypeScript](https://www.typescriptlang.org/) and used by libraries like [MobX](https://mobx.js.org/).

Legacy decorators have the simplest implementation.  They use normal JavaScript functions as decorators and are able to decorate both classes and class methods and accessors.  Class decorators simply wrap the class in a function while method and accessor decorators get passed the class prototype, the name of the member, and an object descriptor (as used with [Object.defineProperty](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)) for that member.  The enumerable decorator from earlier could be defined as:

```javascript
function enumerable(target, key, descriptor) {
    descriptor.enumerable = true;
}
```

## Iteration 2: Enhanced Decorators

The next iteration of the decorators specification expanded on legacy decorators adding additional functionality and adding to the capabilities of decorators.  With these improvements, decorators could be used with fields as well as methods, and even supported interacting with private members.  A single decorator was also capable of creating additional definitions within a class on top of the one being decorated.

To support the extra functionality, the object descriptor used by decoratoes was expanded to include the original values along with the following new properties:

* kind:
* key:
* placement:
* Elements: (Classes)
* initialize: (Fields)
* method: (Methods) 
* start: (Hooks)
* replace: (Hooks)
* finish: (Hooks)
* extras:

## Iteration 3: Static Decorators

## Summary



# References

- Spec iteration 1: [README.md](https://github.com/wycats/javascript-decorators/blob/e1bf8d41bfa2591d949dd3bbf013514c8904b913/README.md)
- Spec iteration 2: [README.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/README.md), [METAPROGRAMMING.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/METAPROGRAMMING.md)
- Spec iteration 3: [README.md](https://github.com/tc39/proposal-decorators/blob/e480e0659534567a7edb28ffe968f583a91c7e0c/README.md)
