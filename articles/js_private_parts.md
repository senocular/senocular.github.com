# JavaScript's Private Parts

With the introduction of ES2022 JavaScript now has support for private members in its `class` syntax. This allows classes to define class members that are only accessible from within the class itself. 

This article will look into how private members work and show just how different they are from their public counterparts.

## Syntax

Private members look just like public members except their identifier is prefixed with a hash character (`#`).

```javascript
class ExampleClass {
  #privateField = 'value';
  
  #privateMethod() {
    return true;
  }
  
  get #privateAccessor() {
    return this.#privateField;
  }
  set #privateAccessor(value) {
    this.#privateField = value;
  }
}
```

Private fields must be declared within the class body. Unlike with public members, attempting to define a private field in a constructor without it having a declaration will fail.

```javascript
class ExampleClass {
  constructor() {
    this.#privateField = 'value'; // SyntaxError
  }
}
```

Private members are also only available in classes. You cannot define private members in an ordinary object initializer.

```javascript
const obj = {
  #privateField: 'value' // SyntaxError
};
```

## Access

You can only access a private members from with a class. To prevent outside access to private members, JavaScript uses a scoping mechanism to scope all private names within a class to that class's `class` block. Whenever you attempt to access a private member, that scope is checked for a private member of the same name and if one doesn't exist, an error is thrown.

```javascript
class ExampleClass {
  // begin private name scope
  
  #privateField = 'value'; // #privateField added to ExampleClass's private scope
  
  // end private name scope
}

// outside of private name scope
const example = new ExampleClass();
console.log(example.#privateField); // SyntaxError
```

There is only one private scope per class, and both instance private members and static private members share it. This prevents you from being able to use the same name for instance members and static members even though the members themselves would be stored on different objects (one in instances, one in the class itself).

```javascript
class ExampleClass {
  #privateField = 'value';
  static #privateField = 'value'; // SyntaxError
}
```

Any class defined within another class's class block will be able to access the outer class block's private member names since they would still be in scope.

```javascript
class ExampleClass {
  static #privateField = 'value';
  
  static InnerClass = class {
    getPrivateField() {
      return ExampleClass.#privateField; // still within scope
    }
  }
}

const inner = new ExampleClass.InnerClass();
console.log(inner.getPrivateField()); // 'value'
```

Nested classes also have their own private scope. These scopes have an independent set of private names. A private name in an inner scope matching that of a name in an outer scope is allowed but would cause that outer scope name to be shadowed and inaccessible from the inner scope.

```javascript
class ExampleClass {
  // begin outer private name scope
  
  static #privateField = 'outer value';
  
  static InnerClass = class {
    // begin inner private name scope
    
    #privateField = 'inner value'; // outer #privateField shadowed by this #privateField
    
    getPrivateField() {
      return ExampleClass.#privateField; // TypeError
    }
    
    // end inner private name scope
  }
  
  // end outer private name scope
}

const inner = new ExampleClass.InnerClass();
console.log(inner.getPrivateField());
```

In the example above, while the name of the identifier is the same in both classes, the field is different because each private name represents a different private key. Unlike normal public members, private members are not stored directly by name. Instead they use a custom key similar symbols where the name of the identifier is the symbol description and each private member gets its own symbol such that `Symbol('#privateField') !== Symbol('#privateField')`. What you end up with given the previous example is something similar to:

```javascript
// emulating private members using symbols
const ExampleClass = (() => { // represents ExampleClass private scope
  const privateField = Symbol('#privateField');
  
  return class ExampleClass {
    static [privateField] = 'value';
    
    static InnerClass = (() => { // represents InnerClass private scope
      const privateField = Symbol('#privateField');
      
      return class InnerClass {
        [privateField] = 'inner value';
        
        getPrivateField() {
          return ExampleClass[privateField]; // not the same symbol
        }
      }
    })();
  }
})();

const inner = new ExampleClass.InnerClass();
console.log(inner.getPrivateField()); // undefined
```

Here, you have access to the variables storing the symbols (the member identifier) but not the symbols (the keys) themselves. This symbol version, while similar in approach to what private members are doing internally, is also not as strict as the private member equivalent. When not found in an object, public member references such as those going through symbols will return `undefined`. Conversely, when a private member is not found a TypeError is thrown. Errors related to scoping seen in previous examples are SyntaxErrors and are found during code parsing, before any of the code even runs.

