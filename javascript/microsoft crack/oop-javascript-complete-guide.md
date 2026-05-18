# Object-Oriented Programming in JavaScript - Complete Guide

## Table of Contents
1. [Introduction to OOP in JavaScript](#introduction)
2. [Objects and Properties](#objects-and-properties)
3. [Classes (ES6+)](#classes-es6)
4. [Prototypes and Inheritance](#prototypes-and-inheritance)
5. [The Four Pillars of OOP](#four-pillars)
6. [Advanced Concepts](#advanced-concepts)
7. [Design Patterns](#design-patterns)
8. [Edge Cases and Gotchas](#edge-cases)
9. [Interview Questions](#interview-questions)
10. [Best Practices](#best-practices)

---

## Introduction to OOP in JavaScript

JavaScript is **prototype-based**, not class-based like Java/C++. Classes in ES6+ are syntactic sugar over prototypes.

### Creating Objects - Multiple Ways

```javascript
// 1. Object Literal (Most common)
const person1 = {
    name: 'John',
    age: 30,
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
};

// 2. Constructor Function (Pre-ES6)
function Person(name, age) {
    this.name = name;
    this.age = age;
    this.greet = function() {
        console.log(`Hi, I'm ${this.name}`);
    };
}
const person2 = new Person('Jane', 25);

// 3. Object.create()
const personProto = {
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
};
const person3 = Object.create(personProto);
person3.name = 'Bob';
person3.age = 35;

// 4. ES6 Class (Modern approach)
class PersonClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
}
const person4 = new PersonClass('Alice', 28);

// 5. Factory Function
function createPerson(name, age) {
    return {
        name,
        age,
        greet() {
            console.log(`Hi, I'm ${this.name}`);
        }
    };
}
const person5 = createPerson('Charlie', 32);
```

---

## Objects and Properties

### Property Types

```javascript
const obj = {
    // Data property
    name: 'John',
    
    // Method property
    greet() {
        return `Hello, ${this.name}`;
    },
    
    // Getter
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    },
    
    // Setter
    set fullName(value) {
        [this.firstName, this.lastName] = value.split(' ');
    }
};

// Usage
obj.fullName = 'John Doe';
console.log(obj.fullName); // "John Doe"
console.log(obj.firstName); // "John"
console.log(obj.lastName); // "Doe"
```

### Property Descriptors

```javascript
const person = {
    name: 'John'
};

// Get property descriptor
console.log(Object.getOwnPropertyDescriptor(person, 'name'));
// {
//   value: 'John',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

// Define property with custom descriptor
Object.defineProperty(person, 'age', {
    value: 30,
    writable: false,      // Cannot be changed
    enumerable: false,    // Won't show in for...in
    configurable: false   // Cannot be deleted or reconfigured
});

person.age = 40; // Won't work (strict mode: error)
console.log(person.age); // 30

delete person.age; // Won't work
console.log(person.age); // 30

for (let key in person) {
    console.log(key); // Only "name" (age is not enumerable)
}
```

### Property Attributes

```javascript
const user = {};

// Multiple properties at once
Object.defineProperties(user, {
    firstName: {
        value: 'John',
        writable: true,
        enumerable: true,
        configurable: true
    },
    lastName: {
        value: 'Doe',
        writable: true,
        enumerable: true,
        configurable: true
    },
    fullName: {
        get() {
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            [this.firstName, this.lastName] = value.split(' ');
        },
        enumerable: true,
        configurable: true
    }
});

console.log(user.fullName); // "John Doe"
user.fullName = 'Jane Smith';
console.log(user.firstName); // "Jane"
```

---

## Classes (ES6+)

### Basic Class Syntax

```javascript
class Rectangle {
    // Constructor - called when new instance is created
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    
    // Instance method
    getArea() {
        return this.width * this.height;
    }
    
    // Getter
    get area() {
        return this.width * this.height;
    }
    
    // Setter
    set area(value) {
        this.width = Math.sqrt(value);
        this.height = Math.sqrt(value);
    }
    
    // Static method (called on class, not instance)
    static compare(rect1, rect2) {
        return rect1.getArea() - rect2.getArea();
    }
    
    // Static property (ES2022+)
    static defaultColor = 'blue';
}

// Usage
const rect1 = new Rectangle(10, 5);
console.log(rect1.getArea()); // 50
console.log(rect1.area); // 50

rect1.area = 100;
console.log(rect1.width); // 10

const rect2 = new Rectangle(20, 3);
console.log(Rectangle.compare(rect1, rect2)); // -10
console.log(Rectangle.defaultColor); // "blue"
```

### Class Fields (Public and Private)

```javascript
class BankAccount {
    // Public field
    accountHolder = '';
    
    // Private field (ES2022+)
    #balance = 0;
    #pin = '';
    
    constructor(holder, initialBalance, pin) {
        this.accountHolder = holder;
        this.#balance = initialBalance;
        this.#pin = pin;
    }
    
    // Public method
    deposit(amount) {
        if (amount > 0) {
            this.#balance += amount;
            return true;
        }
        return false;
    }
    
    // Private method
    #validatePin(pin) {
        return this.#pin === pin;
    }
    
    withdraw(amount, pin) {
        if (!this.#validatePin(pin)) {
            throw new Error('Invalid PIN');
        }
        
        if (amount <= this.#balance) {
            this.#balance -= amount;
            return amount;
        }
        
        throw new Error('Insufficient funds');
    }
    
    getBalance(pin) {
        if (!this.#validatePin(pin)) {
            throw new Error('Invalid PIN');
        }
        return this.#balance;
    }
}

const account = new BankAccount('John Doe', 1000, '1234');
account.deposit(500);
console.log(account.getBalance('1234')); // 1500

// These won't work:
// console.log(account.#balance); // SyntaxError
// account.#validatePin('1234'); // SyntaxError
```

### Static Blocks (ES2022+)

```javascript
class DatabaseConnection {
    static #instance = null;
    static #isInitialized = false;
    
    // Static initialization block
    static {
        console.log('DatabaseConnection class loaded');
        this.#isInitialized = true;
    }
    
    constructor() {
        if (DatabaseConnection.#instance) {
            return DatabaseConnection.#instance;
        }
        DatabaseConnection.#instance = this;
    }
    
    static getInstance() {
        if (!this.#instance) {
            this.#instance = new DatabaseConnection();
        }
        return this.#instance;
    }
}
```

---

## Prototypes and Inheritance

### Understanding Prototypes

```javascript
// Every function has a prototype property
function Person(name) {
    this.name = name;
}

// Add method to prototype
Person.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

const john = new Person('John');
const jane = new Person('Jane');

// Both share the same method (memory efficient)
console.log(john.greet === jane.greet); // true

// Prototype chain
console.log(john.__proto__ === Person.prototype); // true
console.log(Person.prototype.__proto__ === Object.prototype); // true
console.log(Object.prototype.__proto__); // null
```

### Prototype Chain Visualization

```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    console.log(`${this.name} is eating`);
};

function Dog(name, breed) {
    Animal.call(this, name); // Call parent constructor
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
    console.log(`${this.name} says woof!`);
};

const buddy = new Dog('Buddy', 'Golden Retriever');
buddy.eat();  // "Buddy is eating"
buddy.bark(); // "Buddy says woof!"

// Prototype chain:
// buddy -> Dog.prototype -> Animal.prototype -> Object.prototype -> null
console.log(buddy instanceof Dog);    // true
console.log(buddy instanceof Animal); // true
console.log(buddy instanceof Object); // true
```

### Class Inheritance (ES6+)

```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        console.log(`${this.name} is eating`);
    }
    
    sleep() {
        console.log(`${this.name} is sleeping`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Must call super() before using 'this'
        this.breed = breed;
    }
    
    bark() {
        console.log(`${this.name} says woof!`);
    }
    
    // Method overriding
    eat() {
        console.log(`${this.name} is eating dog food`);
        super.eat(); // Call parent method
    }
}

class Cat extends Animal {
    constructor(name, color) {
        super(name);
        this.color = color;
    }
    
    meow() {
        console.log(`${this.name} says meow!`);
    }
}

const dog = new Dog('Buddy', 'Labrador');
dog.eat();   // "Buddy is eating dog food" + "Buddy is eating"
dog.bark();  // "Buddy says woof!"
dog.sleep(); // "Buddy is sleeping"

const cat = new Cat('Whiskers', 'orange');
cat.eat();   // "Whiskers is eating"
cat.meow();  // "Whiskers says meow!"
```

---

## The Four Pillars of OOP

### 1. Encapsulation

**Definition:** Bundling data and methods that operate on that data within a single unit.

```javascript
class Employee {
    #salary; // Private field
    #bonus;
    
    constructor(name, salary) {
        this.name = name; // Public
        this.#salary = salary; // Private
        this.#bonus = 0;
    }
    
    // Public interface
    getSalary() {
        return this.#salary;
    }
    
    setSalary(amount) {
        if (amount > 0) {
            this.#salary = amount;
        } else {
            throw new Error('Salary must be positive');
        }
    }
    
    addBonus(amount) {
        if (amount > 0) {
            this.#bonus += amount;
        }
    }
    
    getTotalCompensation() {
        return this.#salary + this.#bonus;
    }
}

const emp = new Employee('John', 50000);
emp.addBonus(5000);
console.log(emp.getTotalCompensation()); // 55000

// Cannot access private fields directly
// console.log(emp.#salary); // SyntaxError
```

#### Encapsulation with Closures (Alternative)

```javascript
function createEmployee(name, salary) {
    // Private variables
    let _salary = salary;
    let _bonus = 0;
    
    // Public interface
    return {
        name, // Public
        
        getSalary() {
            return _salary;
        },
        
        setSalary(amount) {
            if (amount > 0) {
                _salary = amount;
            }
        },
        
        addBonus(amount) {
            if (amount > 0) {
                _bonus += amount;
            }
        },
        
        getTotalCompensation() {
            return _salary + _bonus;
        }
    };
}

const emp = createEmployee('Jane', 60000);
emp.addBonus(10000);
console.log(emp.getTotalCompensation()); // 70000
// No way to access _salary directly
```

---

### 2. Abstraction

**Definition:** Hiding complex implementation details and showing only necessary features.

```javascript
// Abstract class (using new.target)
class Shape {
    constructor() {
        if (new.target === Shape) {
            throw new Error('Cannot instantiate abstract class Shape');
        }
    }
    
    // Abstract method (must be overridden)
    getArea() {
        throw new Error('Method getArea() must be implemented');
    }
    
    getPerimeter() {
        throw new Error('Method getPerimeter() must be implemented');
    }
    
    // Concrete method
    describe() {
        console.log(`This shape has area: ${this.getArea()}`);
        console.log(`This shape has perimeter: ${this.getPerimeter()}`);
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }
    
    getArea() {
        return Math.PI * this.radius ** 2;
    }
    
    getPerimeter() {
        return 2 * Math.PI * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    getArea() {
        return this.width * this.height;
    }
    
    getPerimeter() {
        return 2 * (this.width + this.height);
    }
}

// const shape = new Shape(); // Error: Cannot instantiate abstract class

const circle = new Circle(5);
circle.describe();
// This shape has area: 78.53981633974483
// This shape has perimeter: 31.41592653589793

const rect = new Rectangle(4, 6);
rect.describe();
// This shape has area: 24
// This shape has perimeter: 20
```

#### Interface Pattern (Using Duck Typing)

```javascript
// Interface-like checking
class Vehicle {
    constructor() {
        if (typeof this.start !== 'function') {
            throw new Error('Vehicle must implement start()');
        }
        if (typeof this.stop !== 'function') {
            throw new Error('Vehicle must implement stop()');
        }
    }
}

class Car extends Vehicle {
    start() {
        console.log('Car engine started');
    }
    
    stop() {
        console.log('Car engine stopped');
    }
}

class Bicycle extends Vehicle {
    start() {
        console.log('Pedaling started');
    }
    
    stop() {
        console.log('Stopped pedaling');
    }
}

const car = new Car();
car.start(); // "Car engine started"

const bike = new Bicycle();
bike.start(); // "Pedaling started"
```

---

### 3. Inheritance

**Definition:** Mechanism where a new class inherits properties and methods from an existing class.

```javascript
// Single Inheritance
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    introduce() {
        console.log(`Hi, I'm ${this.name}, ${this.age} years old`);
    }
}

class Student extends Person {
    constructor(name, age, grade) {
        super(name, age);
        this.grade = grade;
    }
    
    study() {
        console.log(`${this.name} is studying`);
    }
    
    // Override parent method
    introduce() {
        super.introduce(); // Call parent method
        console.log(`I'm in grade ${this.grade}`);
    }
}

class Teacher extends Person {
    constructor(name, age, subject) {
        super(name, age);
        this.subject = subject;
    }
    
    teach() {
        console.log(`${this.name} is teaching ${this.subject}`);
    }
}

const student = new Student('Alice', 15, 10);
student.introduce();
// Hi, I'm Alice, 15 years old
// I'm in grade 10

const teacher = new Teacher('Mr. Smith', 35, 'Math');
teacher.introduce(); // Hi, I'm Mr. Smith, 35 years old
teacher.teach();     // Mr. Smith is teaching Math
```

#### Multi-level Inheritance

```javascript
class LivingBeing {
    constructor(name) {
        this.name = name;
    }
    
    breathe() {
        console.log(`${this.name} is breathing`);
    }
}

class Animal extends LivingBeing {
    constructor(name, species) {
        super(name);
        this.species = species;
    }
    
    move() {
        console.log(`${this.name} is moving`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name, 'Canine');
        this.breed = breed;
    }
    
    bark() {
        console.log(`${this.name} is barking`);
    }
}

const dog = new Dog('Buddy', 'Labrador');
dog.breathe(); // From LivingBeing
dog.move();    // From Animal
dog.bark();    // From Dog
```

#### Composition over Inheritance (Mixins)

```javascript
// JavaScript doesn't support multiple inheritance
// Use mixins instead

const canEat = {
    eat(food) {
        console.log(`${this.name} is eating ${food}`);
    }
};

const canWalk = {
    walk() {
        console.log(`${this.name} is walking`);
    }
};

const canSwim = {
    swim() {
        console.log(`${this.name} is swimming`);
    }
};

// Mixin function
function mixin(target, ...sources) {
    Object.assign(target, ...sources);
}

class Person {
    constructor(name) {
        this.name = name;
    }
}

mixin(Person.prototype, canEat, canWalk);

class Fish {
    constructor(name) {
        this.name = name;
    }
}

mixin(Fish.prototype, canEat, canSwim);

const person = new Person('John');
person.eat('pizza'); // John is eating pizza
person.walk();       // John is walking

const fish = new Fish('Nemo');
fish.eat('plankton'); // Nemo is eating plankton
fish.swim();          // Nemo is swimming
```

---

### 4. Polymorphism

**Definition:** Ability of different classes to be treated as instances of the same class through inheritance.

```javascript
class Animal {
    makeSound() {
        console.log('Some generic sound');
    }
}

class Dog extends Animal {
    makeSound() {
        console.log('Woof! Woof!');
    }
}

class Cat extends Animal {
    makeSound() {
        console.log('Meow! Meow!');
    }
}

class Cow extends Animal {
    makeSound() {
        console.log('Moo! Moo!');
    }
}

// Polymorphism in action
function makeAnimalSound(animal) {
    animal.makeSound(); // Same method call, different behavior
}

const animals = [
    new Dog(),
    new Cat(),
    new Cow()
];

animals.forEach(makeAnimalSound);
// Woof! Woof!
// Meow! Meow!
// Moo! Moo!
```

#### Method Overloading (Simulation)

JavaScript doesn't have true method overloading, but we can simulate it:

```javascript
class Calculator {
    add(...args) {
        if (args.length === 2) {
            return args[0] + args[1];
        } else if (args.length === 3) {
            return args[0] + args[1] + args[2];
        } else {
            return args.reduce((sum, num) => sum + num, 0);
        }
    }
    
    // Better approach using rest parameters
    multiply(...numbers) {
        return numbers.reduce((product, num) => product * num, 1);
    }
}

const calc = new Calculator();
console.log(calc.add(5, 3));           // 8
console.log(calc.add(5, 3, 2));        // 10
console.log(calc.add(1, 2, 3, 4, 5));  // 15
console.log(calc.multiply(2, 3, 4));   // 24
```

---

## Advanced Concepts

### 1. Constructor Functions vs Classes

```javascript
// Constructor Function
function PersonConstructor(name, age) {
    this.name = name;
    this.age = age;
}

PersonConstructor.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

// ES6 Class (syntactic sugar)
class PersonClass {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
}

// Both work similarly
const p1 = new PersonConstructor('John', 30);
const p2 = new PersonClass('Jane', 25);

p1.greet(); // Hi, I'm John
p2.greet(); // Hi, I'm Jane

// Key differences:
console.log(typeof PersonConstructor); // "function"
console.log(typeof PersonClass);       // "function" (classes are functions!)

// Classes are not hoisted
// const p3 = new MyClass(); // ReferenceError
// class MyClass {}

// Constructor functions are hoisted
const p4 = new MyFunction(); // Works!
function MyFunction() {}
```

### 2. The 'this' Keyword - All Cases

```javascript
// 1. Global context
console.log(this); // Window (browser) or global (Node.js)

// 2. Function context (regular function)
function regularFunction() {
    console.log(this);
}
regularFunction(); // Window/global (strict mode: undefined)

// 3. Method context
const obj = {
    name: 'Object',
    method() {
        console.log(this); // obj
    }
};
obj.method();

// 4. Constructor context
function Person(name) {
    this.name = name; // 'this' refers to new instance
}
const person = new Person('John');

// 5. Arrow function context (lexical 'this')
const obj2 = {
    name: 'Object',
    regularMethod: function() {
        console.log(this); // obj2
        
        const arrowFunc = () => {
            console.log(this); // obj2 (inherits from parent)
        };
        arrowFunc();
        
        function regularFunc() {
            console.log(this); // Window/undefined
        }
        regularFunc();
    }
};
obj2.regularMethod();

// 6. Event handler context
// <button id="btn">Click me</button>
// document.getElementById('btn').addEventListener('click', function() {
//     console.log(this); // <button> element
// });

// 7. Explicit binding (call, apply, bind)
function greet(greeting) {
    console.log(`${greeting}, I'm ${this.name}`);
}

const person1 = { name: 'John' };
const person2 = { name: 'Jane' };

greet.call(person1, 'Hello');    // Hello, I'm John
greet.apply(person2, ['Hi']);    // Hi, I'm Jane

const boundGreet = greet.bind(person1);
boundGreet('Hey');               // Hey, I'm John
```

### 3. Object.create() - Prototypal Inheritance

```javascript
// Create object with specific prototype
const animalMethods = {
    eat() {
        console.log(`${this.name} is eating`);
    },
    sleep() {
        console.log(`${this.name} is sleeping`);
    }
};

function createAnimal(name, species) {
    const animal = Object.create(animalMethods);
    animal.name = name;
    animal.species = species;
    return animal;
}

const lion = createAnimal('Simba', 'Lion');
lion.eat();   // Simba is eating
lion.sleep(); // Simba is sleeping

console.log(lion.__proto__ === animalMethods); // true
```

### 4. Property Enumeration

```javascript
const obj = {
    a: 1,
    b: 2
};

Object.defineProperty(obj, 'c', {
    value: 3,
    enumerable: false
});

obj.d = 4;

// 1. for...in (includes inherited enumerable properties)
for (let key in obj) {
    console.log(key); // a, b, d (not c)
}

// 2. Object.keys() (only own enumerable properties)
console.log(Object.keys(obj)); // ['a', 'b', 'd']

// 3. Object.getOwnPropertyNames() (all own properties)
console.log(Object.getOwnPropertyNames(obj)); // ['a', 'b', 'c', 'd']

// 4. Object.getOwnPropertySymbols()
const sym = Symbol('symbol');
obj[sym] = 5;
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(symbol)]

// 5. Reflect.ownKeys() (all keys including symbols)
console.log(Reflect.ownKeys(obj)); // ['a', 'b', 'c', 'd', Symbol(symbol)]
```

### 5. Object Immutability

```javascript
const obj = { name: 'John', age: 30 };

// 1. Object.preventExtensions() - Cannot add new properties
Object.preventExtensions(obj);
obj.city = 'NYC'; // Won't work
console.log(obj.city); // undefined
obj.age = 31; // Still works
delete obj.age; // Still works

// 2. Object.seal() - Cannot add/delete properties, but can modify
const sealed = { name: 'Jane', age: 25 };
Object.seal(sealed);
sealed.city = 'LA'; // Won't work
delete sealed.name; // Won't work
sealed.age = 26; // Works!
console.log(sealed); // { name: 'Jane', age: 26 }

// 3. Object.freeze() - Completely immutable (shallow)
const frozen = { name: 'Bob', age: 35 };
Object.freeze(frozen);
frozen.age = 36; // Won't work
delete frozen.name; // Won't work
frozen.city = 'SF'; // Won't work
console.log(frozen); // { name: 'Bob', age: 35 }

// GOTCHA: Freeze is shallow!
const obj2 = {
    name: 'Alice',
    address: {
        city: 'NYC'
    }
};
Object.freeze(obj2);
obj2.name = 'Bob'; // Won't work
obj2.address.city = 'LA'; // Works! (nested object not frozen)
console.log(obj2.address.city); // 'LA'

// Deep freeze function
function deepFreeze(obj) {
    Object.freeze(obj);
    Object.getOwnPropertyNames(obj).forEach(prop => {
        if (obj[prop] !== null
            && (typeof obj[prop] === 'object' || typeof obj[prop] === 'function')
            && !Object.isFrozen(obj[prop])) {
            deepFreeze(obj[prop]);
        }
    });
    return obj;
}

const deepFrozen = {
    name: 'Charlie',
    address: {
        city: 'Boston'
    }
};
deepFreeze(deepFrozen);
deepFrozen.address.city = 'Miami'; // Won't work!
console.log(deepFrozen.address.city); // 'Boston'
```

---

## Design Patterns

### 1. Singleton Pattern

```javascript
class Database {
    static #instance = null;
    #connection = null;
    
    constructor() {
        if (Database.#instance) {
            return Database.#instance;
        }
        
        this.#connection = this.#createConnection();
        Database.#instance = this;
    }
    
    #createConnection() {
        return { connected: true, timestamp: Date.now() };
    }
    
    query(sql) {
        console.log(`Executing: ${sql}`);
        return { success: true };
    }
    
    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }
}

