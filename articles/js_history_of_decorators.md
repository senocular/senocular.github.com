# A History of Decorators in JavaScript

JavaScript doesn't support decorators, not officially, not yet.  But they are planned for to the language.  Even so, they're history has been a turbulent one, with multiple revisions already having been made to their specification.

## What are Decorators?

Decorators are custom modifiers, like `static` or `async`, that end-users can create and apply to various definitions within their code.  They can modify, or "decorate", anything from functions to variables or even, potentially, [number literals](https://github.com/tc39/proposal-extended-numeric-literals).  Initial support for decorators will be limited to `class` definitions, but they will be expanded to include other use cases (such as number literals) later on.

A example of a decorator would be a `@bind` decorator for class methods which would automatically bind a method's context to an instance's `this`.

```javascript
class MyNumber {
  constructor (value) {
    this.value = value
  }
  
  @bind // decorator applied to getValue method
  getValue () {
    return this.value
  }
}

const num = new MyNumber(1)
const getValue = num.getValue
getValue() // 1
```

## Iteration 1: Legacy Decorators

## Iteration 2: Decorators++

## Iteration 3: Return of the Decorators

# References

- Spec iteration 1: [README.md](https://github.com/wycats/javascript-decorators/blob/e1bf8d41bfa2591d949dd3bbf013514c8904b913/README.md)
- Spec iteration 2: [README.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/README.md), [METAPROGRAMMING.md](https://github.com/tc39/proposal-decorators/blob/beae8dc25d2dddc3a19cdd235d14f8b16a6f1325/METAPROGRAMMING.md)
- Spec iteration 3: [README.md](https://github.com/tc39/proposal-decorators/blob/e480e0659534567a7edb28ffe968f583a91c7e0c/README.md)