Without being able to access a private member's real key, there's no way to dynamically reference it. Any dynamic lookups of members by name are automatically treated as public member lookups.

```javascript
class ExampleClass {
  #privateField = 'value';
  
  constructor() {
    console.log(this.#privateField); // 'value'
    
    // attempts to access public field named "#privateField"
    console.log(this["#privateField"]); // undefined
  }
}

const example = new ExampleClass();
```

## Storage

Each object in JavaScript has its own internal storage for all of its private members. Private members defined by any class within a class hierarchy get stored in this internal storage for any given object instance. Because private members are not keyed by name, this allows any single object to have multiple private members of the same name if defined by different classes. While private members of the same name cannot exist in the same scope, they can exist in the same object when defined by different classes.

```javascript
class ExampleClass {
  #privateField = 'base value';
    
  getBasePrivateField() {
    return this.#privateField;
  }
}

class SubExampleClass extends ExampleClass {
  #privateField = 'sub value'; // same private name, does not clash
    
  getSubPrivateField() {
    return this.#privateField;
  }
}

const sub = new SubExampleClass(); // private members = [#privateField, #privateField]
console.log(sub.getBasePrivateField()); // 'base value'
console.log(sub.getSubPrivateField()); // 'sub value'
```

We can see this behavior is consistent when using symbols to represent private members.

```javascript
// emulating private members using symbols
const ExampleClass = (() => {
  const privateField = Symbol('#privateField');
  
  return class ExampleClass {
    [privateField] = 'base value';
    
    getBasePrivateField() {
      return this[privateField];
    }
  }
})();

const SubExampleClass = (() => {
  const privateField = Symbol('#privateField');
  
  return class SubExampleClass extends ExampleClass {
    [privateField] = 'sub value';
    
    getSubPrivateField() {
      return this[privateField];
    }
  }
})();

const sub = new SubExampleClass();
console.log(Reflect.ownKeys(sub)); // [Symbol(#privateField), Symbol(#privateField)]
console.log(sub.getBasePrivateField()); // 'base value'
console.log(sub.getSubPrivateField()); // 'sub value'
````

Unlike public members, private members are not stored with any of the attributes associated with public members such as configurable, enumerable, and writable. Private members have what equates to the immutable attributes of:

* **field**: non-configurable, non-enumerable, writable
* **method**: non-configurable, non-enumerable, non-writable
* **accessor**: non-configurable, non-enumerable (writable N/A)

As a result private members cannot be deleted or enumerated. They also do not participate in object freezing.

```javascript
class ExampleClass {
  #privateField = 'value';
  publicField = 'value';
  
  constructor() {
    Object.freeze(this);
    this.#privateField = 'new value'; // allowed
    this.publicField = 'new value'; // TypeError
  }
}
```

### Emulating with WeakMaps

While the use of symbols to emulate private members more closely matches the internal implementation used by JavaScript, at runtime the symbol keys would be public and observable outside the scope of the class.  Transpilers like [Babel](https://babeljs.io/) and [TypeScript](https://www.typescriptlang.org/) will instead use WeakMap collections to store private members for object instances when transpiling down to versions of JavaScript that don't support them natively. Given:

```javascript
class ExampleClass {
  #privateField = 'value';
}
```

TypeScript would transpile this to:

```javascript
"use strict";
var _ExampleClass_privateField;
class ExampleClass {
    constructor() {
        _ExampleClass_privateField.set(this, 'value');
    }
}
_ExampleClass_privateField = new WeakMap();
```

Because the private member values are stored within the WeakMap and not the class instance itself, there's no way for an outside observer to access them. And while these WeakMaps would technically be in scope for others to access, TypeScript will use name mangling during the transpilation step to ensure that doesn't happen in the resulting JavaScript output.

## Assignment

Private instance members get assigned to object instances within the constructor along with public fields. This applies to all private members including methods and accessors which is a departure from how public methods and accessors work. Public methods and accessors are defined within a class's prototype which are inherited and immediately available during object creation. Private methods and accessors are assigned to an object like fields in the constructor immediately following `super()`.

```javascript
class ExampleClass extends Object {
  #privateMethod() {
    return true;
  }

  constructor() {
    super();
    // #privateMethod assigned to `this` here
  }
}
```

Despite being individually assigned and not inherited, a single function is used for each private method and accessor which is shared between every instance.  Private method and accessor functions are not recreated for each instance as a function defined through a field would.

```javascript
class ExampleClass extends Object {
  #privateMethod() {
    return 'reused';
  }
  
  fieldMethod = () => 'recreated';

  static compare() {
    const a = new ExampleClass();
    const b = new ExampleClass();
    console.log(a.#privateMethod === b.#privateMethod); // true
    console.log(a.fieldMethod === b.fieldMethod); // false
  }
}

