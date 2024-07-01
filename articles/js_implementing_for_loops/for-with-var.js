/**
 * Represents a JavaScript scope.
 */
class Scope {

  /**
   * A reference to this scope's outer scope.
   */
  outer

  /**
   * The variables defined in this scope along with their values.
   */
  variables = new Map()

  /**
   * Creates a new scope.
   */
  constructor(outer = null) {
    this.outer = outer
  }

  /**
   * Creates a new variable in this scope. A variable must be created
   * before it's value can be accessed or set.
   */
  createVariable(name, initialValue = undefined) {
    this.variables.set(name, initialValue)
  }
  
  /**
   * Gets a variable from this scope, or if this scope doesn't have
   * the variable defined, one of its parent scopes. If this or any
   * of the parent scopes doesn't have the variable, an error is
   * thrown.
   */
  getVariableValue(name) {
    if (this.variables.has(name)) {
      return this.variables.get(name)
    }
    if (this.outer) {
      return this.outer.getVariableValue(name)
    }
    throw new Error(`${name} is not defined`)
  }
  
  /**
   * Sets a variable in this scope, or if this scope doesn't have
   * the variable defined, one of its parent scopes. If this or any
   * of the parent scopes doesn't have the variable, an error is
   * thrown.
   */
  setVariableValue(name, value) {
    if (this.variables.has(name)) {
      this.variables.set(name, value)
      return
    }
    if (this.outer) {
      this.outer.setVariableValue(name, value)
      return
    }
    throw new Error(`${name} is not defined`)
  }
}

// A variable to track the currently active scope as we go through
// executing code.
let currentScope

// Our first scope is the global scope. It has no outer scope and
// becomes the first currentScope.
const globalScope = new Scope()
currentScope = globalScope

// The var declaration in the loop initialization creates the i
// variable in the current scope.
currentScope.createVariable("i")

// Functions representing the code run in each part of the for loop
// declaration: initialization (init), condition (test), afterthought
// (inc), and body statement (body).
const forInit = () => currentScope.setVariableValue("i", 0)
const forTest = () => currentScope.getVariableValue("i") < 3
const forInc = () => currentScope.setVariableValue("i", currentScope.getVariableValue("i") + 1)
const forBody = () => console.log(currentScope.getVariableValue("i"))

// Run the initialization for the loop setting the initial value of
// the i variable to 0.
forInit()

// Perform the looping. 
while (true) {

  // First check if the loop condition is no longer true. If so, exit
  // the loop.
  if (!forTest()) {
    break;
  }

  // Because the loop had a block for its body, a new block scope is
  // created for that block.
  const blockOuterScope = currentScope
  const blockScope = new Scope(blockOuterScope)
  currentScope = blockScope

  // Run the body of the loop which, in this case, logs the value of i.
  forBody()

  // At the end of the body, its block scope is restored to the
  // previous scope (globalScope).
  currentScope = blockOuterScope

  // Finally the afterthought can run updating the value of i. This
  // new value will be the seen when the loop continues and runs
  // forTest() in the next iteration.
  forInc()
}
