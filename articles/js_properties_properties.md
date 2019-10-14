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
  - configurable
  - enumerable
  
- class members
  - fields are instance own, enumerable
  - methods are instance inherited, non-enumerable
  - static fields are constructor own, enumerable
  - static methods are constructor inherited, non-enumerable
  - static and instance members are inherited with extends
 
 - global object declarations
   - function
   - var
   - var vs assignment
   - var on top of pre-existing assignment (does not change)

- a property of objects for object properties
  - preventExtensions ([[Extensible]])
  - seal ([[Extensible]] = false + all props: non-configurable)
  - freeze ([[Extensible]] = false + all props: non-configurable, non-writable)
  
