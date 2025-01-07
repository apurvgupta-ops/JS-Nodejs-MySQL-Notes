
# JavaScript Methods Overview

This document provides an overview of the most commonly used methods in JavaScript for `Map`, `Object`, `Array`, `Set`, and `String`.

---

## Map Methods

### 1. `set(key, value)`
- Adds or updates a key-value pair to the `Map`.

```javascript
const map = new Map();
map.set('a', 1);
map.set('b', 2);
```

### 2. `get(key)`
- Retrieves the value associated with the specified key.

```javascript
const map = new Map();
map.set('a', 1);
console.log(map.get('a')); // 1
```

### 3. `has(key)`
- Returns `true` if the `Map` contains the specified key.

```javascript
const map = new Map();
map.set('a', 1);
console.log(map.has('a')); // true
```

### 4. `delete(key)`
- Removes the key-value pair for the specified key.

```javascript
const map = new Map();
map.set('a', 1);
map.delete('a');
console.log(map.has('a')); // false
```

### 5. `clear()`
- Clears all key-value pairs from the `Map`.

```javascript
const map = new Map();
map.set('a', 1);
map.clear();
console.log(map.size); // 0
```

### 6. `size`
- Returns the number of key-value pairs in the `Map`.

```javascript
const map = new Map();
map.set('a', 1);
console.log(map.size); // 1
```

### 7. `keys()`, `values()`, `entries()`
- Return iterators for the keys, values, and entries.

```javascript
const map = new Map();
map.set('a', 1);
console.log([...map.keys()]); // ['a']
console.log([...map.values()]); // [1]
console.log([...map.entries()]); // [['a', 1]]
```

---

## Object Methods

### 1. `Object.keys()`
- Returns an array of a given object's own property names.

```javascript
const obj = { a: 1, b: 2 };
console.log(Object.keys(obj)); // ['a', 'b']
```

### 2. `Object.values()`
- Returns an array of a given object's own property values.

```javascript
const obj = { a: 1, b: 2 };
console.log(Object.values(obj)); // [1, 2]
```

### 3. `Object.entries()`
- Returns an array of a given object's own enumerable string-keyed property `[key, value]` pairs.

```javascript
const obj = { a: 1, b: 2 };
console.log(Object.entries(obj)); // [['a', 1], ['b', 2]]
```

### 4. `Object.assign()`
- Copies values from one or more source objects to a target object.

```javascript
const target = { a: 1 };
const source = { b: 2 };
Object.assign(target, source);
console.log(target); // { a: 1, b: 2 }
```

### 5. `Object.fromEntries()`
- Converts a list of key-value pairs into an object.

```javascript
const entries = [['a', 1], ['b', 2]];
console.log(Object.fromEntries(entries)); // { a: 1, b: 2 }
```

---

## Array Methods

### 1. `push()`
- Adds new elements to the end of an array and returns the new length.

```javascript
const arr = [1, 2];
arr.push(3);
console.log(arr); // [1, 2, 3]
```

### 2. `pop()`
- Removes the last element from an array and returns that element.

```javascript
const arr = [1, 2, 3];
arr.pop();
console.log(arr); // [1, 2]
```

### 3. `shift()`
- Removes the first element from an array and returns that element.

```javascript
const arr = [1, 2, 3];
arr.shift();
console.log(arr); // [2, 3]
```

### 4. `unshift()`
- Adds one or more elements to the beginning of an array.

```javascript
const arr = [1, 2];
arr.unshift(0);
console.log(arr); // [0, 1, 2]
```

### 5. `forEach()`
- Executes a provided function once for each array element.

```javascript
const arr = [1, 2, 3];
arr.forEach(element => console.log(element)); // 1 2 3
```

### 6. `map()`
- Creates a new array populated with the results of calling a provided function on every element in the array.

```javascript
const arr = [1, 2, 3];
const doubled = arr.map(x => x * 2);
console.log(doubled); // [2, 4, 6]
```

### 7. `filter()`
- Creates a new array with all elements that pass the test implemented by the provided function.

```javascript
const arr = [1, 2, 3];
const filtered = arr.filter(x => x > 1);
console.log(filtered); // [2, 3]
```

---

## Set Methods

### 1. `add()`
- Adds a new element to the `Set`.

```javascript
const set = new Set();
set.add(1);
console.log(set); // Set { 1 }
```

### 2. `has()`
- Returns `true` if the `Set` contains the specified value.

```javascript
const set = new Set();
set.add(1);
console.log(set.has(1)); // true
```

### 3. `delete()`
- Removes the specified value from the `Set`.

```javascript
const set = new Set();
set.add(1);
set.delete(1);
console.log(set.has(1)); // false
```

### 4. `clear()`
- Removes all elements from the `Set`.

```javascript
const set = new Set();
set.add(1);
set.clear();
console.log(set); // Set {}
```

### 5. `size`
- Returns the number of elements in the `Set`.

```javascript
const set = new Set();
set.add(1);
console.log(set.size); // 1
```

---

## String Methods

### 1. `charAt()`
- Returns the character at a specified index.

```javascript
const str = "Hello";
console.log(str.charAt(1)); // 'e'
```

### 2. `concat()`
- Joins two or more strings and returns a new string.

```javascript
const str1 = "Hello";
const str2 = "World";
console.log(str1.concat(" ", str2)); // "Hello World"
```

### 3. `includes()`
- Checks if a string contains a specified substring.

```javascript
const str = "Hello World";
console.log(str.includes("World")); // true
```

### 4. `indexOf()`
- Returns the index of the first occurrence of a specified value.

```javascript
const str = "Hello World";
console.log(str.indexOf("World")); // 6
```

### 5. `slice()`
- Extracts a section of a string and returns it as a new string.

```javascript
const str = "Hello World";
console.log(str.slice(0, 5)); // "Hello"
```

### 6. `toLowerCase()`
- Returns a new string with all characters in lowercase.

```javascript
const str = "Hello World";
console.log(str.toLowerCase()); // "hello world"
```

### 7. `toUpperCase()`
- Returns a new string with all characters in uppercase.

```javascript
const str = "Hello World";
console.log(str.toUpperCase()); // "HELLO WORLD"
```

### 8. `trim()`
- Removes whitespace from both ends of a string.

```javascript
const str = "  Hello World  ";
console.log(str.trim()); // "Hello World"
```

---

# Summary

- **Map Methods**: `set()`, `get()`, `has()`, `delete()`, `clear()`, `keys()`, `values()`, `entries()`, `forEach()`
- **Object Methods**: `Object.keys()`, `Object.values()`, `Object.entries()`, `Object.assign()`, `Object.fromEntries()`
- **Array Methods**: `push()`, `pop()`, `shift()`, `unshift()`, `forEach()`, `map()`, `filter()`
- **Set Methods**: `add()`, `has()`, `delete()`, `clear()`
- **String Methods**: `charAt()`, `concat()`, `includes()`, `indexOf()`, `slice()`, `toLowerCase()`, `toUpperCase()`, `trim()`
