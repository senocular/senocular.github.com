# Creating Classes using Constructor Functions

Defining classes in JavaScript with `class` is concise and powerful.  But there may be times where you would need to bypass the `class` syntax and use normal function constructors instead.  The following outlines how `class`-based constructors are wired up and how you would replicate their behavior with non-`class` constructor functions.

## Standard Base Classes

The `class` syntax is responsible for handling a lot of the class-related boilerplate for you automatically.  But when you're defining a class that's not extending another class, there's not much to do. These base classes implicitly inherit from Object just as those defined with standard constructor functions do.  The only consideration that needs to be made is moving definitions from the class body to either the constructor (fields) or the constructor's `prototype` (methods).

**class version**

```javascript
class MyClass {

  myField = 1
  
  myMethod () {
    return this.myProperty
  }
  
  constructor (myProperty) {
    this.myProperty = myProperty
  }
}
```

**constructor version**

```javascript
function MyClass (myProperty) {
    this.myField = 1
    this.myProperty = myProperty
}

MyClass.prototype.myMethod = function () {
  return this.myProperty
}
```

## Subclasses

Once you introduce subclassing, there is a lot more to consider.  Not only will inheritance need to be set up manually, but construction becomes much more complicated.

**superclass** (used by both)

```javascript
class MySuperClass {

  mySuperField = 2
  
  mySuperMethod () {
    return this.mySuperProperty
  }
  
  constructor (mySuperProperty) {
    this.mySuperProperty = mySuperProperty
  }
}
```

**class version**

```javascript
class MyClass extends MySuperClass {

  myField = 1
  
  myMethod () {
    return this.myProperty
  }
  
  mySuperMethod () {
    return super.mySuperMethod()
  }
  
  constructor (mySuperProperty, myProperty) {
    super(mySuperProperty)
    this.myProperty = myProperty
  }
}
```

**constructor version**

```javascript
function MyClass (mySuperProperty, myProperty) {
  const _super = Object.getPrototypeOf(MyClass)
  const _this = Reflect.construct(_super, [mySuperProperty], new.target)
  _this.myField = 1
  _this.myProperty = myProperty
  return _this
}

Object.setPrototypeOf(MyClass, MySuperClass)
Object.setPrototypeOf(MyClass.prototype, MySuperClass.prototype)

MyClass.prototype.myMethod = function () {
  return this.myProperty
}

MyClass.prototype.mySuperMethod = function mySuperMethod () {
  const _super = Object.getPrototypeOf(mySuperMethod._homeObject)
  return _super.mySuperMethod.call(this)
}
MyClass.prototype.mySuperMethod._homeObject = MyClass.prototype
```

There's a lot going on here, so let's look at some of the different parts in a little more detail.

### Setting Up Inheritance

We're going to skip ahead a little and start with the inheritance setup after the constructor since the constructor depends on what is happening here. The inheritance is defined with the following two lines:

```javascript
// extends
Object.setPrototypeOf(MyClass, MySuperClass)
Object.setPrototypeOf(MyClass.prototype, MySuperClass.prototype)
```

The first line sets up inheritance between constructors. Constructor inheritance allows the `static` members to be inherited as well as determines what to use for `super` in the constructor.

The second line sets up instance inheritance by having the subclass's `prototype` inherit from the superclass's.  This allows object instances created by MyClass to inherit from the methods defined by MySuperClass.

### The Constructor

The constructor is where things get messy.

```javascript
// constructor()
function MyClass (mySuperProperty, myProperty) {
  const _super = Object.getPrototypeOf(MyClass)
  const _this = Reflect.construct(_super, [mySuperProperty], new.target)
  _this.myField = 1
  _this.myProperty = myProperty
  return _this
}
```

It's complexity is in part because `class` construction is handled differently than it is with standard function constructors.  When creating an instance with function constructors, the instance is created immediately and assigned to `this` before any user code runs. With `class` constructors, instance construction is dependent on `super()`.  `this` isn't even available until `super()` is called and, in fact, what `this` is, is determined by what is created by `super()`.

To get the equivalent of `super()`, the superclass is first obtained through the constructor inheritance set up earlier using `Object.getPrototypeOf()`. Then `Reflect.construct()` is used to replicate the actual `super()` call using that superclass constructor.

```javascript
// super()
const _super = Object.getPrototypeOf(MyClass)
const _this = Reflect.construct(_super, [mySuperProperty], new.target)
```

Because `super()` is responsible for instance creation in `class` constructors, we capture the return value of `Reflect.construct()` and assign it to a `_this` variable.  The value in `_this` now represents our new class instance.  Doing this does not stop the creation of the new instance automatically created and assigned to `this` when the constructor was first invoked.  That still exists, but because it was not run through superclass initialization, we are going to ignore it.  Instead, this `_this` from the superclass is our instance, and any instance members we have will need to be assigned to it rather than `this`.

```javascript
_this.myField = 1
_this.myProperty = myProperty
```

Additionally, because we want the constructor to produce an instance that isn't the value in `this` we need to return `_this` explicitly, overriding the implicit `this` return.

```javascript
return _this
```

#### Use of `Reflect.construct`

Commonly, when using function constructors, the superclass constructor is called against the value of `this` to initialize it with the super constructor code.

```javascript
function SuperClass () {}
function SubClass () {
  SuperClass.call(this) // super
}
```

Instead, of doing this, we're using `Reflect.construct()`, for a few reasons.  First, `Reflect.construct()` allows us to use the `class`-based order of instance creation where creation occurs at the base class first with the instance getting passed down through subclasses after. 

Secondly, `class`-defined constructors cannot be called without `new`.  Trying to do so would result in an error.  Using `Reflect.construct()` bypasses this restriction.