const db1 = new Database();
const db2 = new Database();
const db3 = Database.getInstance();

console.log(db1 === db2); // true
console.log(db2 === db3); // true
```

### 2. Factory Pattern

```javascript
class Car {
    constructor(type) {
        this.type = type;
    }
    
    drive() {
        console.log(`Driving a ${this.type}`);
    }
}

class Bike {
    constructor(type) {
        this.type = type;
    }
    
    ride() {
        console.log(`Riding a ${this.type}`);
    }
}

// Factory
class VehicleFactory {
    static createVehicle(vehicleType, model) {
        switch (vehicleType) {
            case 'car':
                return new Car(model);
            case 'bike':
                return new Bike(model);
            default:
                throw new Error('Unknown vehicle type');
        }
    }
}

const sedan = VehicleFactory.createVehicle('car', 'Sedan');
sedan.drive(); // Driving a Sedan

const motorcycle = VehicleFactory.createVehicle('bike', 'Motorcycle');
motorcycle.ride(); // Riding a Motorcycle
```

### 3. Observer Pattern

```javascript
class Subject {
    constructor() {
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
    }
    
    unsubscribe(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }
    
    notify(data) {
        this.observers.forEach(observer => observer.update(data));
    }
}

class Observer {
    constructor(name) {
        this.name = name;
    }
    
