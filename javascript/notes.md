# JavaScript Notes
- _Check This link for code_ => https://github.com/procodrr/javascript-course

### 1. **About JavaScript**
 Previously, JavaScript was an interpreted language. After the Chrome V8 engine, it became JIT (Just-In-Time) compiled.
- **Interpreter**: Reads code line by line and converts it into binary code, which results in slower execution.
- **Compiler**: Reads the whole code and converts it into binary code, making execution faster.
- JavaScript follows **BODMAS** for calculations. However, for addition and subtraction, it follows a **first-come-first-serve** rule.
  - Example: `console.log(5 + 6 - 4 / 2 * 2)` outputs `7`.
  - Example: `console.log(5 - 6 + 2)` outputs `1`.

---
### 2. **Data Types** (Primitive or Value types)
- **Types**: `Number`, `String`, `Boolean`, `Undefined`, `Null`, `BigInt`, `Symbol`.
- To check the data type, use the `typeof` operator.
- **Examples**:
  - Convert string to number: `+'100'` → `100`.
  - Convert number to string: `100 + ''` → `'100'`.
  - `parseInt('100')` → `100`. If the string contains characters after the number, it gives `NaN` (e.g., `parseInt('100abc') 
  - `typeof NaN` → `Number`.
  - `typeof null` → `Object` **Bug in JavaScript**.
  - `String` has indexed values like `const a = "Apurv"` then `a[0] = 'A'`  

---

### 3. **Variable Declarations**
- `var`, `let`, and `const` are used to declare variables, but their behavior differs:
  - **const**: Used for constants. Value cannot be changed. Block scope.
  - **let**: Value can be changed. Block scope.
  - **var**: Value can be changed. Function scope.
  - All the variables created with let and const goes to script scope and var goes window obj.

- ***_Why we can change the value of let but not const ?_***
  - Because when we try to change the value in the const it say cant change the value of constant, but in case of let when we try to change the value it basically change the address of that value.
  - `let a = "Apurv"` then `a = "Appu"`, so in this it change the address.

---

### 4. **Code Execution Process**
1. JavaScript executes code line by line.
2. Execution consists of two phases:
   - **Memory Creation Phase**: Variables (`var`, `let`, `const`) are initialized with `undefined`.
   - **Code Execution Phase**: Values are assigned to variables.

---

### 5. **Dialog Boxes**
- **Types**:
  - `alert`: Displays a message, no return value.
  - `confirm`: Displays a message with `OK` and `Cancel` buttons. Returns a boolean.
  - `prompt`: Displays an input box with `OK` and `Cancel`. Returns the input value or `null` if canceled.

---

### 6. **String Methods and Properties**
- See the [string.html](#) file.

---

### 7. **Math**
- See the [math.html](#) file.

---

### 8. **Truthy and Falsy Values**
- **Falsy Values**: `0`, `-0`, `""`, `undefined`, `null`, `NaN`.
- **Truthy Values**: All other values.
- **Examples**:
  - `Boolean(10)` → `true`.
  - `!!10` → `true`.
  - `!!''` → `false`.

---

### 9. **If/Else**
- See the [ifelse.js](#) file.

---

### 10. **Switch Case**
- See the [switchcase.js](#) file.

---

### 11. **Viewing Variable Addresses in Dev Tools**
- Use the **Memory** tab in DevTools (Inspect mode) to see variable addresses.
- Notes:
  - Default values like `undefined`, `null`, and `true/false` have predefined addresses.
  - Variables with identical values may share the same address.
  - Objects have different address, weather they are nested objects.
  

---

### 12. **Objects** (Non-Primitive or Reference types)
- See the [object.js](./js/object.js) file.
- **_Properties :_**
  - **delete** is used to remove any key from the object => delete user.name
  - `"name" in demo1` This is used to check mentioned property is in that object or not , return boolean.
- **_Methods :_**
  - `Object.seal()` = It basically used for not to add or delete any value from the object, but we can change the existing values.
  - `Object.freeze()` = It basically used to not add, delete or change any value in the object.
  - ***_Shallow copy vs Deep copy :_***
  - **How it works** => Basically when we create the object the js engine assign some address, and then when we change something in the object the value get change but not the address. Now in case of copy the object, js basically copy the address and assign the same address to another object.
  - Suppose we have a object with three nested objects , now when we do shallow copy it basically copy the whole object but in this we can only change the parent object properties. Because when js copy the object it copy the address of the nested object that's why if we change the value in the nested object they change in the original one also.
  - In case of deep copy it copy the object and assign to the new address, that's why we can change any value and it not effect the original one.
  -  ```javascript
        const demo = { @123
        name: "Apurv",
        age: 24,
        address: { @456
          street: "Balaji Tower",
          landmark: "Vivacity",
          personal: { @789
            ph: "1234567890",
          },
        },
      };

      So when js copy the obj it copy the address to in shallow copy. 
      AND THIS IS THE SAME PHENOMENA APPLY IN ARRAY'S.
  - `Object.assign(jisme copy krna h, jisko copy krna h)`
  - `Spread Operator (...) => const newObj = {...obj}`

---

### 13. **Array**
- Behind the scene array is also an object.
- **_Properties :_**
  - `length` : to check the length of an array.
- **_Methods :_**
  - `Push(x,y,...)` :  To add an element at the last, return length.
  - `Pop()` :  To remove an element from the last.
  - `shift()` : remove the element from the start.
  - `unshift(x,y,...)` : add the element at the start, return length
  - `indexof(x)`: give index to passed element. 
  - `concat(x,y)`: combine two or more array, return new array.
  - `includes(x)` : check x is present in the array or not, return boolean. 
  - `sort()`: Sort basically sort the data according to the strings, weather it is number or string. 
  - `reverse()` : it reverse the whole array.
  - `slice(x, ?y)` : It provide the data according to x and y. x is implisit and y is explisit, return new array.  
  - `splice(?x, ?deleteCount, ?...item)` : It basically give the new array , x is starting index, deleteCount is for how many things you want to delete, and items is for add the item in an array at the place of deleted items.
- See the [Arrays](./js/array.js) file.


---

### 14. **Functions**
- It basically means i collection of logics which we want to use so many time in our system.
- if functions has no return statement, then they return _undefined_.
- See the [functions](./js/functions.js) file.

---

### 15. **Execution context and call stack**
- See the [Hand Written notes](./Jsnotes.pdf) file.

---

### 16. **Hoisting**
- This is the process in which js  appers to move the variable at the top is called hoisting.
  - This is not the js functionality, users create this phenomenon. 
  - `Temporal dead zone :` when we create the variable with let and const, then js put those variable in a zone(_the zone where we can't access variables before inilization_) called TDZ.

---

### 17. **Global Scope vs Local Scope**
- Global scope is a combination of two scops script and window obj. 
- `Lexical Scope :` Suppose we have one child function, the scope that function is there own scope, there parent scope and then global scope is called lexical scope of that function.
- **`Clouser :`** we declear the variables in the parent function but we can access these variables in the child and innerChild function, those variables we are using from parent function in the subfunction those variables form the `clousers`. 
- ```javascript
  function parent() {
    const a = 10;
    const b = 100;
    const c = 1000;

    function child() {
      console.log(a);

      function innerChild() {
        console.log(b);
      }
    }
    child();
  }
  parent();

- All the variables created with let and const goes to script scope and var goes window obj.

---

### 18. **Higher order functions and callbacks** 
- Higher order functions are those functions in which we pass another function and return a function. The passed function as an argument is called callback function.
- callback basically means we pass one function as an argument then the HOF call that functions as per the need.
- ```javascript
  function parent(func) {
    console.log("hii")
    func()
  }

  parent(function (){ // callback function
    console.log("hello")
  });
 
---

### 19. setTimeout vs setInterval
- See the [Hand Written notes](./Jsnotes.pdf) file.
- See the [setTimeoutVSSetInterval](./js/setTimeoutVSsetInterval.js) file.

---

### 20. Spread vs Rest
- See the [Spread Vs Rest](./js/spreadVSrest.js) file.

---


### 21. Events
- Events do not only exist in JavaScript but in all programming languages. The primary idea behind events in JavaScript is the ability to run code when a certain event happens. This could be a user clicking a button or any other events you might think of that could trigger some code to run.

---

### 22. Event Handlers
- Event handlers are like a special all-purpose remote control that can perform certain actions like changing channels on your TV, increasing the temperature of your AC, and changing the state of your lighting in your home. But they need a professional to handle a special button attached to it.

- The above analogy explains the concepts of event handling in JavaScript. The remote control represents the application you are using. The HTML element-like button on the application is the special button attached to the remote. And the professional that handles the special button is the JavaScript.

---

### 23. Event Bubbling
- Event Bubbling is a process in which when we click on child element it parent element is also clicked upto global window object.

---

### 24. Event Capturing
- Event Capturing is a process in which when we click on child element its parent element also get trigger and first parent calls then child element.


---

### 25. Promises and Async/await
- See the [Hand Written notes](./Jsnotes.pdf) file.
- See the [Promises](./js/promises.js) file.
- The difference is that in an async function, JavaScript will pause the function execution until the promise settles. With then(), the rest of the function will continue to execute but JavaScript won't execute the .then() callback until the promise settles.


---

## Useful methods for all the Objects , Array and Map etc.
- See the [Md file](./javascript_methods_overview.md)