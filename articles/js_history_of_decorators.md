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

Legacy decorators have the simplest implementation.  They use normal JavaScript functions as decorators and are able to decorate both classes and class methods and accessors.  Class decorators simply wrap the class in a function while method and accessor decorators get passed the class prototype, the name of the member, and a descriptor for that member.  The enumerable decorator from earlier would be defined as:

```javascript
function enumerable(target, key, descriptor) {
    descriptor.enumerable = true;
}
```

## Iteration 2: Enhanced Decorators

The next iteration of the decorators specification expanded on legacy decorators adding additional functionality and expanding the capabilities of decorators.  Not only could a decorator modify a decorated class member, and do more to it than before, but it could also add additional members to the class.

## Iteration 3: Static Decorators

## Summary



# References

- Spec iteration 1: [README.md](https://github.com/wycats/javascript-decorators/blob/e1bf8d41bfa2591d949dd3bbf013514c8904b913/README.md)
- Spec iteration 2: [README.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/README.md), [METAPROGRAMMING.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/METAPROGRAMMING.md)
- Spec iteration 3: [README.md](https://github.com/tc39/proposal-decorators/blob/e480e0659534567a7edb28ffe968f583a91c7e0c/README.md)