    update(data) {
        console.log(`${this.name} received: ${data}`);
    }
}

// Usage
const subject = new Subject();

const observer1 = new Observer('Observer 1');
const observer2 = new Observer('Observer 2');

subject.subscribe(observer1);
subject.subscribe(observer2);

subject.notify('Hello Observers!');
// Observer 1 received: Hello Observers!
// Observer 2 received: Hello Observers!

subject.unsubscribe(observer1);
subject.notify('Second notification');
// Observer 2 received: Second notification
```

### 4. Module Pattern

```javascript
const CounterModule = (function() {
    // Private variables and functions
    let count = 0;
    
    function logCount() {
        console.log(`Current count: ${count}`);
    }
    
    // Public API
    return {
        increment() {
            count++;
            logCount();
        },
        
        decrement() {
            count--;
            logCount();
        },
        
        getCount() {
            return count;
        },
        
        reset() {
            count = 0;
            logCount();
        }
    };
})();

CounterModule.increment(); // Current count: 1
CounterModule.increment(); // Current count: 2
console.log(CounterModule.getCount()); // 2
CounterModule.reset(); // Current count: 0
```

### 5. Strategy Pattern

```javascript
class PaymentStrategy {
    pay(amount) {
        throw new Error('pay() must be implemented');
    }
}