```javascript
class SuperClass {}
function SubClass () {
  SuperClass.call(this) // Error
}
```

Most importantly, using `Reflect.construct()` will perform proper initialization for superclass.  This means being able to properly extend exotic types like Array or making sure things like private fields are set up for the instance in `class` superclasses (more on this later).

### `super` in Methods

`super` in method calls differ from the `super()` used in construction. In methods, `super` is used to look up methods in the superclass's `prototype`.  In `class`-defined methods, this lookup happens dynamically using an internal slot defined for the method called `[[HomeObject]]`. It points to the object within which the function was originally defined, or more specifically the class's `prototype` object.  We don't have access to that internal slot, so we add it manually as a property called `_homeObject` in the method function.

```javascript
// super.method()
MyClass.prototype.mySuperMethod = function mySuperMethod () {
  const _super = Object.getPrototypeOf(mySuperMethod._homeObject)
  return _super.mySuperMethod.call(this)
}
MyClass.prototype.mySuperMethod._homeObject = MyClass.prototype
```

With the `_homeObject` pointing to the current class's `prototype`, the superclass's prototype can be obtained with `Object.getPrototypeOf()`.  From that we can make the superclass method call making sure to explicitly set `this` through the use of `call()`.

## Private Fields

Unfortunately, constructor functions do not directly support private fields.  Private fields can only be defined in `class` definitions.  However, there are a couple of options to get `class`-based private fields in constructor functions.

### Inheriting Private Fields

While a function constructor can't have private fields, it can inherit from a `class` that does.  Any method that would need to access a private field would also need to be defined in that class, but the function constructor would have access to those inherently through inheritance.

**class version**

```javascript
class MyClass {

  #myPrivateField = 1
  
  myMethod () {
    return this.#myPrivateField
  }
}
```

**constructor version**

```javascript
class MyPrivateProvider {

  #myPrivateField = 1
  
  myMethod () {
    return this.#myPrivateField
  }
}

function MyClass () {
  const _super = Object.getPrototypeOf(MyClass)
  return Reflect.construct(_super, [], new.target)
}

Object.setPrototypeOf(MyClass, MyPrivateProvider)
Object.setPrototypeOf(MyClass.prototype, MyPrivateProvider.prototype)
```

Though MyClass isn't able to define a private field, because it extended a class that did, instances it creates will have access to that field through the inherited `myMethod` method.

```javascript
new MyClass().myMethod() // 1
```

### Redirecting Initialization

Using a more obscure approach, we can take advantage of the fact that `class` definitions rely on `super()` for defining `this` and create a `class` that allows us to specify what instance `this` should be by having a `super()` call that returns the object we provide to it.  Once the `class` has its `this` (the specified object), it will get initialized with that class's private fields.  And we can do this without including the class in the inheritance hierarchy meaning the constructor would be free to extend anything else.

Because methods from the class with the private definitions is not inherited, some extra work will be needed to copy it's methods (which are able to access the private fields) into the constructor function's `prototype`.

**class version**

```javascript
class MyClass {

  #myPrivateField = 1
  
  myMethod () {
    return this.#myPrivateField
  }
}
```

**constructor version**

```javascript
function SetThis (target) {
  return target
}

class MyPrivateProvider extends SetThis {

  #myPrivateField = 1
  
  myMethod () {
    return this.#myPrivateField
  }
  
  constructor (target) {
    super(target)
  }
}

function MyClass () {
  new MyPrivateProvider(this)
}

Reflect.ownKeys(MyPrivateProvider.prototype)
  .forEach(method => {
    if (method !== 'constructor') 
      MyClass.prototype[method] = MyPrivateProvider.prototype[method]
})
```

In this particular case, we're able to continue to MyClass's constructed `this` value because we're not inheriting from another class; MyClass is a simple base class. The MyPrivateProvider class only exists to initialize an object with private variables, not to serve as a superclass.

The first step is passing MyClass's `this` into the MyPrivateProvider constructor.  We don't care what it returns (which will ultimately be the same `this`).  We're only using the constructor as a way to modify an existing value.

```javascript
function MyClass () {
  new MyPrivateProvider(this)
}
```

MyPrivateProvider has the private fields and necessary methods for accessing those fields as part of its own definition.  Private fields will get initialized on the constructor's `this` value after `super()` is called - `super()` being what defines what `this` is.  Because `super()` does this, we use the special SetThis superclass to set the `this` of MyPrivateProvider to whatever it passes it, which in this case would be the `this` from MyClass.

```javascript
function SetThis (target) {
  return target
}
```

This means when the MyPrivateProvider initializes its `this` with private variables, its actually initializing the MyClass instance it was given as `target`.

```javascript
  constructor (target) {
    super(target) // super is SetThis, target becomes this
  }
```

The initialization of `this` here in MyPrivateProvider does not include setting up the inheritance connections for the instance.  That would have happened in the base class, SetThis, which we overrode by returning `target` (the `this` in SetThis would have had inheritance set to inherit from MyPrivateProvider).  So in order for the MyClass instance to gain access to the MyPrivateProvider methods that can access the private fields defined there, they need to be copied over into MyClass.

```javascript
Reflect.ownKeys(MyPrivateProvider.prototype)
  .forEach(method => {
    if (method !== 'constructor') 
      MyClass.prototype[method] = MyPrivateProvider.prototype[method]
})
```

There is one small catch to this approach.  If you remember from earlier, `super` in methods refers to a `[[HomeObject]]` slot that points to its prototype of origin.  This means that any uses of `super` in MyPrivateProvider would refer to methods in SetThis, not MyClass's superclass, if it had one.