ExampleClass.compare();
```

Each class maintains an internal list of their private method and accessor functions so that they can be assigned to instances when initialized.  While public methods and accessors can be accessed prior to any instance being created through a class's `prototype`, it is not possible to access private members without first creating an instance.

Given that inheritance doesn't apply to private members, static private members are not able to be inherited by subclasses.

```javascript
class ExampleClass {
  static #privateMethod() {
    return true;
  }

  static callPrivateMethod() {
    return this.#privateMethod();
  }
}

class SubExampleClass extends ExampleClass {}

console.log(ExampleClass.callPrivateMethod()); // true
console.log(SubExampleClass.callPrivateMethod()); // TypeError
```

In the above example, `callPrivateMethod()` can be called from `SubExampleClass` because it is inherited. However the same doesn't apply to `#privateMethod()` so when the public method tries to the private one, an error is thrown.

Static private members aren't available to subclasses because unlike instances of a class, there is no constructor step for private static members to get added. Class objects are only assigned their own static private members.

### The Set (and Map) problem

The fact that private members get added in the constructor rather than being inherited generally shouldn't cause a problem. But that is not always the case. Consider the built-in Set type. When you create a new Set instance you have the option of passing initial values into the constructor. These values get run through the public `add()` method during the initialization that happens within the `Set` constructor (a similar behavior is seen with `Map` and its `set()` method). If you were to subclass `Set` and override `add()`, it would be called with initial values during construction.

```javascript
class LogSet extends Set {
  add(value) {
    console.log('Adding:', value);
    super.add(value);
  }
}

const logSet = new LogSet([1,2,3]);
// Adding: 1
// Adding: 2
// Adding: 3
```

However, changing this code to refer to a private method within the overridden `add()` would not work.

```javascript
class LogSet extends Set {
  #log(value) {
    console.log('Adding:', value);
  }
  
  add(value) {
    this.#log(value); // TypeError
    super.add(value);
  }
}

const logSet = new LogSet([1,2,3]);
```

This code throws an error because the `add()` call being made for the initial values is occurring in the `Set` constructor befire the `SubSet` constructor is able to assign the private `#log()` method.

To work around this issue, the subclass constructor should not pass the initial values to `super` and instead add them manually after.

```javascript
class LogSet extends Set {
  constructor(iterable) {
    super(); // empty super
    // super(iterable) // not this
    
    // private members now available

    if (iterable) { // manually add 
      for (const value of iterable) {
        this.add(value);
      }
    }
  }

  #log(value) {
    console.log('Adding:', value);
  }
  
  add(value) {
    this.#log(value); // no error
    super.add(value);
  }
}

const logSet = new LogSet([1,2,3]);
// Adding: 1
// Adding: 2
// Adding: 3
```

Ultimately, this could be attributed more to the fact that the `Set` constructor is calling a public method than it being a problem with how private members are defined.

## Conclusion

At a high level, private members are much like public members with a bunch of additional restrictions. And for the most part, this is a solid mental model. However, there are times when the behavior of private members can seem confusing. Knowing how they operate can be key to getting a better understanding of these unusual behaviors and why they exist.

In summary, private members:

- Are declared with names scoped to the class block
  - Can have name collisions between static and instance members in the same class
  - Can be referenced in child classes defined within the owner class's class block
- Cannot be dynamically referenced by name
- Do not have typical enumerable/writable/configurable attributes
  - Cannot be deleted
  - Cannot be enumerated
  - Do not participate in object freezing
- Are added in the constructor
- When static, are not shared among subclasses