class CreditCardPayment extends PaymentStrategy {
    constructor(cardNumber) {
        super();
        this.cardNumber = cardNumber;
    }
    
    pay(amount) {
        console.log(`Paid $${amount} using Credit Card ending in ${this.cardNumber.slice(-4)}`);
    }
}

class PayPalPayment extends PaymentStrategy {
    constructor(email) {
        super();
        this.email = email;
    }
    
    pay(amount) {
        console.log(`Paid $${amount} using PayPal account ${this.email}`);
    }
}

class CryptoPayment extends PaymentStrategy {
    constructor(walletAddress) {
        super();
        this.walletAddress = walletAddress;
    }
    
    pay(amount) {
        console.log(`Paid $${amount} using Crypto wallet ${this.walletAddress}`);
    }
}

class ShoppingCart {
    constructor() {
        this.items = [];
        this.paymentStrategy = null;
    }
    
    setPaymentStrategy(strategy) {
        this.paymentStrategy = strategy;
    }
    
    checkout() {
        const total = this.items.reduce((sum, item) => sum + item.price, 0);
        this.paymentStrategy.pay(total);
    }
}

// Usage
const cart = new ShoppingCart();
cart.items = [{ name: 'Book', price: 20 }, { name: 'Pen', price: 5 }];

cart.setPaymentStrategy(new CreditCardPayment('1234567890123456'));
cart.checkout(); // Paid $25 using Credit Card ending in 3456

