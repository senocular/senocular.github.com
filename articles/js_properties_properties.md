| Status |
| --- |
| Work in progress |

# The Hidden Properties of Properties

Notes:

- properties
  - key (string or symbol)
  - value
  - inherited vs own
  
- property descriptor
  - value vs get/set
  - writable (vs setter)
    - applies to inherited properties
    - can bypass writable using define (vs assign)
  - configurable
    - doesn't apply to inherited properties
    - false: cannot delete
    - false: cannot change with defineProperty
  - enumerable
    - applies to inherited properties
    - object.propertyIsEnumerable()
  - defineProperty defaults: {writable: false, enumerable: false, configurable: false}

- a property of objects for object properties
  - preventExtensions ([[Extensible]])
    - Object.preventExtensions(), Object.isExtensible()
  - seal ([[Extensible]] = false + all props: non-configurable)
    - Object.seal(), Object.isSealed()
  - freeze ([[Extensible]] = false + all props: non-configurable + all data props: non-writable)
    - Object.freeze(), Object.isFrozen()
    - freeze overrides non-configurable to set non-writable

- class members
  - fields are instance own, enumerable, defined
  - methods are instance inherited, non-enumerable, defined
  - static fields are constructor own, enumerable, defined
  - static methods are constructor inherited, non-enumerable, defined
  - static and instance members are inherited with extends
 
 - global object declarations
   - function
   - var
   - var vs assignment
     - var {writable: true, enumerable: true, configurable: false}
     - assignment {writable: true, enumerable: true, configurable: true}
   - var on top of pre-existing assignment (does not change)
   
 - other declarations
   - characteristics not exposed
   - const ~ non-writable
   - class, const, let cannot redeclare ~ non-configurable
   - inherently non-enumerable
   - strict mode ~ non-extensible
  
