# WIP

# Kinds of Functions and Their Differences

## Summary

### Function declaration
Since: ES1

```javascript
function name () {}
```

* hoisted
* callable
* constructable (non async/generator)
* (Since: ES2015) can be generator
* (Since: ES2017) can be async
* (Since: ES2018) can be async generator
* can be anonymous (in export default statement only)

### Function from constructor
Since: ES1

```javascript
new Function();
```

* callable
* constructable (non async/generator)
* (Since: ES2015) can be generator (GeneratorFunction)
* (Since: ES2017) can be async (AsyncFunction)
* (Since: ES2018) can be async generator (AsyncGeneratorFunction)
* anonymous
* name set to "anonymous"

### Function expression
Since: ES3

```javascript
(function name () {})
```

* callable
* constructable (non async/generator)
* (Since: ES2015) can be generator
* (Since: ES2017) can be async
* (Since: ES2018) can be async generator
* naming optional
* explicit name is locally scoped
* (Since: ES2015) name can be assigned implicitly (or '' if anonymous)

### Getter/setter
Since: ES5

```javascript
{
    get name () {},
    set name (value) {}
};
```

* callable (through property access [get] or assignment [set])
* (Since: ES2015) can use super
* no prototype

### Method
Since: ES2015

```javascript
{
    name () {}
};
```

* callable
* can be generator
* (Since: ES2017) can be async
* (Since: ES2018) can be async generator
* can use super
* no prototype (unless a generator)

### Arrow Function
Since: ES2015

```javascript
() => {};
```

* callable
* (Since: ES2017) can be async
* uses parent scope's this/super/arguments/new.target
* anonymous
* name can be assigned implicitly (or '')
* no prototype
* supports implicit returns

### Class
Since: ES2015

```javascript
class name {
    constructor () {}
}
```

* constructable
* naming optional
* explicit name is locally scoped
* name can be assigned implicitly (or '' if anonymous)
* can use super (both super() and super.method())

---

## Specifics

### Function declaration



---

### Table

* hoisted
* callable
* constructable (1)
* can be generator
* can be async
* can be async generator
* own this/super/arguments/new.target
* named [Yes | No | Optional]
* name binding locally scoped
* name can be assigned implicitly (2, 3)
* can use super
* prototype (4)
* implicit returns

1) async, generator, and async generator functions can't be constructors
2) constructor: anonymous name = "anonymous"
3) expression, arrow, class: anonymous name = ""
4) methods: only have a prototype when generators