cart.setPaymentStrategy(new PayPalPayment('user@example.com'));
cart.checkout(); // Paid $25 using PayPal account user@example.com
```

---

## Edge Cases and Gotchas

### 1. Constructor Without 'new'

```javascript
function Person(name) {
    // Safety check
    if (!(this instanceof Person)) {
        return new Person(name);
    }
    
    this.name = name;
}

// Both work now
const p1 = new Person('John');
const p2 = Person('Jane'); // Automatically creates new instance

console.log(p1 instanceof Person); // true
console.log(p2 instanceof Person); // true
```

### 2. Arrow Functions as Methods

```javascript
// BAD: Arrow functions don't have their own 'this'
const person = {
    name: 'John',
    greet: () => {
        console.log(`Hi, I'm ${this.name}`); // 'this' is undefined or global
    }
};

person.greet(); // Hi, I'm undefined

// GOOD: Use regular function
const person2 = {
    name: 'Jane',
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
};

person2.greet(); // Hi, I'm Jane
```

### 3. Method Losing Context

```javascript
class Counter {
    constructor() {
        this.count = 0;
    }
    
    increment() {
        this.count++;
        console.log(this.count);
    }
}

const counter = new Counter();
counter.increment(); // 1

// Problem: Losing context
const inc = counter.increment;
// inc(); // TypeError: Cannot read property 'count' of undefined

