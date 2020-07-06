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
* can be async
* can be generator
* can be async generator

### Function from constructor
Since: ES1

```javascript
new Function();
```

* callable
* constructable (non async/generator)
* can be async
* can be generator
* can be async generator
* anonymous

### Function expression
Since: ES3

```javascript
(function name () {})
```

* callable
* constructable (non async/generator)
* can be async
* can be generator
* can be async generator
* naming optional

### Getter/setter
Since: ES5

```javascript
{
    get name () {},
    set name () {}
};
```

* callable (through property access or assignment)
* can use super()

### Method
Since: ES2015

```javascript
{
    name () {}
};
```

* callable
* can be async
* can be generator
* can be async generator
* can use super()

### Arrow Function
Since: ES2015

```javascript
() => {};
```

* callable
* can be async
* uses parent scope's this/super/arguments/new.target
* anonymous

### Class
Since: ES2015

```javascript
class name {
    constructor () {}
}
```

* constructable
* naming optional
