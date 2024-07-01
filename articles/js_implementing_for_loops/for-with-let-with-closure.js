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

// Here is when the loop is encountered. The first step, given a let
// is recognized in the initialization, is to create a new scope for
// the loop that is a child of the current scope.
const loopOuterScope = currentScope
const loopScope = new Scope(loopOuterScope)

// We also need to keep track of all the variables created in the
// loop initialization expression. This will most likely just be a
// list with a single variable as seen here with ["i"]. You could
// have more if, for example, your loop was defined as:
// for (let i = 0, n = 3; i < n; i++) ...
// In the above case the variable list would be ["i", "n"].
const iterationVariables = ["i"]

// The tracked variables are created in the new loopScope. These
// variables aren't referenced except for the first iteration of the
// loop when they are copied from this scope into iterationScope.
// Other iteration scopes beyond the first copy variables from the
// previous iterationScope.
for (const varName of iterationVariables) {
  loopScope.createVariable(varName)
}

// The following functions encapsulate the code run in each part of
// the for loop declaration: initialization (init), condition (test),
// afterthought (inc), and statement (body).
const forInit = () => currentScope.setVariableValue("i", 0)
const forTest = () => currentScope.getVariableValue("i") < 3
const forInc = () => currentScope.setVariableValue("i", currentScope.getVariableValue("i") + 1)
const forBody = () => {

  // In the function body a function is created and passed in to
  // setTimeout. This function simply logs i from the current scope.
  const func = () => {
    console.log(currentScope.getVariableValue("i"))
  }

  // When you create a function in JavaScript, you're also creating
  // a closure. A closure is a combination of a function with its
  // surrounding environment, or scope. We'll encapsulate that
  // behavior in wrapper function that saves the current scope - the
  // scope in which the function was created - and handles the
  // creation of the local scope for that function when its called.
  const closure = () => {

    // Save the current scope at the time the function was called.
    const callScope = currentScope

    // Create a new local scope for the function which is a child
    // scope of the closure scope saved with the closure when the
    // function was created. This becomes the current scope for the
    // function call.
    const localScope = new Scope(closure.scope)
    currentScope = localScope

    // Call the function this closure wraps.
    func()

    // Restore the scope back to the original scope from call time.
    currentScope = callScope
  }

  // Assign the surrounding scope to the closure as a property of the
  // closure function.
  closure.scope = currentScope

  // The code of the loop body passes the closure into setTimeout.
  setTimeout(closure)
}

// As we start to run code, currentScope is set to loopScope.
currentScope = loopScope

// Run the initialization for the loop setting the initial value of
// the i variable to 0. For now this is happening in loopScope and
// not for any specific loop iteration.
forInit()

// A variable tracks the current iteration's scope as we go through
// each loop iteration.
let iterationScope

// This is the first iteration scope. Despite being created after
// loopScope, it gets created under loopScope's parent (global) as a
// sibling to loopScope rather than under loopScope itself. Once it's
// created it creates variables for each of the tracked
// iterationVariables list and sets them to an initial value of the
// variable of the same name from the current scope, which right now
// is loopScope and the values they currently have are the
// values initialized from forInit().
iterationScope = new Scope(currentScope.outer)
for (const varName of iterationVariables) {
  const lastValue = currentScope.getVariableValue(varName)
  iterationScope.createVariable(varName, lastValue)
}

// After the iteration scope is created, it becomes the current
// scope.
currentScope = iterationScope

// Perform the looping.
while (true) {

  // First check if the loop condition is no longer true. If so, exit
  // the loop.
  if (!forTest()) {
    break;
  }

  // Because the loop had a block for its body, a new scope is
  // created for that block.
  const blockOuterScope = currentScope
  const blockScope = new Scope(blockOuterScope)
  currentScope = blockScope

  // Run the body of the loop which in this case logs the value of i.
  forBody()

  // At the end of the body, its block scope is restored to the
  // previous scope which was iterationScope.
  currentScope = blockOuterScope

  // Next the next iteration's scope is created. Like with the
  // first iteration, variables from iterationVariables are created
  // for this scope, but in this case their initial values are coming
  // from the previous iterationScope rather than loopScope since the
  // previous iterationScope is now currentScope. Also, as before,
  // this scope is a child of the parent of currentScope (global)
  // rather than currentScope (iterationScope).
  iterationScope = new Scope(currentScope.outer)
  for (const varName of iterationVariables) {
    const lastValue = currentScope.getVariableValue(varName)
    iterationScope.createVariable(varName, lastValue)
  }
  
  // Now initialized, he new, next iterationScope is now becomes
  // currentScope.
  currentScope = iterationScope

  // With the new iterationScope available, the afterthought can run
  // updating the value of i for the new scope. This will be what's
  // seen when the loop continues and runs forTest() for the next
  // iteration.
  forInc()
}

// At the end of the loop restore the scope to the original outer
// scope (global).
currentScope = loopOuterScope