// Solution 1: Bind
const boundInc = counter.increment.bind(counter);
boundInc(); // 1

// Solution 2: Arrow function in class field
class Counter2 {
    constructor() {
        this.count = 0;
    }
    
    increment = () => {
        this.count++;
        console.log(this.count);
    }
}

const counter2 = new Counter2();
const inc2 = counter2.increment;
inc2(); // 1 - Works!
```

### 4. Prototype Pollution

```javascript
// DANGEROUS: Don't modify Object.prototype
Object.prototype.polluted = 'This is bad';

const obj = {};
console.log(obj.polluted); // 'This is bad' - Every object has it!

// Clean up
delete Object.prototype.polluted;

// Better: Use Object.create(null) for dictionary-like objects
const safeDict = Object.create(null);
safeDict.key = 'value';
console.log(safeDict.toString); // undefined (no inherited properties)
```

### 5. hasOwnProperty() vs 'in' operator

```javascript
function Parent() {}
Parent.prototype.inheritedProp = 'inherited';

function Child() {
    this.ownProp = 'own';
}
Child.prototype = new Parent();

const child = new Child();

console.log('ownProp' in child);        // true
console.log('inheritedProp' in child);  // true

console.log(child.hasOwnProperty('ownProp'));       // true
console.log(child.hasOwnProperty('inheritedProp')); // false

// Better: Use Object.hasOwn() (ES2022+)
console.log(Object.hasOwn(child, 'ownProp'));       // true
console.log(Object.hasOwn(child, 'inheritedProp')); // false
```

### 6. Class Fields vs Constructor Properties

```javascript
class MyClass {
    // Class field (shared across all instances if object/array)
    items = []; // CAUTION: Creates new array per instance (good!)
    
    // But with objects:
    config = {}; // Creates new object per instance (good!)
    
    constructor() {
        // Constructor property
        this.id = Math.random();
    }
}

const obj1 = new MyClass();
const obj2 = new MyClass();

obj1.items.push(1);
console.log(obj2.items); // [] - Separate arrays (good!)

// GOTCHA: Static fields are shared!
class Counter {
    static count = 0;
    static items = []; // Shared across all instances!
    
    constructor() {
        Counter.count++;
        Counter.items.push(Counter.count);
    }
}

new Counter();
new Counter();
console.log(Counter.items); // [1, 2] - Shared!
```

### 7. super() in Constructors

```javascript
class Parent {
    constructor(name) {
        this.name = name;
    }
}

class Child extends Parent {
    constructor(name, age) {
        // Must call super() before accessing 'this'
        // super(name); // Uncomment this
        // this.age = age; // ReferenceError if super() not called
        
        super(name);
        this.age = age; // Now works
    }
}

