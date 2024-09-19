# Pitfalls of Proxy

Proxies are powerful tools, providing capabilities otherwise not possible with JavaScript. However, there are a number of pitfalls you should be aware of when using proxies.

## A Proxy is a new object

When you create a proxy you create a new object that is a wrapper around another object.  The original object and the proxy co-exist as two separate objects with the original object unchanged after the proxy is created. For the proxy traps to get used, you must interact with the proxy object, not the original target object.

What this means is if you aren't in control of the creation of the original object, you can't always guarantee the proxy version will get used. For example, if you wanted to proxy the `document` object in browsers, there would be no way to replace the original document with the proxy.

```javascript
const documentProxy = new Proxy(document, {});
window.document = documentProxy;
//> TypeError: Cannot set property document
```

If you wanted to use a proxy for the document object (or anything like it) you'd need to make sure each time you attempted access of that object, it'd be through the proxy and not the original object. This can be challenging, especially for a global like `document`.

## Private member access

If a proxy attempts to access a private member of its wrapped target object, the property access will fail since there's no way to forward private access through the proxy.

```javascript
class MyClass {
  #privateValue = 1;
  getPrivateValue() {
    return this.#privateValue;
  }
}
const instance = new MyClass();
const instanceProxy = new Proxy(instance, {});
console.log(instanceProxy.getPrivateValue());
//> TypeError: Cannot read private member #privateValue
```

There are workarounds for preventing this error, but they involve bypassing the use of the proxy.

```javascript
class MyClass {
  #privateValue = 1;
  getPrivateValue() {
    this.anotherMethod(); // with workaround, does not get trapped by proxy
    return this.#privateValue;
  }
  anotherMethod() {/* ... */}
}

const instance = new MyClass();
const instanceProxy = new Proxy(instance, {
  get(target, name, receiver) {
    console.log("get:", name);

    // workaround: bypass proxy as receiver
    const value = target[name];
    if (value instanceof Function) {
      return function(...args) {
        return value.apply(this === receiver ? target : this, args);
      };
    }
    return value;
  },
});
console.log(instanceProxy.getPrivateValue());
//> get: getPrivateValue
//> 1
```

Without the workaround, you'd also see "get: anotherMethod" getting logged. However, because this workaround involves removing the proxy as the receiver (the `this` value) of accessor property access and method calls, traps in those calls will go unhandled.

## Internal slot access

As with private member access, internal slot access will also fail when done through a proxy. Internal slots are internal properties not accessible to JavaScript directly.

Sets, for example, use an internal slot called `[[SetData]]` to store the values within their collections.  If this is accessed through a proxy, it will throw an error.

```javascript
const set = new Set();
const setProxy = new Proxy(set, {});
setProxy.add(1);
//> TypeError: Method Set.prototype.add called on incompatible receiver
```

The workaround used for private member access will also work with internal slot access.

## Trapping methods in super constructors

When using `class` syntax, the base constructor is responsible for creating instances, then that instance gets passed through to its derived constructors.  If a derived constructor would want to instead return a proxy of the instance being created, traps from that proxy would only take effect after the super constructors have already run meaning they would not catch anything from those calls.

```javascript
class Parent {
  constructor() {
    this.method();
  }
  method() {
    console.log("Parent.method()");
  }
}

class Child extends Parent {
  constructor() { 
    super(); // called before proxy can be created

    // override implicit return of this with proxy
    return new Proxy(this, {
      get(target, name, receiver) {
        console.log("get:", name);
        return Reflect.get(target, name, receiver);
      }
    });
  }
  method() {
    console.log("Child.method()");
  }
}

const child = new Child();
//> Child.method()
child.method();
//> get: method
//> Child.method()
```

Unless you have access to the base class to create your proxy there, there's no way to trap anything within the super constructors before the proxy can be created.

## Trapping super member access

When using a proxy, member access within method calls can get trapped because the proxy instance will be used in place of `this` within those methods. However, when using `super` for member access, even though the receiver for that access is ultimately the value of `this`, proxy traps do not get handled.

```javascript
class Parent {
  method() {
    console.log("Parent.method()");
  }
}

class Child extends Parent {
  method() {
    console.log("Child.method()");
  }
  callMethod() {
    this.method();
    super.method();
  }
}

const child = new Child();
const childProxy = new Proxy(child, {
  get(target, name, receiver) {
    console.log("get:", name);
    return Reflect.get(target, name, receiver);
  }
});
childProxy.callMethod();
//> get: callMethod
//> get: method
//> Child.method()
//> Parent.method()
```

While a "get: method" was logged for `this.method()` it was not for `super.method()`. This is because `super` access isn't made through the instance, rather, it is made through the prototype of the method's home object.  In this case, the home object of Child's `method` is `Child.prototype` so the access is getting made through `Parent.prototype`. A proxy trap would only get triggered for this super method call if the prototype of `Child.prototype` were a proxy.

## Trapping construct on non-constructors

For any function the `apply` trap in a proxy can be used to trap calls to that function. This will even work with `class` constructors which would normally throw an error when called as a function without `new`.

```javascript
class MyClass {}

const MyClassProxy = new Proxy(MyClass, {
  apply() {
    console.log("apply");
  }
});

MyClassProxy();
//> apply
```

The same does not apply to the trap for the  `construct` handler. This trap will only work on functions that are already capable of being constructors.

```javascript
const arrow = () => {}; // arrow functions are not constructors
const arrowProxy = new Proxy(arrow, {
  construct() {
    console.log("construct");
    return {};
  }
});
new arrowProxy();
// TypeError: arrowProxy is not a constructor
```

The reason for this is that all functions have an internal `[[Call]]` method used for normal function calls, even classes despite them normally throwing an error.  As long as this internal method exists, a proxy will be able to trap it. The internal `[[Construct]]` method used by constructors only exists for those kinds of functions which can be used as constructors. When it doesn't exist, a proxy is unable to trap it. Since arrow functions - among others - can't be used as constructors, not having a `[[Construct]]`, it cannot be trapped by a proxy. This means there's no way to use a proxy to turn non-constructors into constructors.
