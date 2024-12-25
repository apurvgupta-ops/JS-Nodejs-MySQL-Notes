# JavaScript Notes

## 1. **About JavaScript**
- Previously, JavaScript was an interpreted language. After the Chrome V8 engine, it became JIT (Just-In-Time) compiled.
- **Interpreter**: Reads code line by line and converts it into binary code, which results in slower execution.
- **Compiler**: Reads the whole code and converts it into binary code, making execution faster.
- JavaScript follows **BODMAS** for calculations. However, for addition and subtraction, it follows a **first-come-first-serve** rule.
  - Example: `console.log(5 + 6 - 4 / 2 * 2)` outputs `7`.
  - Example: `console.log(5 - 6 + 2)` outputs `1`.

---

## 2. **Data Types** (Primitive)
- **Types**: `Number`, `String`, `Boolean`, `Undefined`, `Null`, `BigInt`, `Symbol`.
- To check the data type, use the `typeof` operator.
- **Examples**:
  - Convert string to number: `+'100'` → `100`.
  - Convert number to string: `100 + ''` → `'100'`.
  - `parseInt('100')` → `100`. If the string contains characters after the number, it gives `NaN` (e.g., `parseInt('100abc')`).
- **Bugs in JavaScript**:
  - `typeof NaN` → `Number`.
  - `typeof null` → `Object`.

---

## 3. **Variable Declarations**
- `var`, `let`, and `const` are used to declare variables, but their behavior differs:
  - **const**: Used for constants. Value cannot be changed. Block scope.
  - **let**: Value can be changed. Block scope.
  - **var**: Value can be changed. Function scope.

---

## 4. **Code Execution Process**
1. JavaScript executes code line by line.
2. Execution consists of two phases:
   - **Memory Creation Phase**: Variables (`var`, `let`, `const`) are initialized with `undefined`.
   - **Code Execution Phase**: Values are assigned to variables.

---

## 5. **Dialog Boxes**
- **Types**:
  - `alert`: Displays a message, no return value.
  - `confirm`: Displays a message with `OK` and `Cancel` buttons. Returns a boolean.
  - `prompt`: Displays an input box with `OK` and `Cancel`. Returns the input value or `null` if canceled.

---

## 6. **String Methods and Properties**
- See the [string.html](#) file.

---

## 7. **Math**
- See the [math.html](#) file.

---

## 8. **Truthy and Falsy Values**
- **Falsy Values**: `0`, `-0`, `""`, `undefined`, `null`, `NaN`.
- **Truthy Values**: All other values.
- **Examples**:
  - `Boolean(10)` → `true`.
  - `!!10` → `true`.
  - `!!''` → `false`.

---

## 9. **If/Else**
- See the [ifelse.js](#) file.

---

## 10. **Switch Case**
- See the [switchcase.js](#) file.

---

## 11. **Viewing Variable Addresses in Dev Tools**
- Use the **Memory** tab in DevTools (Inspect mode) to see variable addresses.
- Notes:
  - Default values like `undefined`, `null`, and `true/false` have predefined addresses.
  - Variables with identical values may share the same address.

---

## 12. **Objects**
- 