// If no constructor in child, super() is called automatically
class SimpleChild extends Parent {
    // No constructor - automatically calls super(...args)
}

const child = new SimpleChild('John');
console.log(child.name); // 'John'
```

### 8. Getters/Setters Gotchas

```javascript
class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // MISTAKE: Same name as property
    // get firstName() {
    //     return this.firstName; // Infinite recursion!
    // }
    
    // CORRECT: Use different internal property
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    
    set fullName(value) {
        [this.firstName, this.lastName] = value.split(' ');
    }
}

const person = new Person('John', 'Doe');
console.log(person.fullName); // 'John Doe'
person.fullName = 'Jane Smith';
console.log(person.firstName); // 'Jane'
```

### 9. instanceof with Primitives

```javascript
// Primitives
console.log(5 instanceof Number);        // false
console.log('hello' instanceof String);  // false
console.log(true instanceof Boolean);    // false

// Wrapper objects
console.log(new Number(5) instanceof Number);      // true
console.log(new String('hello') instanceof String); // true
console.log(new Boolean(true) instanceof Boolean);  // true

// Better: Use typeof for primitives
console.log(typeof 5);      // 'number'
console.log(typeof 'hello'); // 'string'
console.log(typeof true);    // 'boolean'
```

### 10. Object Destructuring in Methods

```javascript
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    // MISTAKE: Destructuring loses 'this' context
    // ({ name, email }) {
    //     console.log(name, email);
    // }
    
    // CORRECT:
    display() {
        const { name, email } = this;
        console.log(name, email);
    }
}

const user = new User('John', 'john@example.com');
user.display(); // John john@example.com
```

---

## Interview Questions

### Q1: What is the difference between `__proto__` and `prototype`?

```javascript
function Person(name) {
    this.name = name;
}

Person.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

const john = new Person('John');

// prototype: Property of constructor functions
console.log(Person.prototype); // { greet: [Function], constructor: Person }

// __proto__: Property of objects, points to prototype
console.log(john.__proto__ === Person.prototype); // true

// Every function has prototype
// Every object has __proto__
```

### Q2: Implement private variables in ES5

```javascript
function BankAccount(initialBalance) {
    // Private variables
    let balance = initialBalance;
    const transactionHistory = [];
    
    // Private method
    function recordTransaction(type, amount) {
        transactionHistory.push({ type, amount, date: new Date() });
    }
    
    // Public methods
    this.deposit = function(amount) {
        if (amount > 0) {
            balance += amount;
            recordTransaction('deposit', amount);
            return true;
        }
        return false;
    };
    
    this.withdraw = function(amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            recordTransaction('withdrawal', amount);
            return true;
        }
        return false;
    };
    
    this.getBalance = function() {
        return balance;
    };
    
    this.getHistory = function() {
        return [...transactionHistory]; // Return copy
    };
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.balance); // undefined (private!)
```

### Q3: Implement method chaining

```javascript
class Calculator {
    constructor(value = 0) {
        this.value = value;
    }
    
    add(num) {
        this.value += num;
        return this; // Return 'this' for chaining
    }
    
    subtract(num) {
        this.value -= num;
        return this;
    }
    
    multiply(num) {
        this.value *= num;
        return this;
    }
    
    divide(num) {
        if (num !== 0) {
            this.value /= num;
        }
        return this;
    }
    
    getResult() {
        return this.value;
    }
}

const result = new Calculator(10)
    .add(5)
    .multiply(2)
    .subtract(10)
    .divide(2)
    .getResult();

console.log(result); // 10
```

### Q4: Deep clone an object

```javascript
// Simple deep clone (doesn't handle functions, dates, etc.)
function simpleDeepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

// Proper deep clone
function deepClone(obj, hash = new WeakMap()) {
    // Handle primitives and null
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }
    
    // Handle circular references
    if (hash.has(obj)) {
        return hash.get(obj);
    }
    
    // Handle Date
    if (obj instanceof Date) {
        return new Date(obj);
    }
    
    // Handle RegExp
    if (obj instanceof RegExp) {
        return new RegExp(obj);
    }
    
    // Handle Array
    if (Array.isArray(obj)) {
        const arrCopy = [];
        hash.set(obj, arrCopy);
        obj.forEach((item, index) => {
            arrCopy[index] = deepClone(item, hash);
        });
        return arrCopy;
    }
    
    // Handle Object
    const objCopy = {};
    hash.set(obj, objCopy);
    Object.keys(obj).forEach(key => {
        objCopy[key] = deepClone(obj[key], hash);
    });
    
    return objCopy;
}

// Test
const original = {
    name: 'John',
    age: 30,
    address: {
        city: 'NYC',
        country: 'USA'
    },
    hobbies: ['reading', 'coding']
};

const cloned = deepClone(original);
cloned.address.city = 'LA';
console.log(original.address.city); // 'NYC' (not affected)
console.log(cloned.address.city);   // 'LA'
```

### Q5: Implement a class with static and instance methods

```javascript
class MathUtils {
    // Static property
    static PI = 3.14159;
    
    // Instance property
    constructor(value) {
        this.value = value;
    }
    
