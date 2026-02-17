# 🚀 Complete System Design Guide (LLD + HLD) in JavaScript
> Your one-stop resource to crack any System Design interview

---

## 📋 Table of Contents

1. [Foundations — OOP in JavaScript](#1-foundations--oop-in-javascript)
2. [SOLID Principles](#2-solid-principles)
3. [Design Patterns](#3-design-patterns)
   - Creational
   - Structural
   - Behavioral
4. [LLD — Classic Interview Problems](#4-lld--classic-interview-problems)
   - Parking Lot
   - Library Management System
   - ATM
   - Snake & Ladder
   - Rate Limiter
   - Pub/Sub System
   - URL Shortener
   - Elevator System
5. [HLD — High Level Design Concepts](#5-hld--high-level-design-concepts)
6. [HLD — Classic Interview Problems](#6-hld--classic-interview-problems)
7. [Interview Cheat Sheet](#7-interview-cheat-sheet)

---

## 1. Foundations — OOP in JavaScript

### Classes & Encapsulation

```js
class BankAccount {
  #balance; // private field (ES2022+)

  constructor(owner, initialBalance) {
    this.owner = owner;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error("Invalid amount");
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
  }

  get balance() {
    return this.#balance; // controlled read access
  }
}

const acc = new BankAccount("Alice", 1000);
acc.deposit(500);
console.log(acc.balance); // 1500
```

### Inheritance & Polymorphism

```js
class Shape {
  area() {
    throw new Error("area() must be implemented");
  }
  toString() {
    return `Area: ${this.area()}`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }
  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(w, h) {
    super();
    this.width = w;
    this.height = h;
  }
  area() {
    return this.width * this.height;
  }
}

const shapes = [new Circle(5), new Rectangle(4, 6)];
shapes.forEach(s => console.log(s.toString()));
// Each calls its own area() — polymorphism
```

### Abstract Classes (via convention)

```js
class AbstractVehicle {
  constructor() {
    if (new.target === AbstractVehicle) {
      throw new Error("Cannot instantiate abstract class");
    }
  }

  startEngine() {
    throw new Error("startEngine() must be implemented");
  }

  move() {
    this.startEngine();
    console.log("Vehicle is moving");
  }
}

class Car extends AbstractVehicle {
  startEngine() {
    console.log("Car engine started 🚗");
  }
}
```

### Mixins (Multiple Inheritance Alternative)

```js
const Serializable = (Base) => class extends Base {
  serialize() {
    return JSON.stringify(this);
  }
  static deserialize(json) {
    return Object.assign(new this(), JSON.parse(json));
  }
};

const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date();
  }
};

class User extends Serializable(Timestamped(class {})) {
  constructor(name) {
    super();
    this.name = name;
  }
}
```

---

## 2. SOLID Principles

### S — Single Responsibility Principle
> A class should have only ONE reason to change.

```js
// ❌ Bad — doing too much
class UserService {
  createUser(data) { /* create */ }
  saveToDatabase(user) { /* db logic */ }
  sendWelcomeEmail(user) { /* email logic */ }
  generateReport() { /* report logic */ }
}

// ✅ Good — each class has one job
class UserRepository {
  save(user) { /* only db logic */ }
}

class EmailService {
  sendWelcome(user) { /* only email logic */ }
}

class UserService {
  constructor(repo, emailService) {
    this.repo = repo;
    this.emailService = emailService;
  }
  createUser(data) {
    const user = new User(data);
    this.repo.save(user);
    this.emailService.sendWelcome(user);
    return user;
  }
}
```

### O — Open/Closed Principle
> Open for extension, closed for modification.

```js
// ❌ Bad — must modify class to add new discounts
class Order {
  getDiscount(type) {
    if (type === "student") return 0.2;
    if (type === "senior") return 0.3;
    // Adding new type requires changing this class
  }
}

// ✅ Good — extend without modifying
class DiscountStrategy {
  calculate(price) { return price; }
}

class StudentDiscount extends DiscountStrategy {
  calculate(price) { return price * 0.8; }
}

class SeniorDiscount extends DiscountStrategy {
  calculate(price) { return price * 0.7; }
}

class Order {
  constructor(price, discountStrategy) {
    this.price = price;
    this.discount = discountStrategy;
  }
  getFinalPrice() {
    return this.discount.calculate(this.price);
  }
}
```

### L — Liskov Substitution Principle
> Subclasses must be usable in place of their parent class.

```js
// ❌ Bad — Square breaks Rectangle's contract
class Rectangle {
  setWidth(w) { this.width = w; }
  setHeight(h) { this.height = h; }
  area() { return this.width * this.height; }
}

class Square extends Rectangle {
  setWidth(w) { this.width = w; this.height = w; } // breaks expectations!
}

// ✅ Good — separate hierarchy
class Shape {
  area() { throw new Error("Not implemented"); }
}
class Rectangle extends Shape {
  constructor(w, h) { super(); this.w = w; this.h = h; }
  area() { return this.w * this.h; }
}
class Square extends Shape {
  constructor(s) { super(); this.side = s; }
  area() { return this.side ** 2; }
}
```

### I — Interface Segregation Principle
> Don't force classes to implement interfaces they don't use.

```js
// ❌ Bad — Printer forced to implement fax
class AllInOnePrinter {
  print() {}
  scan() {}
  fax() {} // Not all printers can fax!
}

// ✅ Good — split interfaces using mixins
const Printable = (Base) => class extends Base {
  print() { console.log("Printing..."); }
};
const Scannable = (Base) => class extends Base {
  scan() { console.log("Scanning..."); }
};
const Faxable = (Base) => class extends Base {
  fax() { console.log("Faxing..."); }
};

class BasicPrinter extends Printable(class {}) {}
class AdvancedPrinter extends Faxable(Scannable(Printable(class {}))) {}
```

### D — Dependency Inversion Principle
> Depend on abstractions, not concretions.

```js
// ❌ Bad — tightly coupled
class MySQLDatabase {
  save(data) { console.log("Saving to MySQL"); }
}
class UserService {
  constructor() {
    this.db = new MySQLDatabase(); // hard dependency
  }
}

// ✅ Good — depend on abstraction
class Database {
  save(data) { throw new Error("Not implemented"); }
}
class MySQLDatabase extends Database {
  save(data) { console.log("MySQL: saving", data); }
}
class MongoDB extends Database {
  save(data) { console.log("MongoDB: saving", data); }
}
class UserService {
  constructor(db) { // injected — could be any DB
    this.db = db;
  }
  createUser(data) { this.db.save(data); }
}

const service = new UserService(new MongoDB());
```

---

## 3. Design Patterns

### CREATIONAL PATTERNS

#### ✅ Singleton
> Ensures only ONE instance of a class exists.

```js
class ConfigManager {
  constructor() {
    if (ConfigManager._instance) {
      return ConfigManager._instance;
    }
    this.settings = {};
    ConfigManager._instance = this;
  }

  set(key, value) { this.settings[key] = value; }
  get(key) { return this.settings[key]; }
}

const c1 = new ConfigManager();
const c2 = new ConfigManager();
console.log(c1 === c2); // true

// Modern approach using module pattern
const Logger = (() => {
  let instance;
  return {
    getInstance() {
      if (!instance) {
        instance = { log: (msg) => console.log(`[LOG] ${msg}`) };
      }
      return instance;
    }
  };
})();
```

#### ✅ Factory Method
> Create objects without specifying exact class.

```js
class Notification {
  send(message) { throw new Error("Implement send()"); }
}

class EmailNotification extends Notification {
  send(msg) { console.log(`Email: ${msg}`); }
}
class SMSNotification extends Notification {
  send(msg) { console.log(`SMS: ${msg}`); }
}
class PushNotification extends Notification {
  send(msg) { console.log(`Push: ${msg}`); }
}

class NotificationFactory {
  static create(type) {
    const types = {
      email: EmailNotification,
      sms: SMSNotification,
      push: PushNotification,
    };
    const NotifClass = types[type];
    if (!NotifClass) throw new Error(`Unknown type: ${type}`);
    return new NotifClass();
  }
}

NotificationFactory.create("email").send("Hello!");
NotificationFactory.create("sms").send("Verify OTP: 1234");
```

#### ✅ Abstract Factory
> Factory of factories — create related object families.

```js
// Dark Theme family
class DarkButton {
  render() { return '<button style="background:black">Click</button>'; }
}
class DarkInput {
  render() { return '<input style="background:#333" />'; }
}

// Light Theme family
class LightButton {
  render() { return '<button style="background:white">Click</button>'; }
}
class LightInput {
  render() { return '<input style="background:#fff" />'; }
}

class DarkThemeFactory {
  createButton() { return new DarkButton(); }
  createInput() { return new DarkInput(); }
}

class LightThemeFactory {
  createButton() { return new LightButton(); }
  createInput() { return new LightInput(); }
}

// Usage
function renderUI(factory) {
  const btn = factory.createButton();
  const inp = factory.createInput();
  console.log(btn.render(), inp.render());
}

renderUI(new DarkThemeFactory());
renderUI(new LightThemeFactory());
```

#### ✅ Builder
> Construct complex objects step by step.

```js
class QueryBuilder {
  #table = '';
  #conditions = [];
  #fields = ['*'];
  #limit = null;
  #orderBy = null;

  from(table) { this.#table = table; return this; }
  select(...fields) { this.#fields = fields; return this; }
  where(condition) { this.#conditions.push(condition); return this; }
  limitTo(n) { this.#limit = n; return this; }
  orderByField(field, dir = 'ASC') { this.#orderBy = `${field} ${dir}`; return this; }

  build() {
    let query = `SELECT ${this.#fields.join(', ')} FROM ${this.#table}`;
    if (this.#conditions.length) query += ` WHERE ${this.#conditions.join(' AND ')}`;
    if (this.#orderBy) query += ` ORDER BY ${this.#orderBy}`;
    if (this.#limit) query += ` LIMIT ${this.#limit}`;
    return query;
  }
}

const query = new QueryBuilder()
  .from('users')
  .select('id', 'name', 'email')
  .where('age > 18')
  .where('active = true')
  .orderByField('name')
  .limitTo(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND active = true ORDER BY name ASC LIMIT 10
```

#### ✅ Prototype
> Clone objects instead of creating from scratch.

```js
class Enemy {
  constructor(type, health, speed, attack) {
    this.type = type;
    this.health = health;
    this.speed = speed;
    this.attack = attack;
  }

  clone() {
    return Object.assign(Object.create(Object.getPrototypeOf(this)), this);
  }
}

const bossTemplate = new Enemy("Boss", 1000, 5, 100);

// Fast cloning for spawning multiple enemies
const boss1 = bossTemplate.clone();
boss1.health = 800; // customized variant

const boss2 = bossTemplate.clone();
boss2.speed = 3;
```

---

### STRUCTURAL PATTERNS

#### ✅ Adapter
> Make incompatible interfaces work together.

```js
// Old payment API
class OldPaymentGateway {
  makePayment(amount, cardNo) {
    console.log(`Old API: Charging ${amount} to card ${cardNo}`);
  }
}

// New interface we want to use
class PaymentProcessor {
  processPayment(paymentData) { throw new Error("Implement"); }
}

// Adapter bridges old → new
class PaymentAdapter extends PaymentProcessor {
  constructor() {
    super();
    this.oldGateway = new OldPaymentGateway();
  }

  processPayment({ amount, cardNumber }) {
    this.oldGateway.makePayment(amount, cardNumber);
  }
}

const processor = new PaymentAdapter();
processor.processPayment({ amount: 500, cardNumber: "4111111111111111" });
```

#### ✅ Decorator
> Add behaviors to objects dynamically.

```js
class Coffee {
  cost() { return 5; }
  description() { return "Basic Coffee"; }
}

// Each decorator wraps and extends
class MilkDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost() { return this.coffee.cost() + 2; }
  description() { return this.coffee.description() + " + Milk"; }
}

class SugarDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost() { return this.coffee.cost() + 1; }
  description() { return this.coffee.description() + " + Sugar"; }
}

class VanillaDecorator {
  constructor(coffee) { this.coffee = coffee; }
  cost() { return this.coffee.cost() + 3; }
  description() { return this.coffee.description() + " + Vanilla"; }
}

let myCoffee = new Coffee();
myCoffee = new MilkDecorator(myCoffee);
myCoffee = new SugarDecorator(myCoffee);
myCoffee = new VanillaDecorator(myCoffee);

console.log(myCoffee.description()); // Basic Coffee + Milk + Sugar + Vanilla
console.log(myCoffee.cost()); // 11
```

#### ✅ Facade
> Simplified interface to a complex subsystem.

```js
class CPU { boot() { console.log("CPU booting..."); } }
class Memory { load() { console.log("Memory loading..."); } }
class HardDrive { read() { console.log("HardDrive reading..."); } }
class OS { launch() { console.log("OS launching..."); } }

// Without facade — client manages all subsystems
// With facade — simple interface
class ComputerFacade {
  constructor() {
    this.cpu = new CPU();
    this.memory = new Memory();
    this.hd = new HardDrive();
    this.os = new OS();
  }

  start() {
    this.cpu.boot();
    this.memory.load();
    this.hd.read();
    this.os.launch();
    console.log("Computer started! ✅");
  }
}

const computer = new ComputerFacade();
computer.start(); // Single call handles everything
```

#### ✅ Proxy
> Control access to an object (lazy init, caching, auth).

```js
class RealDatabase {
  query(sql) {
    console.log(`DB Query: ${sql}`);
    return { data: "result" };
  }
}

class DatabaseProxy {
  constructor(userRole) {
    this.db = new RealDatabase();
    this.userRole = userRole;
    this.cache = new Map();
  }

  query(sql) {
    // Auth check
    if (this.userRole !== "admin" && sql.includes("DROP")) {
      throw new Error("Unauthorized: Insufficient permissions");
    }
    // Cache check
    if (this.cache.has(sql)) {
      console.log("Cache hit!");
      return this.cache.get(sql);
    }
    const result = this.db.query(sql);
    this.cache.set(sql, result);
    return result;
  }
}

const proxy = new DatabaseProxy("admin");
proxy.query("SELECT * FROM users");
proxy.query("SELECT * FROM users"); // Cache hit!
```

#### ✅ Composite
> Treat individual objects and groups uniformly.

```js
// File system: File and Folder share same interface
class File {
  constructor(name, size) {
    this.name = name;
    this.size = size;
  }
  getSize() { return this.size; }
  display(indent = 0) {
    console.log(`${"  ".repeat(indent)}📄 ${this.name} (${this.size}KB)`);
  }
}

class Folder {
  constructor(name) {
    this.name = name;
    this.children = [];
  }
  add(item) { this.children.push(item); }
  getSize() { return this.children.reduce((sum, c) => sum + c.getSize(), 0); }
  display(indent = 0) {
    console.log(`${"  ".repeat(indent)}📁 ${this.name}`);
    this.children.forEach(c => c.display(indent + 1));
  }
}

const root = new Folder("root");
const docs = new Folder("documents");
docs.add(new File("resume.pdf", 150));
docs.add(new File("cover.docx", 50));
root.add(docs);
root.add(new File("readme.txt", 5));
root.display();
console.log("Total:", root.getSize(), "KB");
```

---

### BEHAVIORAL PATTERNS

#### ✅ Observer
> Notify multiple objects when state changes.

```js
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(listener);
    return () => this.off(event, listener); // returns unsubscribe fn
  }

  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter(l => l !== listener);
  }

  emit(event, data) {
    (this.events[event] || []).forEach(l => l(data));
  }
}

// Usage: Stock Price System
class StockMarket extends EventEmitter {
  constructor() {
    super();
    this.prices = {};
  }
  updatePrice(stock, price) {
    this.prices[stock] = price;
    this.emit('priceChange', { stock, price });
  }
}

const market = new StockMarket();
const unsubscribe = market.on('priceChange', ({ stock, price }) => {
  console.log(`Alert: ${stock} is now $${price}`);
});

market.updatePrice("AAPL", 175);
market.updatePrice("GOOGL", 140);
unsubscribe(); // stop listening
market.updatePrice("AAPL", 180); // no alert
```

#### ✅ Strategy
> Swap algorithms at runtime.

```js
// Sorting strategies
const bubbleSort = (arr) => { /* ... */ return [...arr].sort(); };
const quickSort = (arr) => { /* ... */ return [...arr].sort((a, b) => a - b); };
const mergeSort = (arr) => { /* ... */ return [...arr].sort((a, b) => a - b); };

class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  sort(data) {
    return this.strategy(data);
  }
}

const sorter = new Sorter(quickSort);
console.log(sorter.sort([3, 1, 4, 1, 5]));
sorter.setStrategy(bubbleSort);
console.log(sorter.sort([3, 1, 4, 1, 5]));
```

#### ✅ Command
> Encapsulate requests as objects (undo/redo support).

```js
class TextEditor {
  constructor() {
    this.text = "";
    this.history = [];
  }

  executeCommand(command) {
    command.execute();
    this.history.push(command);
  }

  undo() {
    const command = this.history.pop();
    if (command) command.undo();
  }
}

class InsertTextCommand {
  constructor(editor, text) {
    this.editor = editor;
    this.text = text;
  }
  execute() { this.editor.text += this.text; }
  undo() { this.editor.text = this.editor.text.slice(0, -this.text.length); }
}

class DeleteTextCommand {
  constructor(editor, count) {
    this.editor = editor;
    this.count = count;
    this.deleted = "";
  }
  execute() {
    this.deleted = this.editor.text.slice(-this.count);
    this.editor.text = this.editor.text.slice(0, -this.count);
  }
  undo() { this.editor.text += this.deleted; }
}

const editor = new TextEditor();
editor.executeCommand(new InsertTextCommand(editor, "Hello"));
editor.executeCommand(new InsertTextCommand(editor, " World"));
console.log(editor.text); // Hello World
editor.undo();
console.log(editor.text); // Hello
```

#### ✅ Iterator
> Traverse a collection without knowing its structure.

```js
class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const { end, step } = this;
    return {
      next() {
        if (current <= end) {
          const value = current;
          current += step;
          return { value, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
}

for (const num of new Range(1, 10, 2)) {
  console.log(num); // 1, 3, 5, 7, 9
}
console.log([...new Range(0, 5)]); // [0, 1, 2, 3, 4, 5]
```

#### ✅ State
> Change behavior when internal state changes.

```js
class TrafficLight {
  constructor() {
    this.states = {
      red: {
        color: "RED",
        duration: 3000,
        next: () => this.transition("green")
      },
      green: {
        color: "GREEN",
        duration: 2000,
        next: () => this.transition("yellow")
      },
      yellow: {
        color: "YELLOW",
        duration: 1000,
        next: () => this.transition("red")
      },
    };
    this.current = this.states.red;
  }

  transition(stateName) {
    this.current = this.states[stateName];
    console.log(`Light is now ${this.current.color}`);
    setTimeout(() => this.current.next(), this.current.duration);
  }

  start() {
    console.log(`Light is now ${this.current.color}`);
    setTimeout(() => this.current.next(), this.current.duration);
  }
}
```

#### ✅ Chain of Responsibility
> Pass requests along a chain of handlers.

```js
class Handler {
  constructor(name) {
    this.name = name;
    this.next = null;
  }
  setNext(handler) {
    this.next = handler;
    return handler; // enables chaining
  }
  handle(request) {
    if (this.next) return this.next.handle(request);
    return `No handler found for: ${request}`;
  }
}

class AuthHandler extends Handler {
  handle(request) {
    if (!request.token) return "401: Unauthorized";
    return super.handle(request);
  }
}

class ValidationHandler extends Handler {
  handle(request) {
    if (!request.body) return "400: Bad Request - Missing body";
    return super.handle(request);
  }
}

class BusinessLogicHandler extends Handler {
  handle(request) {
    return `200: Processing ${JSON.stringify(request.body)}`;
  }
}

const auth = new AuthHandler("Auth");
const validate = new ValidationHandler("Validate");
const logic = new BusinessLogicHandler("Logic");

auth.setNext(validate).setNext(logic);

console.log(auth.handle({ token: "abc123", body: { id: 1 } }));
// 200: Processing {"id":1}
console.log(auth.handle({ body: { id: 1 } }));
// 401: Unauthorized
```

---

## 4. LLD — Classic Interview Problems

### 🅿️ Parking Lot System

```js
// Enums
const VehicleType = { MOTORCYCLE: "MOTORCYCLE", CAR: "CAR", TRUCK: "TRUCK" };
const SpotType = { SMALL: "SMALL", MEDIUM: "MEDIUM", LARGE: "LARGE" };
const SpotStatus = { AVAILABLE: "AVAILABLE", OCCUPIED: "OCCUPIED" };

class Vehicle {
  constructor(plate, type) {
    this.plate = plate;
    this.type = type;
  }
}

class ParkingSpot {
  constructor(id, type, floor) {
    this.id = id;
    this.type = type;
    this.floor = floor;
    this.status = SpotStatus.AVAILABLE;
    this.vehicle = null;
  }

  canFit(vehicle) {
    const compatibility = {
      [SpotType.SMALL]: [VehicleType.MOTORCYCLE],
      [SpotType.MEDIUM]: [VehicleType.MOTORCYCLE, VehicleType.CAR],
      [SpotType.LARGE]: [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
    };
    return this.status === SpotStatus.AVAILABLE &&
           compatibility[this.type].includes(vehicle.type);
  }

  park(vehicle) {
    this.vehicle = vehicle;
    this.status = SpotStatus.OCCUPIED;
  }

  leave() {
    const vehicle = this.vehicle;
    this.vehicle = null;
    this.status = SpotStatus.AVAILABLE;
    return vehicle;
  }
}

class Ticket {
  constructor(vehicle, spot) {
    this.id = Date.now().toString();
    this.vehicle = vehicle;
    this.spot = spot;
    this.entryTime = new Date();
    this.exitTime = null;
  }

  calculateFee(ratePerHour = 10) {
    this.exitTime = new Date();
    const hours = Math.ceil((this.exitTime - this.entryTime) / 3600000);
    return Math.max(1, hours) * ratePerHour;
  }
}

class ParkingFloor {
  constructor(floorNumber, spots) {
    this.floorNumber = floorNumber;
    this.spots = spots;
  }

  findAvailableSpot(vehicle) {
    return this.spots.find(s => s.canFit(vehicle)) || null;
  }

  getAvailableCount() {
    return this.spots.filter(s => s.status === SpotStatus.AVAILABLE).length;
  }
}

class ParkingLot {
  #tickets = new Map();
  
  constructor(name, floors) {
    this.name = name;
    this.floors = floors;
  }

  parkVehicle(vehicle) {
    for (const floor of this.floors) {
      const spot = floor.findAvailableSpot(vehicle);
      if (spot) {
        spot.park(vehicle);
        const ticket = new Ticket(vehicle, spot);
        this.#tickets.set(ticket.id, ticket);
        console.log(`Parked ${vehicle.plate} at Spot ${spot.id}, Floor ${floor.floorNumber}`);
        return ticket;
      }
    }
    throw new Error("Parking lot is full!");
  }

  exitVehicle(ticketId) {
    const ticket = this.#tickets.get(ticketId);
    if (!ticket) throw new Error("Invalid ticket");
    const fee = ticket.calculateFee();
    ticket.spot.leave();
    this.#tickets.delete(ticketId);
    console.log(`Vehicle ${ticket.vehicle.plate} exited. Fee: $${fee}`);
    return fee;
  }

  getStatus() {
    this.floors.forEach(f => {
      console.log(`Floor ${f.floorNumber}: ${f.getAvailableCount()} spots available`);
    });
  }
}

// Usage
const floor1 = new ParkingFloor(1, [
  new ParkingSpot("S1", SpotType.SMALL, 1),
  new ParkingSpot("M1", SpotType.MEDIUM, 1),
  new ParkingSpot("L1", SpotType.LARGE, 1),
]);

const lot = new ParkingLot("City Parking", [floor1]);
const car = new Vehicle("ABC-123", VehicleType.CAR);
const ticket = lot.parkVehicle(car);
lot.getStatus();
lot.exitVehicle(ticket.id);
```

---

### 📚 Library Management System

```js
const BookStatus = { AVAILABLE: "AVAILABLE", BORROWED: "BORROWED", RESERVED: "RESERVED" };

class Book {
  constructor(isbn, title, author, copies) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.totalCopies = copies;
    this.availableCopies = copies;
  }

  isAvailable() { return this.availableCopies > 0; }
  borrow() {
    if (!this.isAvailable()) throw new Error("No copies available");
    this.availableCopies--;
  }
  return() { this.availableCopies++; }
}

class Member {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.borrowedBooks = [];
    this.maxBorrowLimit = 5;
  }

  canBorrow() { return this.borrowedBooks.length < this.maxBorrowLimit; }
}

class BorrowRecord {
  constructor(member, book) {
    this.id = `${member.id}-${book.isbn}-${Date.now()}`;
    this.member = member;
    this.book = book;
    this.borrowDate = new Date();
    this.dueDate = new Date(Date.now() + 14 * 24 * 3600000); // 14 days
    this.returnDate = null;
  }

  calculateFine(finePerDay = 2) {
    if (!this.returnDate) this.returnDate = new Date();
    const overdueDays = Math.max(0,
      Math.floor((this.returnDate - this.dueDate) / 86400000)
    );
    return overdueDays * finePerDay;
  }
}

class Library {
  #books = new Map();
  #members = new Map();
  #records = new Map();

  addBook(book) { this.#books.set(book.isbn, book); }
  registerMember(member) { this.#members.set(member.id, member); }

  borrowBook(memberId, isbn) {
    const member = this.#members.get(memberId);
    const book = this.#books.get(isbn);
    if (!member) throw new Error("Member not found");
    if (!book) throw new Error("Book not found");
    if (!member.canBorrow()) throw new Error("Borrow limit reached");
    if (!book.isAvailable()) throw new Error("Book not available");

    book.borrow();
    const record = new BorrowRecord(member, book);
    member.borrowedBooks.push(isbn);
    this.#records.set(record.id, record);
    console.log(`${member.name} borrowed "${book.title}". Due: ${record.dueDate.toDateString()}`);
    return record;
  }

  returnBook(recordId) {
    const record = this.#records.get(recordId);
    if (!record) throw new Error("Record not found");
    record.book.return();
    record.member.borrowedBooks = record.member.borrowedBooks.filter(i => i !== record.book.isbn);
    const fine = record.calculateFine();
    this.#records.delete(recordId);
    if (fine > 0) console.log(`Fine: $${fine}`);
    return fine;
  }

  searchByTitle(title) {
    return [...this.#books.values()].filter(b =>
      b.title.toLowerCase().includes(title.toLowerCase())
    );
  }
}
```

---

### 🏧 ATM System

```js
const TransactionType = { WITHDRAW: "WITHDRAW", DEPOSIT: "DEPOSIT", BALANCE: "BALANCE" };

class Card {
  constructor(number, pin, account) {
    this.number = number;
    this.#pin = pin;
    this.account = account;
    this.isBlocked = false;
    this.failedAttempts = 0;
  }
  #pin;

  validatePin(pin) {
    if (this.isBlocked) throw new Error("Card is blocked");
    if (this.#pin === pin) {
      this.failedAttempts = 0;
      return true;
    }
    this.failedAttempts++;
    if (this.failedAttempts >= 3) {
      this.isBlocked = true;
      throw new Error("Card blocked after 3 failed attempts");
    }
    return false;
  }
}

class Account {
  constructor(id, balance) {
    this.id = id;
    this.#balance = balance;
    this.transactions = [];
  }
  #balance;

  get balance() { return this.#balance; }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error("Insufficient funds");
    this.#balance -= amount;
    this.transactions.push({ type: TransactionType.WITHDRAW, amount, date: new Date() });
  }

  deposit(amount) {
    this.#balance += amount;
    this.transactions.push({ type: TransactionType.DEPOSIT, amount, date: new Date() });
  }
}

class ATMState {
  constructor(atm) { this.atm = atm; }
  insertCard() { throw new Error("Invalid action in this state"); }
  enterPin() { throw new Error("Invalid action in this state"); }
  selectTransaction() { throw new Error("Invalid action in this state"); }
  processTransaction() { throw new Error("Invalid action in this state"); }
}

class IdleState extends ATMState {
  insertCard(card) {
    this.atm.currentCard = card;
    this.atm.setState(this.atm.cardInsertedState);
    console.log("Card inserted. Please enter PIN.");
  }
}

class CardInsertedState extends ATMState {
  enterPin(pin) {
    if (this.atm.currentCard.validatePin(pin)) {
      this.atm.setState(this.atm.authenticatedState);
      console.log("PIN correct. Select transaction.");
    } else {
      console.log("Wrong PIN.");
    }
  }
}

class AuthenticatedState extends ATMState {
  selectTransaction(type) {
    this.atm.transactionType = type;
    this.atm.setState(this.atm.transactionState);
  }
}

class TransactionState extends ATMState {
  processTransaction(amount) {
    const account = this.atm.currentCard.account;
    if (this.atm.transactionType === TransactionType.WITHDRAW) {
      account.withdraw(amount);
      this.atm.cashDispensed += amount;
      console.log(`Dispensed $${amount}. Balance: $${account.balance}`);
    } else if (this.atm.transactionType === TransactionType.DEPOSIT) {
      account.deposit(amount);
      console.log(`Deposited $${amount}. Balance: $${account.balance}`);
    }
    this.atm.setState(this.atm.idleState);
    this.atm.currentCard = null;
  }
}

class ATM {
  constructor(cashAmount) {
    this.idleState = new IdleState(this);
    this.cardInsertedState = new CardInsertedState(this);
    this.authenticatedState = new AuthenticatedState(this);
    this.transactionState = new TransactionState(this);
    this.state = this.idleState;
    this.cashDispensed = 0;
    this.currentCard = null;
    this.transactionType = null;
    this.totalCash = cashAmount;
  }

  setState(state) { this.state = state; }
  insertCard(card) { this.state.insertCard(card); }
  enterPin(pin) { this.state.enterPin(pin); }
  selectTransaction(type) { this.state.selectTransaction(type); }
  processTransaction(amount) { this.state.processTransaction(amount); }
}
```

---

### ⏱️ Rate Limiter

```js
// Token Bucket Algorithm
class TokenBucketRateLimiter {
  constructor(maxTokens, refillRate) {
    this.maxTokens = maxTokens;     // max requests
    this.refillRate = refillRate;   // tokens per second
    this.clients = new Map();
  }

  #getClient(clientId) {
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, {
        tokens: this.maxTokens,
        lastRefill: Date.now(),
      });
    }
    return this.clients.get(clientId);
  }

  #refill(client) {
    const now = Date.now();
    const elapsed = (now - client.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate;
    client.tokens = Math.min(this.maxTokens, client.tokens + tokensToAdd);
    client.lastRefill = now;
  }

  isAllowed(clientId) {
    const client = this.#getClient(clientId);
    this.#refill(client);
    if (client.tokens >= 1) {
      client.tokens -= 1;
      return true;
    }
    return false;
  }
}

// Sliding Window Algorithm
class SlidingWindowRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.clients = new Map();
  }

  isAllowed(clientId) {
    const now = Date.now();
    if (!this.clients.has(clientId)) {
      this.clients.set(clientId, []);
    }
    const timestamps = this.clients.get(clientId);
    // Remove old timestamps outside window
    while (timestamps.length && timestamps[0] <= now - this.windowMs) {
      timestamps.shift();
    }
    if (timestamps.length < this.maxRequests) {
      timestamps.push(now);
      return true;
    }
    return false;
  }
}

// Usage
const limiter = new SlidingWindowRateLimiter(5, 1000); // 5 req/second
for (let i = 0; i < 7; i++) {
  console.log(`Request ${i+1}: ${limiter.isAllowed("user1") ? "✅ Allowed" : "❌ Blocked"}`);
}
```

---

### 📡 Pub/Sub System

```js
class PubSubSystem {
  #topics = new Map();
  #subscribers = new Map();
  #messageQueue = [];

  createTopic(topicId, name) {
    if (this.#topics.has(topicId)) throw new Error("Topic exists");
    this.#topics.set(topicId, { id: topicId, name, messages: [] });
    return topicId;
  }

  subscribe(topicId, subscriberId, callback) {
    if (!this.#topics.has(topicId)) throw new Error("Topic not found");
    if (!this.#subscribers.has(topicId)) this.#subscribers.set(topicId, new Map());
    this.#subscribers.get(topicId).set(subscriberId, { callback, offset: 0 });
    return () => this.unsubscribe(topicId, subscriberId); // returns unsubscribe fn
  }

  unsubscribe(topicId, subscriberId) {
    this.#subscribers.get(topicId)?.delete(subscriberId);
  }

  publish(topicId, publisherId, message) {
    if (!this.#topics.has(topicId)) throw new Error("Topic not found");
    const topic = this.#topics.get(topicId);
    const msg = {
      id: Date.now(),
      topicId,
      publisherId,
      content: message,
      timestamp: new Date(),
    };
    topic.messages.push(msg);
    this.#notifySubscribers(topicId, msg);
  }

  #notifySubscribers(topicId, message) {
    const subs = this.#subscribers.get(topicId);
    if (!subs) return;
    for (const [id, sub] of subs) {
      try {
        sub.callback(message);
        sub.offset++;
      } catch (e) {
        console.error(`Error notifying subscriber ${id}:`, e);
      }
    }
  }
}

// Usage
const pubsub = new PubSubSystem();
pubsub.createTopic("orders", "Order Events");

const unsub = pubsub.subscribe("orders", "inventory-service", (msg) => {
  console.log("Inventory received:", msg.content);
});

pubsub.subscribe("orders", "notification-service", (msg) => {
  console.log("Notification received:", msg.content);
});

pubsub.publish("orders", "api-server", { type: "ORDER_CREATED", orderId: "123" });
unsub(); // inventory stops listening
pubsub.publish("orders", "api-server", { type: "ORDER_SHIPPED", orderId: "123" });
```

---

### 🔗 URL Shortener

```js
class URLShortener {
  #urlMap = new Map();      // short → long
  #reverseMap = new Map();  // long → short
  #analytics = new Map();   // short → click data
  #chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  constructor(baseUrl = "https://sh.rt/") {
    this.baseUrl = baseUrl;
  }

  #generateCode(length = 6) {
    let code = "";
    for (let i = 0; i < length; i++) {
      code += this.#chars[Math.floor(Math.random() * this.#chars.length)];
    }
    return code;
  }

  shorten(longUrl, customAlias = null, expiresInDays = null) {
    // Return existing short URL if already shortened
    if (this.#reverseMap.has(longUrl)) {
      return this.baseUrl + this.#reverseMap.get(longUrl);
    }

    let code = customAlias || this.#generateCode();
    while (this.#urlMap.has(code)) {
      code = this.#generateCode(); // avoid collision
    }

    const entry = {
      longUrl,
      createdAt: new Date(),
      expiresAt: expiresInDays
        ? new Date(Date.now() + expiresInDays * 86400000)
        : null,
    };

    this.#urlMap.set(code, entry);
    this.#reverseMap.set(longUrl, code);
    this.#analytics.set(code, { clicks: 0, locations: {} });

    return this.baseUrl + code;
  }

  resolve(shortCode, userLocation = "Unknown") {
    const entry = this.#urlMap.get(shortCode);
    if (!entry) throw new Error("URL not found");
    if (entry.expiresAt && new Date() > entry.expiresAt) {
      this.delete(shortCode);
      throw new Error("URL has expired");
    }
    // Track analytics
    const stats = this.#analytics.get(shortCode);
    stats.clicks++;
    stats.locations[userLocation] = (stats.locations[userLocation] || 0) + 1;
    return entry.longUrl;
  }

  getAnalytics(shortCode) {
    return this.#analytics.get(shortCode) || null;
  }

  delete(shortCode) {
    const entry = this.#urlMap.get(shortCode);
    if (entry) {
      this.#reverseMap.delete(entry.longUrl);
      this.#urlMap.delete(shortCode);
      this.#analytics.delete(shortCode);
    }
  }
}

// Usage
const shortener = new URLShortener();
const short = shortener.shorten("https://very-long-url.com/article/123?utm_source=email", null, 30);
console.log(short); // https://sh.rt/AbCdEf
const resolved = shortener.resolve("AbCdEf", "US");
console.log(resolved);
console.log(shortener.getAnalytics("AbCdEf"));
```

---

### 🛗 Elevator System

```js
const Direction = { UP: "UP", DOWN: "DOWN", IDLE: "IDLE" };
const ElevatorStatus = { MOVING: "MOVING", IDLE: "IDLE", MAINTENANCE: "MAINTENANCE" };

class Request {
  constructor(floor, direction) {
    this.floor = floor;
    this.direction = direction;
    this.timestamp = Date.now();
  }
}

class Elevator {
  constructor(id, totalFloors) {
    this.id = id;
    this.currentFloor = 1;
    this.direction = Direction.IDLE;
    this.status = ElevatorStatus.IDLE;
    this.destinations = new Set();
    this.totalFloors = totalFloors;
  }

  addDestination(floor) { this.destinations.add(floor); }

  move() {
    if (this.destinations.size === 0) {
      this.direction = Direction.IDLE;
      this.status = ElevatorStatus.IDLE;
      return;
    }
    this.status = ElevatorStatus.MOVING;
    const sorted = [...this.destinations].sort((a, b) => a - b);
    
    if (this.direction === Direction.UP || this.direction === Direction.IDLE) {
      const nextUp = sorted.find(f => f >= this.currentFloor);
      if (nextUp !== undefined) {
        this.currentFloor = nextUp;
        this.destinations.delete(nextUp);
        console.log(`Elevator ${this.id}: arrived at floor ${this.currentFloor}`);
      } else {
        this.direction = Direction.DOWN;
        this.move();
      }
    } else {
      const nextDown = [...sorted].reverse().find(f => f <= this.currentFloor);
      if (nextDown !== undefined) {
        this.currentFloor = nextDown;
        this.destinations.delete(nextDown);
        console.log(`Elevator ${this.id}: arrived at floor ${this.currentFloor}`);
      } else {
        this.direction = Direction.UP;
        this.move();
      }
    }
  }
}

class ElevatorController {
  constructor(numElevators, numFloors) {
    this.elevators = Array.from({ length: numElevators }, (_, i) => new Elevator(i + 1, numFloors));
    this.pendingRequests = [];
  }

  // SCAN Algorithm — assign nearest idle/same-direction elevator
  #findBestElevator(floor, direction) {
    let best = null;
    let minDistance = Infinity;

    for (const elevator of this.elevators) {
      if (elevator.status === ElevatorStatus.MAINTENANCE) continue;
      const distance = Math.abs(elevator.currentFloor - floor);
      const sameDirection = elevator.direction === direction || elevator.direction === Direction.IDLE;

      if (sameDirection && distance < minDistance) {
        minDistance = distance;
        best = elevator;
      }
    }
    return best || this.elevators[0];
  }

  requestElevator(floor, direction) {
    const elevator = this.#findBestElevator(floor, direction);
    elevator.direction = direction;
    elevator.addDestination(floor);
    console.log(`Elevator ${elevator.id} assigned to floor ${floor}`);
    return elevator;
  }

  step() {
    this.elevators.forEach(e => e.move());
  }
}

const controller = new ElevatorController(3, 20);
controller.requestElevator(5, Direction.UP);
controller.requestElevator(10, Direction.DOWN);
controller.step();
```

---

## 5. HLD — High Level Design Concepts

### Core Concepts

#### Scalability
- **Vertical Scaling**: Add more resources to existing server (CPU, RAM)
- **Horizontal Scaling**: Add more servers (scale out)
- Prefer horizontal scaling for web services

#### Load Balancing
```
Clients → Load Balancer → [Server1, Server2, Server3] → Database
```
**Algorithms:**
- Round Robin — cycle through servers equally
- Least Connections — route to server with fewest active connections
- IP Hash — same client always hits same server (sticky sessions)
- Weighted — distribute based on server capacity

#### Caching
```
Read flow: Client → App Server → Cache (Redis) → DB (if cache miss)
Write flow: App Server → DB + invalidate/update cache
```
**Caching strategies:**
- Cache-Aside (Lazy Loading) — app manages cache explicitly
- Write-Through — write to cache and DB simultaneously
- Write-Back — write to cache, async write to DB
- Read-Through — cache auto-fetches from DB on miss

**Cache eviction policies:** LRU, LFU, TTL, FIFO

#### Database Design
| | SQL (Relational) | NoSQL (Non-relational) |
|---|---|---|
| Structure | Tables, rows, columns | Documents, key-value, graph |
| ACID | ✅ Strong | Varies |
| Scaling | Vertical (mostly) | Horizontal (easy) |
| Use when | Strong consistency needed | High scale, flexible schema |
| Examples | PostgreSQL, MySQL | MongoDB, Cassandra, Redis |

**Database Indexing:**
- B-Tree Index — for range queries and equality
- Hash Index — for exact match lookups
- Composite Index — for multi-column queries (order matters!)

**Database Sharding:**
- Horizontal partitioning across multiple DB nodes
- Shard key selection is critical
- Types: Range-based, Hash-based, Directory-based

**Database Replication:**
- Master-Slave — writes to master, reads from slaves
- Master-Master — writes to multiple masters
- Increases read throughput and availability

#### CAP Theorem
You can only guarantee 2 of 3:
- **C**onsistency — all nodes return same data
- **A**vailability — every request gets a response
- **P**artition Tolerance — system works despite network partitions

Network partitions are unavoidable → choose CP or AP:
- **CP (Consistent + Partition tolerant):** HBase, MongoDB, Zookeeper
- **AP (Available + Partition tolerant):** Cassandra, CouchDB, DynamoDB

#### PACELC Extension
If no Partition (P), choose between Latency (L) and Consistency (C)
- e.g., DynamoDB: PA/EL (available during partitions, low latency otherwise)

#### Consistent Hashing
Used in distributed caches and load balancers. Servers and requests are mapped to a ring. When a server is added/removed, only K/n keys need to be remapped.

#### Message Queues
```
Producer → [Message Queue] → Consumer(s)
```
- Decouples services, handles spikes, enables async processing
- Kafka — high throughput, durable, replay support
- RabbitMQ — flexible routing, lower throughput
- SQS — managed, at-least-once delivery

#### API Design
**REST:** Stateless, resource-based URLs, HTTP verbs
```
GET    /users/123        → get user
POST   /users            → create user
PUT    /users/123        → replace user
PATCH  /users/123        → update user
DELETE /users/123        → delete user
```

**GraphQL:** Client specifies exact data needed, single endpoint

**gRPC:** Binary protocol, high performance, bidirectional streaming

#### CDN (Content Delivery Network)
Serves static assets from edge servers closer to users. Reduces latency, offloads origin server. Use for images, videos, CSS, JS.

#### Microservices vs Monolith
| | Monolith | Microservices |
|---|---|---|
| Deployment | Single unit | Independent services |
| Scaling | Scale everything | Scale only what's needed |
| Complexity | Low initially | High (distributed system) |
| Team Size | Small | Large, multiple teams |
| When to use | Startups, MVP | At scale, clear domain boundaries |

---

## 6. HLD — Classic Interview Problems

### 🐦 Design Twitter/X

**Requirements:**
- Post tweets (280 chars)
- Follow/unfollow users
- Home timeline (tweets from people you follow)
- Search tweets

**Core Components:**
```
[Client] → [API Gateway] → [Auth Service]
                        → [Tweet Service] → [Tweet DB (Cassandra)]
                        → [User Service]  → [User DB (MySQL)]
                        → [Feed Service]  → [Feed Cache (Redis)]
                        → [Search]        → [Elasticsearch]
                        → [Media Service] → [Object Storage (S3)]
```

**Timeline Generation:**
- **Push model (fanout on write):** When tweet posted, push to all followers' feeds. Fast reads, slow writes. Bad for celebrities with millions of followers.
- **Pull model (fanout on read):** Compute feed on request. Slow reads, fast writes.
- **Hybrid:** Push for normal users, pull for celebrities (>10k followers).

**Data Model:**
```
Users: user_id, username, email, followers_count
Tweets: tweet_id, user_id, content, created_at, like_count
Follows: follower_id, followee_id, created_at
```

**Key Estimations (1M DAU):**
- Tweets/day: 5M → ~58 tweets/sec
- Read:Write ratio ~100:1
- Storage: 5M tweets × 280 bytes = ~1.4 GB/day

---

### 📺 Design YouTube

**Requirements:**
- Upload videos
- Watch videos
- Search videos
- Comment and like

**Core Components:**
```
[Client] → [API Gateway] → [Upload Service] → [Raw Storage (S3)]
                                            → [Video Processor (FFmpeg workers)]
                                            → [CDN (Processed videos)]
                        → [Metadata Service] → [Video DB (MySQL)]
                        → [Search]          → [Elasticsearch]
                        → [Recommendation]  → [ML Pipeline]
```

**Video Processing Pipeline:**
1. User uploads raw video to S3 via presigned URL
2. Upload service triggers video processing job
3. Workers transcode to multiple resolutions (360p, 720p, 1080p, 4K)
4. Processed segments stored in S3, served via CDN
5. Metadata (title, description, tags) stored in MySQL

**Key Decisions:**
- Use adaptive bitrate streaming (HLS/DASH)
- Use presigned S3 URLs for direct upload (bypass app servers)
- CDN for video delivery — serves from edge closest to viewer

---

### 💬 Design WhatsApp

**Requirements:**
- 1:1 messaging
- Group messaging (max 256 members)
- Message status (sent, delivered, read)
- Online/offline presence

**Core Components:**
```
[Client] ←WebSocket→ [WebSocket Servers] → [Message Queue (Kafka)]
                                        → [Message DB (Cassandra)]
                     [Presence Service]  → [Redis (online status)]
                     [Notification Service] → [FCM/APNS]
```

**Message Flow:**
1. Sender connects via WebSocket
2. Message sent → stored in Cassandra with `SENT` status
3. If recipient online → deliver via WebSocket, update to `DELIVERED`
4. If recipient offline → store in queue, push notification, deliver on reconnect
5. Recipient opens message → update to `READ`, notify sender

**Data Model:**
```
Messages: message_id (UUID), sender_id, receiver_id, content, 
          encrypted_content, status, timestamp, group_id
```

---

### 🛒 Design Amazon

**Requirements:**
- Browse products
- Add to cart
- Place orders
- Inventory management
- Payment processing

**Core Microservices:**
```
Product Service  → Product DB (MySQL) + Elasticsearch
Cart Service     → Cart DB (Redis - TTL based)
Order Service    → Order DB (PostgreSQL)
Inventory Service → Inventory DB (MySQL) + Redis cache
Payment Service  → Payment DB + External Payment Gateway
Notification     → SES/SNS
```

**Critical Design Decisions:**
- Inventory reservation: Reserve stock when added to cart (15 min TTL)
- Payment: Use saga pattern for distributed transaction
- Flash sales: Use Redis atomic operations (DECR) to prevent overselling

**Saga Pattern for Order:**
```
1. Create Order → 2. Reserve Inventory → 3. Process Payment
   ↓ (rollback on failure)
3b. Refund Payment → 2b. Release Inventory → 1b. Cancel Order
```

---

### 🔍 Design Google Search

**Components:**
```
Crawler → URL Frontier → Raw HTML Store → Content Parser
       → Link Extractor → URL Store
       → Indexer → Inverted Index
                → Ranking Engine (PageRank + ML)
                → Query Processor → Results
```

**Inverted Index:**
```
"apple" → [(doc1, pos:[5,12]), (doc2, pos:[3])]
"phone" → [(doc1, pos:[6]), (doc3, pos:[1,8])]
```
Maps words to documents they appear in — enables O(1) lookup.

---

## 7. Interview Cheat Sheet

### LLD Interview Framework (30 min problem)

```
1. Clarify requirements (5 min)
   - What features are in scope?
   - Scale? Single machine or distributed?
   - Any specific constraints?

2. Define entities/classes (5 min)
   - List nouns → become classes
   - List verbs → become methods

3. Design class structure (10 min)
   - Relationships (has-a, is-a)
   - Apply relevant design patterns
   - Apply SOLID principles

4. Write code (10 min)
   - Start with core classes
   - Add relationships
   - Add edge cases
```

### HLD Interview Framework (45 min problem)

```
1. Clarify requirements (5 min)
   - Functional: what it does
   - Non-functional: scale, latency, consistency

2. Estimate scale (5 min)
   - Users, requests/sec, storage/day
   - Read:Write ratio

3. API design (5 min)
   - Define key endpoints

4. High-level diagram (10 min)
   - Core services
   - Databases
   - Caches
   - Message queues

5. Deep dive on hardest parts (15 min)
   - DB schema
   - Algorithm choices
   - Bottlenecks + solutions

6. Handle edge cases (5 min)
   - Single points of failure
   - What happens at 10x scale?
```

### Common Numbers to Remember

| Metric | Value |
|---|---|
| L1 cache | ~1 ns |
| L2 cache | ~10 ns |
| RAM | ~100 ns |
| SSD | ~1 ms |
| Network round trip (same region) | ~1 ms |
| Network round trip (cross-region) | ~100 ms |
| Requests/server/sec | ~1,000 - 10,000 |
| 1 million requests/day | ~12 req/sec |

### Design Pattern Quick Reference

| Problem | Pattern |
|---|---|
| One instance needed | Singleton |
| Create objects without specifying class | Factory |
| Add behavior dynamically | Decorator |
| Notify multiple objects of changes | Observer |
| Swap algorithms | Strategy |
| Undo/redo | Command |
| Simplify complex API | Facade |
| Bridge incompatible interfaces | Adapter |
| Control access | Proxy |
| One-to-many hierarchy | Composite |

### SOLID Quick Reference

| Letter | Principle | One Line |
|---|---|---|
| S | Single Responsibility | One class, one job |
| O | Open/Closed | Extend don't modify |
| L | Liskov Substitution | Subclass must work as parent |
| I | Interface Segregation | Don't force unused interfaces |
| D | Dependency Inversion | Depend on abstractions |

---

*Happy coding and good luck with your interviews! 🚀*