    // Static method (called on class)
    static add(a, b) {
        return a + b;
    }
    
    static max(...numbers) {
        return Math.max(...numbers);
    }
    
    // Instance method (called on instance)
    double() {
        return this.value * 2;
    }
    
    square() {
        return this.value ** 2;
    }
}

// Static usage
console.log(MathUtils.PI);           // 3.14159
console.log(MathUtils.add(5, 3));    // 8
console.log(MathUtils.max(1, 5, 3)); // 5

// Instance usage
const num = new MathUtils(5);
console.log(num.double()); // 10
console.log(num.square()); // 25

// Cannot call static on instance
// console.log(num.add(1, 2)); // TypeError

// Cannot call instance on class
// console.log(MathUtils.double()); // TypeError
```

---

## Best Practices

### 1. Use ES6 Classes Over Constructor Functions

```javascript
// OLD: Constructor function
function Person(name, age) {
    this.name = name;
    this.age = age;
}
Person.prototype.greet = function() {
    console.log(`Hi, I'm ${this.name}`);
};

// NEW: ES6 Class (cleaner, more maintainable)
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        console.log(`Hi, I'm ${this.name}`);
    }
}
```

### 2. Prefer Composition Over Inheritance

```javascript
// AVOID: Deep inheritance hierarchies
class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {}
class Labrador extends Dog {} // Too deep!

// PREFER: Composition with mixins
const canEat = {
    eat(food) { console.log(`Eating ${food}`); }
};

const canWalk = {
    walk() { console.log('Walking'); }
};

class Dog {
    constructor(name) {
        this.name = name;
        Object.assign(this, canEat, canWalk);
    }
}
```

### 3. Use Private Fields for Encapsulation

```javascript
class User {
    #password; // Private field
    
    constructor(username, password) {
        this.username = username;
        this.#password = this.#hashPassword(password);
    }
    
    #hashPassword(password) {
        // Private method
        return password.split('').reverse().join(''); // Dummy hash
    }
    
    verifyPassword(password) {
        return this.#hashPassword(password) === this.#password;
    }
}
```

### 4. Validate Constructor Parameters

```javascript
class Person {
    constructor(name, age) {
        if (typeof name !== 'string' || name.length === 0) {
            throw new TypeError('Name must be a non-empty string');
        }
        
        if (typeof age !== 'number' || age < 0 || age > 150) {
            throw new RangeError('Age must be between 0 and 150');
        }
        
        this.name = name;
        this.age = age;
    }
}
```

### 5. Use Object.freeze() for Constants

```javascript
class Config {
    static SETTINGS = Object.freeze({
        API_URL: 'https://api.example.com',
        TIMEOUT: 5000,
        MAX_RETRIES: 3
    });
}

// Cannot modify
Config.SETTINGS.API_URL = 'hack'; // Won't work
console.log(Config.SETTINGS.API_URL); // Still original value
```

### 6. Implement toString() and valueOf()

```javascript
class Money {
    constructor(amount, currency = 'USD') {
        this.amount = amount;
        this.currency = currency;
    }
    
    toString() {
        return `${this.currency} ${this.amount.toFixed(2)}`;
    }
    
    valueOf() {
        return this.amount;
    }
}

const price = new Money(29.99);
console.log(String(price)); // "USD 29.99"
console.log(price + 10);    // 39.99 (valueOf() called)
```

### 7. Use Symbols for True Privacy (Alternative)

```javascript
const _balance = Symbol('balance');
const _transactions = Symbol('transactions');

class BankAccount {
    constructor(initialBalance) {
        this[_balance] = initialBalance;
        this[_transactions] = [];
    }
    
    deposit(amount) {
        this[_balance] += amount;
        this[_transactions].push({ type: 'deposit', amount });
    }
    
    getBalance() {
        return this[_balance];
    }
}

const account = new BankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account[_balance]); // undefined (symbol not accessible)
```

---

## Summary Checklist

### Core OOP Concepts
- [ ] Objects and properties
- [ ] Constructor functions
- [ ] ES6 Classes
- [ ] Prototypes and prototype chain
- [ ] Inheritance (extends, super)
- [ ] Encapsulation (private fields)
- [ ] Abstraction (abstract classes)
- [ ] Polymorphism

### Advanced Topics
- [ ] Getters and setters
- [ ] Static methods and properties
- [ ] Property descriptors
- [ ] Object.create()
- [ ] Mixins and composition
- [ ] Design patterns
- [ ] this binding (call, apply, bind)

### Edge Cases
- [ ] Arrow functions in classes
- [ ] Method context loss
- [ ] Prototype pollution
- [ ] Shallow vs deep freeze
- [ ] Constructor without 'new'
- [ ] Circular references
- [ ] hasOwnProperty vs in operator

### Best Practices
- [ ] Use ES6 classes
- [ ] Private fields for sensitive data
- [ ] Validate constructor parameters
- [ ] Composition over inheritance
- [ ] Implement toString/valueOf
- [ ] Method chaining
- [ ] Proper error handling

---

**Remember:** JavaScript OOP is prototype-based. Classes are syntactic sugar. Understanding prototypes is crucial for mastering JavaScript OOP!
