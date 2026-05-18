# 🚀 Advanced System Design Interview Guide
### LLD (Factory Functions) + HLD — Product Company Level
> Complete reference for cracking FAANG / product company interviews

---

## 📋 Table of Contents

### LLD — Low Level Design
1. [OOP Concepts via Factory Functions](#1-oop-concepts-via-factory-functions)
2. [SOLID Principles](#2-solid-principles)
3. [Creational Patterns](#3-creational-patterns)
4. [Structural Patterns](#4-structural-patterns)
5. [Behavioral Patterns](#5-behavioral-patterns)
6. [Classic LLD Problems](#6-classic-lld-problems)
   - Parking Lot
   - Library Management System
   - ATM Machine
   - Snake & Ladder
   - Chess Game
   - Elevator System
   - Rate Limiter
   - Pub/Sub System
   - URL Shortener
   - Notification System
   - Cache System (LRU + LFU)
   - Task Scheduler

### HLD — High Level Design
7. [Core HLD Concepts](#7-core-hld-concepts)
8. [Classic HLD Problems](#8-classic-hld-problems)
   - Design Twitter/X
   - Design YouTube
   - Design WhatsApp
   - Design Uber
   - Design Amazon
   - Design Airbnb
   - Design Google Search
   - Design Netflix
   - Design Dropbox
   - Design TinyURL at Scale
9. [Interview Frameworks & Cheat Sheets](#9-interview-frameworks--cheat-sheets)

---

# LLD — Low Level Design

## 1. OOP Concepts via Factory Functions

### Encapsulation — Closures as Private State

```js
function createBankAccount(owner, initialBalance = 0) {
  // private — closures capture these, never exposed
  let balance = initialBalance;
  const transactions = [];

  // private helper
  function record(type, amount) {
    transactions.push({ type, amount, balance, date: new Date() });
  }

  // public interface — ONLY what we return
  return {
    get owner() { return owner; },
    get balance() { return balance; },

    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      balance += amount;
      record("DEPOSIT", amount);
      return this; // enables chaining
    },

    withdraw(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      record("WITHDRAW", amount);
      return this;
    },

    getHistory() { return [...transactions]; }, // return copy, not reference
    toString() { return `${owner}'s Account: $${balance}`; },
  };
}

const acc = createBankAccount("Alice", 1000);
acc.deposit(500).withdraw(200);
console.log(acc.balance);    // 1300
console.log(acc.getHistory());
```

### Inheritance → Composition

```js
// Instead of extends, we COMPOSE behaviors

function createAnimal(name, sound) {
  return {
    name,
    speak() { return `${name} says ${sound}`; },
    toString() { return `Animal(${name})`; },
  };
}

function createDog(name) {
  const animal = createAnimal(name, "woof");
  return {
    ...animal,                            // spread base
    fetch(item) { return `${name} fetches ${item}!`; },
    toString() { return `Dog(${name})`; },
  };
}

function createGuardDog(name, territory) {
  const dog = createDog(name);
  return {
    ...dog,
    guard() { return `${name} is guarding ${territory}!`; },
  };
}

const rex = createGuardDog("Rex", "warehouse");
console.log(rex.speak());   // Rex says woof
console.log(rex.fetch("ball")); // Rex fetches ball!
console.log(rex.guard());   // Rex is guarding warehouse!
```

### Polymorphism via Duck Typing

```js
function createCircle(radius) {
  return {
    type: "circle",
    area() { return Math.PI * radius ** 2; },
    perimeter() { return 2 * Math.PI * radius; },
    toString() { return `Circle(r=${radius})`; },
  };
}

function createRectangle(w, h) {
  return {
    type: "rectangle",
    area() { return w * h; },
    perimeter() { return 2 * (w + h); },
    toString() { return `Rectangle(${w}x${h})`; },
  };
}

function createTriangle(a, b, c) {
  const s = (a + b + c) / 2;
  return {
    type: "triangle",
    area() { return Math.sqrt(s * (s-a) * (s-b) * (s-c)); },
    perimeter() { return a + b + c; },
    toString() { return `Triangle(${a},${b},${c})`; },
  };
}

// All shapes respond to same interface — polymorphism!
const shapes = [createCircle(5), createRectangle(4, 6), createTriangle(3, 4, 5)];
const totalArea = shapes.reduce((sum, s) => sum + s.area(), 0);
console.log(`Total area: ${totalArea.toFixed(2)}`);
```

### Mixins — Reusable Behavior Injection

```js
// Focused behavior factories
function withTimestamps(obj) {
  const createdAt = new Date();
  let updatedAt = new Date();
  return {
    ...obj,
    get createdAt() { return createdAt; },
    get updatedAt() { return updatedAt; },
    touch() { updatedAt = new Date(); return this; },
  };
}

function withSoftDelete(obj) {
  let deletedAt = null;
  return {
    ...obj,
    get isDeleted() { return deletedAt !== null; },
    get deletedAt() { return deletedAt; },
    softDelete() { deletedAt = new Date(); },
    restore() { deletedAt = null; },
  };
}

function withValidation(obj, rules) {
  return {
    ...obj,
    validate() {
      const errors = [];
      for (const [field, rule] of Object.entries(rules)) {
        if (!rule.check(obj[field])) errors.push(`${field}: ${rule.message}`);
      }
      return { valid: errors.length === 0, errors };
    },
  };
}

function withEvents(obj) {
  const listeners = {};
  return {
    ...obj,
    on(event, fn) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(fn);
      return () => { listeners[event] = listeners[event].filter(f => f !== fn); };
    },
    emit(event, data) {
      (listeners[event] || []).forEach(fn => fn(data));
    },
  };
}

// Compose all behaviors
function createUser(data) {
  const base = { ...data };
  return withEvents(
    withSoftDelete(
      withTimestamps(
        withValidation(base, {
          name:  { check: v => v?.length > 0,   message: "Name required" },
          email: { check: v => v?.includes("@"), message: "Invalid email" },
        })
      )
    )
  );
}

const user = createUser({ name: "Alice", email: "alice@example.com" });
console.log(user.validate()); // { valid: true, errors: [] }
user.on("profileUpdate", (data) => console.log("Profile updated:", data));
user.emit("profileUpdate", { field: "name" });
```

---

## 2. SOLID Principles

### S — Single Responsibility

```js
// ❌ Bad — one function doing everything
function processOrder(order) {
  // validate
  if (!order.items.length) throw new Error("Empty order");
  // calculate
  const total = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  // save to DB
  db.save({ ...order, total });
  // send email
  emailService.send(order.user.email, `Order confirmed: $${total}`);
  // log
  logger.log(`Order ${order.id} processed`);
}

// ✅ Good — each function has ONE job
function createOrderValidator() {
  return {
    validate(order) {
      if (!order.items?.length) throw new Error("Order must have items");
      if (!order.userId) throw new Error("Order must have a user");
      return true;
    },
  };
}

function createPricingEngine() {
  return {
    calculate(items, discountCode = null) {
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const discount = discountCode ? subtotal * 0.1 : 0;
      const tax = (subtotal - discount) * 0.08;
      return { subtotal, discount, tax, total: subtotal - discount + tax };
    },
  };
}

function createOrderRepository(db) {
  return {
    save(order) { return db.insert("orders", order); },
    findById(id) { return db.find("orders", { id }); },
  };
}

function createOrderService({ validator, pricing, repo, emailer, logger }) {
  return {
    async process(order) {
      validator.validate(order);
      const pricing_result = pricing.calculate(order.items, order.discountCode);
      const saved = await repo.save({ ...order, ...pricing_result });
      await emailer.send(order.userEmail, "Order confirmed", saved);
      logger.info(`Order ${saved.id} processed: $${pricing_result.total}`);
      return saved;
    },
  };
}
```

### O — Open/Closed

```js
// ❌ Bad — add new payment means modifying existing code
function processPayment(method, amount) {
  if (method === "credit") { /* credit logic */ }
  else if (method === "paypal") { /* paypal logic */ }
  else if (method === "crypto") { /* need to modify to add this */ }
}

// ✅ Good — extend without modifying
function createCreditCardPayment() {
  return {
    type: "credit_card",
    process(amount) { console.log(`Charged $${amount} to credit card`); return true; },
    refund(amount) { console.log(`Refunded $${amount} to credit card`); return true; },
  };
}

function createPayPalPayment(email) {
  return {
    type: "paypal",
    process(amount) { console.log(`Sent $${amount} via PayPal to ${email}`); return true; },
    refund(amount) { console.log(`Refunded $${amount} via PayPal`); return true; },
  };
}

function createCryptoPayment(walletAddress) {
  return {
    type: "crypto",
    process(amount) { console.log(`Sent $${amount} to wallet ${walletAddress}`); return true; },
    refund(amount) { console.log(`Refunded $${amount} to wallet`); return true; },
  };
}

// PaymentProcessor never changes when new payment methods are added
function createPaymentProcessor() {
  const handlers = new Map();
  return {
    register(paymentMethod) {
      handlers.set(paymentMethod.type, paymentMethod);
    },
    process(type, amount) {
      const handler = handlers.get(type);
      if (!handler) throw new Error(`Unknown payment type: ${type}`);
      return handler.process(amount);
    },
  };
}

const processor = createPaymentProcessor();
processor.register(createCreditCardPayment());
processor.register(createPayPalPayment("user@example.com"));
processor.register(createCryptoPayment("0xABC..."));
processor.process("crypto", 100); // works without changing processor
```

### L — Liskov Substitution

```js
// ❌ Bad — Square breaks Rectangle's contract
function createRectangle(w, h) {
  let width = w, height = h;
  return {
    setWidth(w) { width = w; },
    setHeight(h) { height = h; },
    area() { return width * height; },
  };
}

function createSquare(side) {
  let s = side;
  return {
    setWidth(w) { s = w; },    // forces both to change — breaks LSP!
    setHeight(h) { s = h; },
    area() { return s * s; },
  };
}

// ✅ Good — separate, non-conflicting shapes
function createShape(type) {
  return { type };
}

function createRect(w, h) {
  return { ...createShape("rectangle"), width: w, height: h,
    area() { return w * h; }, scale(f) { return createRect(w * f, h * f); } };
}

function createSquare(side) {
  return { ...createShape("square"), side,
    area() { return side ** 2; }, scale(f) { return createSquare(side * f); } };
}

// Both work interchangeably where a "shape" is expected
function printArea(shape) {
  console.log(`${shape.type} area: ${shape.area()}`);
}
[createRect(4, 6), createSquare(5)].forEach(printArea);
```

### I — Interface Segregation

```js
// ❌ Bad — thin clients forced to implement fat interface
function createAllInOneMachine() {
  return {
    print() {},
    scan() {},
    fax() {},       // not every "printer" can fax
    email() {},     // not every "printer" can email
  };
}

// ✅ Good — small, focused capabilities
function withPrinting(obj) {
  return { ...obj, print(doc) { console.log(`Printing: ${doc}`); } };
}

function withScanning(obj) {
  return { ...obj, scan() { console.log("Scanning..."); return "scanned_data"; } };
}

function withFaxing(obj) {
  return { ...obj, fax(number, doc) { console.log(`Faxing ${doc} to ${number}`); } };
}

// Basic printer — only printing
const basicPrinter = withPrinting({});

// Office machine — all capabilities
const officeMachine = withFaxing(withScanning(withPrinting({})));

// Copier — print + scan only
const copier = withScanning(withPrinting({}));
```

### D — Dependency Inversion

```js
// ❌ Bad — high-level code depends on low-level detail
function createUserService() {
  const db = new MySQLDatabase(); // concrete dependency!
  return {
    getUser(id) { return db.query(`SELECT * FROM users WHERE id=${id}`); },
  };
}

// ✅ Good — depend on abstraction (interface/contract)
function createMySQLRepo() {
  return {
    findById(id) { console.log(`MySQL: finding user ${id}`); return { id, name: "Alice" }; },
    save(user) { console.log(`MySQL: saving user`); },
  };
}

function createMongoRepo() {
  return {
    findById(id) { console.log(`MongoDB: finding user ${id}`); return { id, name: "Alice" }; },
    save(user) { console.log(`MongoDB: saving user`); },
  };
}

function createRedisCache() {
  const cache = new Map();
  return {
    get(key) { return cache.get(key) ?? null; },
    set(key, value, ttl) { cache.set(key, value); },
    del(key) { cache.delete(key); },
  };
}

// UserService depends on abstractions — inject anything
function createUserService(repo, cache) {
  return {
    async getUser(id) {
      const cached = cache.get(`user:${id}`);
      if (cached) return cached;
      const user = await repo.findById(id);
      cache.set(`user:${id}`, user, 300);
      return user;
    },
    async updateUser(id, data) {
      const user = await repo.save({ id, ...data });
      cache.del(`user:${id}`);
      return user;
    },
  };
}

// Swap implementations without touching UserService
const service = createUserService(createMongoRepo(), createRedisCache());
```

---

## 3. Creational Patterns

### Singleton

```js
// Module-level singleton — most idiomatic in JS
function createSingleton(factory) {
  let instance = null;
  return {
    getInstance(...args) {
      if (!instance) instance = factory(...args);
      return instance;
    },
    reset() { instance = null; }, // useful for testing
  };
}

// Usage: Config Manager
const ConfigManager = createSingleton(() => {
  const config = {};
  return {
    set(key, value) { config[key] = value; },
    get(key) { return config[key]; },
    getAll() { return { ...config }; },
  };
});

const c1 = ConfigManager.getInstance();
const c2 = ConfigManager.getInstance();
c1.set("theme", "dark");
console.log(c2.get("theme")); // "dark" — same instance
console.log(c1 === c2);       // true
```

### Factory Method

```js
function createLogger(type, options = {}) {
  const prefix = options.prefix || "";
  const timestamp = () => new Date().toISOString();

  const formatters = {
    console: {
      log(msg) { console.log(`${timestamp()} [LOG] ${prefix}${msg}`); },
      error(msg) { console.error(`${timestamp()} [ERR] ${prefix}${msg}`); },
      warn(msg) { console.warn(`${timestamp()} [WRN] ${prefix}${msg}`); },
    },
    file: {
      log(msg) { /* write to file */ console.log(`FILE: ${msg}`); },
      error(msg) { /* write to file */ console.error(`FILE ERR: ${msg}`); },
      warn(msg) { /* write to file */ console.warn(`FILE WRN: ${msg}`); },
    },
    json: {
      log(msg) { console.log(JSON.stringify({ level: "log", msg, ts: timestamp() })); },
      error(msg) { console.log(JSON.stringify({ level: "error", msg, ts: timestamp() })); },
      warn(msg) { console.log(JSON.stringify({ level: "warn", msg, ts: timestamp() })); },
    },
  };

  const logger = formatters[type];
  if (!logger) throw new Error(`Unknown logger type: ${type}`);
  return logger;
}

const log = createLogger("json", { prefix: "[UserService] " });
log.log("User created");
log.error("Connection failed");
```

### Abstract Factory

```js
// UI Component families
function createDarkThemeFactory() {
  return {
    createButton(label) {
      return {
        render() { return `<button class="dark-btn">${label}</button>`; },
        onClick(fn) { /* attach handler */ },
      };
    },
    createInput(placeholder) {
      return {
        render() { return `<input class="dark-input" placeholder="${placeholder}" />`; },
        getValue() { return ""; },
      };
    },
    createModal(title, content) {
      return {
        render() { return `<div class="dark-modal"><h2>${title}</h2>${content}</div>`; },
        show() { console.log(`Dark modal: ${title}`); },
        hide() {},
      };
    },
  };
}

function createLightThemeFactory() {
  return {
    createButton(label) {
      return { render() { return `<button class="light-btn">${label}</button>`; } };
    },
    createInput(placeholder) {
      return { render() { return `<input class="light-input" placeholder="${placeholder}" />`; } };
    },
    createModal(title, content) {
      return { render() { return `<div class="light-modal"><h2>${title}</h2>${content}</div>`; } };
    },
  };
}

// App uses factory without knowing which theme
function renderLoginPage(uiFactory) {
  const btn = uiFactory.createButton("Login");
  const emailInput = uiFactory.createInput("Email");
  const passwordInput = uiFactory.createInput("Password");
  return `${emailInput.render()}${passwordInput.render()}${btn.render()}`;
}

const theme = process.env.THEME === "dark"
  ? createDarkThemeFactory()
  : createLightThemeFactory();

console.log(renderLoginPage(theme));
```

### Builder

```js
function createQueryBuilder() {
  let table = "";
  let fields = ["*"];
  const conditions = [];
  const joins = [];
  let limitVal = null;
  let offsetVal = null;
  let orderByVal = null;
  let groupByVal = null;
  const params = [];

  const builder = {
    from(t) { table = t; return builder; },
    select(...f) { fields = f; return builder; },
    where(condition, ...values) {
      conditions.push(condition);
      params.push(...values);
      return builder;
    },
    join(table, on, type = "INNER") {
      joins.push(`${type} JOIN ${table} ON ${on}`);
      return builder;
    },
    limit(n) { limitVal = n; return builder; },
    offset(n) { offsetVal = n; return builder; },
    orderBy(field, dir = "ASC") { orderByVal = `${field} ${dir}`; return builder; },
    groupBy(field) { groupByVal = field; return builder; },

    build() {
      if (!table) throw new Error("Table is required");
      let sql = `SELECT ${fields.join(", ")} FROM ${table}`;
      if (joins.length) sql += ` ${joins.join(" ")}`;
      if (conditions.length) sql += ` WHERE ${conditions.join(" AND ")}`;
      if (groupByVal) sql += ` GROUP BY ${groupByVal}`;
      if (orderByVal) sql += ` ORDER BY ${orderByVal}`;
      if (limitVal !== null) sql += ` LIMIT ${limitVal}`;
      if (offsetVal !== null) sql += ` OFFSET ${offsetVal}`;
      return { sql, params };
    },

    clone() {
      // deep clone the builder state
      return createQueryBuilder()
        .from(table)
        .select(...fields);
    },
  };

  return builder;
}

const { sql, params } = createQueryBuilder()
  .from("users u")
  .select("u.id", "u.name", "o.total")
  .join("orders o", "u.id = o.user_id", "LEFT")
  .where("u.active = ?", true)
  .where("o.total > ?", 100)
  .orderBy("o.total", "DESC")
  .limit(20)
  .offset(40)
  .build();

console.log(sql);
// SELECT u.id, u.name, o.total FROM users u LEFT JOIN orders o ON ...
```

### Prototype (Object Cloning)

```js
function createPrototype(template) {
  return {
    clone(overrides = {}) {
      // deep clone the template and apply overrides
      const cloned = JSON.parse(JSON.stringify(template));
      return { ...cloned, ...overrides };
    },
  };
}

// Game enemy spawning
const orcTemplate = {
  type: "orc",
  health: 100,
  speed: 3,
  attack: 15,
  loot: ["gold", "sword"],
  ai: "aggressive",
};

const orcProto = createPrototype(orcTemplate);

// Spawn variants quickly
const orcWarrior = orcProto.clone({ health: 200, attack: 30, type: "orc-warrior" });
const orcArcher = orcProto.clone({ speed: 5, attack: 25, type: "orc-archer" });
const orcShaman = orcProto.clone({ health: 80, ai: "support", type: "orc-shaman" });

console.log(orcWarrior); // customized clone
```

---

## 4. Structural Patterns

### Adapter

```js
// Adapting old API to new interface
function createOldPaymentGateway() {
  return {
    // old interface
    makePayment(cardNumber, expiryDate, cvv, amount) {
      console.log(`Old API: Charging ${amount} to card ending ${cardNumber.slice(-4)}`);
      return { success: true, transactionId: `OLD-${Date.now()}` };
    },
    refundPayment(transactionId, amount) {
      console.log(`Old API: Refunding ${amount} for ${transactionId}`);
      return { success: true };
    },
  };
}

// New interface we want everywhere
// { charge({ amount, card: { number, expiry, cvv } }) }
function createPaymentAdapter(oldGateway) {
  return {
    charge({ amount, card }) {
      const result = oldGateway.makePayment(card.number, card.expiry, card.cvv, amount);
      return { success: result.success, id: result.transactionId };
    },
    refund({ transactionId, amount }) {
      return oldGateway.refundPayment(transactionId, amount);
    },
  };
}

// Third-party API adapter (e.g. Stripe)
function createStripeAdapter(stripeClient) {
  return {
    async charge({ amount, card }) {
      const intent = await stripeClient.paymentIntents.create({
        amount: amount * 100, // Stripe uses cents
        currency: "usd",
        payment_method_data: { type: "card", card },
      });
      return { success: true, id: intent.id };
    },
    async refund({ transactionId, amount }) {
      await stripeClient.refunds.create({ payment_intent: transactionId, amount: amount * 100 });
      return { success: true };
    },
  };
}
```

### Decorator

```js
function createCoffee() {
  return {
    name: "Coffee",
    cost() { return 5; },
    description() { return "Coffee"; },
  };
}

// Each decorator wraps the previous
function withMilk(beverage) {
  return {
    ...beverage,
    cost() { return beverage.cost() + 2; },
    description() { return beverage.description() + " + Milk"; },
  };
}

function withSugar(beverage) {
  return {
    ...beverage,
    cost() { return beverage.cost() + 1; },
    description() { return beverage.description() + " + Sugar"; },
  };
}

function withVanilla(beverage) {
  return {
    ...beverage,
    cost() { return beverage.cost() + 3; },
    description() { return beverage.description() + " + Vanilla"; },
  };
}

function withWhip(beverage) {
  return {
    ...beverage,
    cost() { return beverage.cost() + 1.5; },
    description() { return beverage.description() + " + Whip"; },
  };
}

// Pipe helper for clean composition
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const myDrink = pipe(withMilk, withVanilla, withSugar, withWhip)(createCoffee());
console.log(myDrink.description()); // Coffee + Milk + Vanilla + Sugar + Whip
console.log(`$${myDrink.cost()}`);  // $12.5
```

### Facade

```js
function createHomeTheaterFacade({ tv, soundSystem, lights, streaming }) {
  return {
    watchMovie(title) {
      console.log(`\n🎬 Setting up for movie: ${title}`);
      lights.dim(20);
      tv.turnOn();
      tv.setInput("HDMI-1");
      soundSystem.turnOn();
      soundSystem.setSurroundSound(true);
      soundSystem.setVolume(40);
      streaming.play(title);
    },

    stopMovie() {
      console.log("\n⏹ Stopping movie...");
      streaming.stop();
      soundSystem.turnOff();
      tv.turnOff();
      lights.dim(100);
    },

    gameMode() {
      lights.dim(50);
      tv.turnOn();
      tv.setInput("HDMI-2");
      soundSystem.turnOn();
      soundSystem.setSurroundSound(false);
      soundSystem.setVolume(60);
    },
  };
}

// Client just calls simple methods — doesn't know about subsystems
const theater = createHomeTheaterFacade({ tv, soundSystem, lights, streaming });
theater.watchMovie("Inception");
```

### Proxy

```js
// Proxy for API calls — adds caching, auth, rate limiting, logging
function createAPIProxy(realAPI, options = {}) {
  const {
    cacheTTL = 60000,
    maxRetries = 3,
    allowedRoles = [],
    currentUserRole = "guest",
  } = options;

  const cache = new Map();
  const requestCounts = new Map();

  function isCached(key) {
    const entry = cache.get(key);
    return entry && Date.now() - entry.ts < cacheTTL;
  }

  function checkAuth(endpoint) {
    if (allowedRoles.length && !allowedRoles.includes(currentUserRole)) {
      throw new Error(`403: ${currentUserRole} cannot access ${endpoint}`);
    }
  }

  async function withRetry(fn, retries = maxRetries) {
    try {
      return await fn();
    } catch (err) {
      if (retries > 0) {
        await new Promise(r => setTimeout(r, 1000 * (maxRetries - retries + 1)));
        return withRetry(fn, retries - 1);
      }
      throw err;
    }
  }

  return {
    async get(endpoint, params = {}) {
      checkAuth(endpoint);
      const cacheKey = `${endpoint}:${JSON.stringify(params)}`;

      if (isCached(cacheKey)) {
        console.log(`[CACHE HIT] ${endpoint}`);
        return cache.get(cacheKey).data;
      }

      console.log(`[API CALL] GET ${endpoint}`);
      const data = await withRetry(() => realAPI.get(endpoint, params));
      cache.set(cacheKey, { data, ts: Date.now() });
      return data;
    },

    async post(endpoint, body) {
      checkAuth(endpoint);
      console.log(`[API CALL] POST ${endpoint}`);
      return withRetry(() => realAPI.post(endpoint, body));
    },
  };
}
```

### Composite

```js
// File System — Files and Folders share same interface
function createFile(name, size, type = "file") {
  return {
    name,
    type,
    isLeaf: true,
    getSize() { return size; },
    find(query) {
      return name.toLowerCase().includes(query.toLowerCase()) ? [this] : [];
    },
    display(indent = 0) {
      const icon = type === "file" ? "📄" : "🖼";
      console.log(`${"  ".repeat(indent)}${icon} ${name} (${size}KB)`);
    },
    toJSON() { return { name, size, type }; },
  };
}

function createFolder(name) {
  const children = [];
  return {
    name,
    type: "folder",
    isLeaf: false,

    add(...items) { children.push(...items); return this; },
    remove(name) {
      const idx = children.findIndex(c => c.name === name);
      if (idx !== -1) children.splice(idx, 1);
      return this;
    },

    getSize() { return children.reduce((sum, c) => sum + c.getSize(), 0); },

    find(query) {
      const results = name.toLowerCase().includes(query.toLowerCase()) ? [this] : [];
      children.forEach(c => results.push(...c.find(query)));
      return results;
    },

    display(indent = 0) {
      console.log(`${"  ".repeat(indent)}📁 ${name}/`);
      children.forEach(c => c.display(indent + 1));
    },

    toJSON() {
      return { name, type: "folder", children: children.map(c => c.toJSON()) };
    },
  };
}

// Usage
const root = createFolder("root");
const src = createFolder("src");
const components = createFolder("components");

components.add(
  createFile("Button.jsx", 8),
  createFile("Modal.jsx", 12),
  createFile("Table.jsx", 15),
);

src.add(
  components,
  createFile("index.js", 3),
  createFile("App.jsx", 20),
);

root.add(
  src,
  createFile("package.json", 2),
  createFile("README.md", 5),
);

root.display();
console.log(`Total: ${root.getSize()}KB`);
console.log(root.find("button")); // finds Button.jsx
```

---

## 5. Behavioral Patterns

### Observer (Event Emitter)

```js
function createEventEmitter() {
  const events = new Map();

  return {
    on(event, listener, options = {}) {
      if (!events.has(event)) events.set(event, new Set());
      const wrapper = options.once
        ? (...args) => { listener(...args); this.off(event, wrapper); }
        : listener;
      events.get(event).add(wrapper);
      return () => this.off(event, wrapper); // unsubscribe fn
    },

    once(event, listener) {
      return this.on(event, listener, { once: true });
    },

    off(event, listener) {
      events.get(event)?.delete(listener);
    },

    emit(event, ...args) {
      events.get(event)?.forEach(fn => {
        try { fn(...args); }
        catch (err) { console.error(`[EventEmitter] Error in ${event}:`, err.message); }
      });
    },

    listenerCount(event) { return events.get(event)?.size ?? 0; },
    eventNames() { return [...events.keys()]; },
    removeAllListeners(event) {
      if (event) events.delete(event);
      else events.clear();
    },
  };
}

// Build reactive store on top
function createStore(initialState, reducer) {
  const emitter = createEventEmitter();
  let state = { ...initialState };
  const history = [state];

  return {
    getState() { return { ...state }; },

    dispatch(action) {
      const prevState = state;
      state = reducer(state, action);
      history.push(state);
      emitter.emit("change", state, prevState, action);
    },

    subscribe(listener) {
      return emitter.on("change", listener);
    },

    getHistory() { return [...history]; },

    // time-travel debugging
    rewind(steps = 1) {
      if (history.length > steps) {
        history.splice(-steps);
        state = history[history.length - 1];
        emitter.emit("change", state);
      }
    },
  };
}

// Redux-like usage
const counterReducer = (state, action) => {
  switch (action.type) {
    case "INCREMENT": return { ...state, count: state.count + (action.by ?? 1) };
    case "DECREMENT": return { ...state, count: state.count - (action.by ?? 1) };
    case "RESET": return { ...state, count: 0 };
    default: return state;
  }
};

const store = createStore({ count: 0 }, counterReducer);
store.subscribe((state) => console.log("State:", state));
store.dispatch({ type: "INCREMENT" });
store.dispatch({ type: "INCREMENT", by: 5 });
store.dispatch({ type: "DECREMENT" });
```

### Strategy

```js
// Sort strategies
const sortStrategies = {
  bubble(arr) {
    const a = [...arr];
    for (let i = 0; i < a.length; i++)
      for (let j = 0; j < a.length - i - 1; j++)
        if (a[j] > a[j + 1]) [a[j], a[j + 1]] = [a[j + 1], a[j]];
    return a;
  },
  quick(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[Math.floor(arr.length / 2)];
    return [
      ...sortStrategies.quick(arr.filter(x => x < pivot)),
      ...arr.filter(x => x === pivot),
      ...sortStrategies.quick(arr.filter(x => x > pivot)),
    ];
  },
  merge(arr) {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const merge = (l, r) => {
      const result = [];
      while (l.length && r.length)
        result.push(l[0] <= r[0] ? l.shift() : r.shift());
      return [...result, ...l, ...r];
    };
    return merge(sortStrategies.merge(arr.slice(0, mid)), sortStrategies.merge(arr.slice(mid)));
  },
};

function createSorter(strategyName = "quick") {
  let strategy = sortStrategies[strategyName];

  return {
    setStrategy(name) {
      if (!sortStrategies[name]) throw new Error(`Unknown strategy: ${name}`);
      strategy = sortStrategies[name];
    },
    sort(data) { return strategy(data); },
    benchmark(data) {
      const start = performance.now();
      const result = strategy(data);
      return { result, time: performance.now() - start };
    },
  };
}

// Auth strategies
function createAuthService() {
  const strategies = {};

  return {
    registerStrategy(name, strategy) {
      strategies[name] = strategy;
    },

    async authenticate(method, credentials) {
      const strategy = strategies[method];
      if (!strategy) throw new Error(`Auth method ${method} not supported`);
      return strategy.authenticate(credentials);
    },
  };
}

function createJWTStrategy(secret) {
  return {
    async authenticate({ token }) {
      // verify JWT token
      return { userId: "123", role: "admin" };
    },
  };
}

function createOAuthStrategy(provider) {
  return {
    async authenticate({ code }) {
      // exchange code for token with provider
      return { userId: "456", provider };
    },
  };
}
```

### Command (with Undo/Redo)

```js
function createCommandHistory(maxHistory = 100) {
  const undoStack = [];
  const redoStack = [];

  function execute(command) {
    command.execute();
    undoStack.push(command);
    if (undoStack.length > maxHistory) undoStack.shift();
    redoStack.length = 0; // clear redo stack on new action
  }

  return {
    execute,

    undo() {
      const cmd = undoStack.pop();
      if (cmd) { cmd.undo(); redoStack.push(cmd); return true; }
      return false;
    },

    redo() {
      const cmd = redoStack.pop();
      if (cmd) { cmd.execute(); undoStack.push(cmd); return true; }
      return false;
    },

    get canUndo() { return undoStack.length > 0; },
    get canRedo() { return redoStack.length > 0; },
    get historySize() { return undoStack.length; },
  };
}

// Canvas drawing app
function createCanvas() {
  const shapes = [];
  const history = createCommandHistory();

  function makeAddCommand(shape) {
    return {
      execute() { shapes.push(shape); },
      undo() { shapes.splice(shapes.indexOf(shape), 1); },
    };
  }

  function makeMoveCommand(shape, dx, dy) {
    return {
      execute() { shape.x += dx; shape.y += dy; },
      undo() { shape.x -= dx; shape.y -= dy; },
    };
  }

  function makeDeleteCommand(shape) {
    let index;
    return {
      execute() {
        index = shapes.indexOf(shape);
        shapes.splice(index, 1);
      },
      undo() { shapes.splice(index, 0, shape); },
    };
  }

  return {
    addShape(shape) { history.execute(makeAddCommand(shape)); },
    moveShape(shape, dx, dy) { history.execute(makeMoveCommand(shape, dx, dy)); },
    deleteShape(shape) { history.execute(makeDeleteCommand(shape)); },
    undo() { return history.undo(); },
    redo() { return history.redo(); },
    getShapes() { return [...shapes]; },
    get canUndo() { return history.canUndo; },
    get canRedo() { return history.canRedo; },
  };
}
```

### Chain of Responsibility

```js
// Middleware pipeline — like Express.js
function createMiddlewarePipeline() {
  const middlewares = [];

  function createNext(index, context, finalHandler) {
    return function next(err) {
      if (err) return handleError(err, context);
      const middleware = middlewares[index];
      if (!middleware) return finalHandler(context);
      middleware(context, createNext(index + 1, context, finalHandler));
    };
  }

  function handleError(err, context) {
    console.error(`[Pipeline Error] ${err.message}`);
    context.error = err;
  }

  return {
    use(middleware) { middlewares.push(middleware); return this; },

    execute(context, finalHandler) {
      createNext(0, context, finalHandler)();
    },
  };
}

// HTTP Request pipeline
const pipeline = createMiddlewarePipeline();

pipeline
  .use((ctx, next) => {
    // Logger
    console.log(`${ctx.method} ${ctx.path}`);
    ctx.startTime = Date.now();
    next();
    console.log(`Response time: ${Date.now() - ctx.startTime}ms`);
  })
  .use((ctx, next) => {
    // Auth
    if (!ctx.headers?.authorization) {
      ctx.status = 401;
      return ctx.send("Unauthorized");
    }
    ctx.user = { id: "123" }; // decoded from token
    next();
  })
  .use((ctx, next) => {
    // Rate limiter
    if (ctx.requestCount > 100) {
      ctx.status = 429;
      return ctx.send("Too Many Requests");
    }
    next();
  })
  .use((ctx, next) => {
    // Body parser
    ctx.body = JSON.parse(ctx.rawBody || "{}");
    next();
  });
```

### State Pattern

```js
function createStateMachine(config) {
  const { initial, states, transitions } = config;
  let currentState = initial;
  const listeners = [];

  function transition(event, data) {
    const key = `${currentState}:${event}`;
    const nextState = transitions[key];

    if (!nextState) {
      throw new Error(`Invalid transition: ${event} from ${currentState}`);
    }

    const prevState = currentState;
    states[currentState]?.onExit?.();
    currentState = nextState;
    states[currentState]?.onEnter?.(data);

    listeners.forEach(fn => fn({ from: prevState, to: currentState, event, data }));
    return currentState;
  }

  return {
    get state() { return currentState; },
    send(event, data) { return transition(event, data); },
    can(event) { return !!transitions[`${currentState}:${event}`]; },
    onTransition(fn) { listeners.push(fn); return () => listeners.splice(listeners.indexOf(fn), 1); },
  };
}

// Order lifecycle state machine
function createOrderStateMachine(orderId) {
  return createStateMachine({
    initial: "pending",
    states: {
      pending: { onEnter: () => console.log(`Order ${orderId}: Pending`) },
      confirmed: { onEnter: () => console.log(`Order ${orderId}: Confirmed!`) },
      processing: { onEnter: () => console.log(`Order ${orderId}: Processing`) },
      shipped: { onEnter: ({ trackingId }) => console.log(`Order ${orderId}: Shipped! Tracking: ${trackingId}`) },
      delivered: { onEnter: () => console.log(`Order ${orderId}: Delivered!`) },
      cancelled: { onEnter: ({ reason }) => console.log(`Order ${orderId}: Cancelled. Reason: ${reason}`) },
    },
    transitions: {
      "pending:CONFIRM":    "confirmed",
      "pending:CANCEL":     "cancelled",
      "confirmed:PROCESS":  "processing",
      "confirmed:CANCEL":   "cancelled",
      "processing:SHIP":    "shipped",
      "shipped:DELIVER":    "delivered",
    },
  });
}

const order = createOrderStateMachine("ORD-001");
order.onTransition(({ from, to, event }) => console.log(`  [${from}] --${event}--> [${to}]`));
order.send("CONFIRM");
order.send("PROCESS");
order.send("SHIP", { trackingId: "TRK-12345" });
order.send("DELIVER");
```

### Iterator

```js
function createPaginatedIterator(fetchPage, pageSize = 20) {
  let page = 0;
  let buffer = [];
  let bufferIndex = 0;
  let done = false;

  return {
    async next() {
      if (bufferIndex < buffer.length) {
        return { value: buffer[bufferIndex++], done: false };
      }
      if (done) return { value: undefined, done: true };

      buffer = await fetchPage(page++, pageSize);
      bufferIndex = 0;

      if (buffer.length < pageSize) done = true;
      if (buffer.length === 0) return { value: undefined, done: true };

      return { value: buffer[bufferIndex++], done: false };
    },

    [Symbol.asyncIterator]() { return this; },
  };
}

// Usage: Stream over a large dataset
async function processAllUsers() {
  const userIterator = createPaginatedIterator(async (page, size) => {
    // Simulate DB fetch
    console.log(`Fetching page ${page}...`);
    return Array.from({ length: size }, (_, i) => ({ id: page * size + i, name: `User ${page * size + i}` }));
  }, 5);

  for await (const user of userIterator) {
    console.log(user);
    if (user.id > 12) break; // stop after 13 users
  }
}
```

---

## 6. Classic LLD Problems

### 🅿️ Parking Lot System (Full Implementation)

```js
// --- Constants ---
const VehicleType = Object.freeze({ MOTORCYCLE: "MOTORCYCLE", CAR: "CAR", TRUCK: "TRUCK" });
const SpotType = Object.freeze({ SMALL: "SMALL", MEDIUM: "MEDIUM", LARGE: "LARGE" });

// --- Vehicle ---
function createVehicle(plate, type) {
  if (!Object.values(VehicleType).includes(type)) throw new Error(`Invalid type: ${type}`);
  return Object.freeze({ plate, type, registeredAt: new Date() });
}

// --- Parking Spot ---
function createParkingSpot(id, type, floor) {
  const COMPATIBLE = {
    [SpotType.SMALL]:  [VehicleType.MOTORCYCLE],
    [SpotType.MEDIUM]: [VehicleType.MOTORCYCLE, VehicleType.CAR],
    [SpotType.LARGE]:  [VehicleType.MOTORCYCLE, VehicleType.CAR, VehicleType.TRUCK],
  };

  let vehicle = null;

  return {
    id, type, floor,
    get isAvailable() { return vehicle === null; },
    get occupiedBy() { return vehicle; },

    canFit(vehicleType) {
      return this.isAvailable && COMPATIBLE[type].includes(vehicleType);
    },

    park(v) {
      if (!this.canFit(v.type)) throw new Error(`Spot ${id} cannot fit ${v.type}`);
      vehicle = v;
    },

    vacate() {
      const v = vehicle;
      vehicle = null;
      return v;
    },
  };
}

// --- Ticket ---
function createTicket(vehicle, spot) {
  const id = `TKT-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const entryTime = Date.now();

  return {
    id,
    vehicle,
    spot,
    entryTime: new Date(entryTime),

    calculateFee(rates = { MOTORCYCLE: 5, CAR: 10, TRUCK: 20 }) {
      const hours = Math.ceil((Date.now() - entryTime) / 3_600_000);
      return Math.max(1, hours) * (rates[vehicle.type] ?? 10);
    },
  };
}

// --- Floor ---
function createParkingFloor(number, spotsConfig) {
  const spots = spotsConfig.map(c => createParkingSpot(c.id, c.type, number));

  return {
    number,
    get spots() { return [...spots]; },
    get availableCount() { return spots.filter(s => s.isAvailable).length; },
    get totalCount() { return spots.length; },

    findSpot(vehicleType) {
      // find best fit (smallest compatible spot first)
      const order = [SpotType.SMALL, SpotType.MEDIUM, SpotType.LARGE];
      for (const type of order) {
        const spot = spots.find(s => s.type === type && s.canFit(vehicleType));
        if (spot) return spot;
      }
      return null;
    },
  };
}

// --- Parking Lot ---
function createParkingLot(name, floors, rates) {
  const tickets = new Map();
  const emitter = createEventEmitter();

  return {
    name,
    on: emitter.on.bind(emitter),

    parkVehicle(vehicle) {
      for (const floor of floors) {
        const spot = floor.findSpot(vehicle.type);
        if (spot) {
          spot.park(vehicle);
          const ticket = createTicket(vehicle, spot);
          tickets.set(ticket.id, ticket);
          emitter.emit("vehicleParked", { ticket, vehicle, spot });
          return ticket;
        }
      }
      throw new Error(`🚫 Parking lot "${name}" is full!`);
    },

    exitVehicle(ticketId) {
      const ticket = tickets.get(ticketId);
      if (!ticket) throw new Error(`Invalid ticket: ${ticketId}`);
      const fee = ticket.calculateFee(rates);
      ticket.spot.vacate();
      tickets.delete(ticketId);
      emitter.emit("vehicleExited", { ticket, fee });
      return { ticket, fee };
    },

    getStatus() {
      return floors.map(f => ({
        floor: f.number,
        available: f.availableCount,
        total: f.totalCount,
        occupancy: `${Math.round((1 - f.availableCount / f.totalCount) * 100)}%`,
      }));
    },

    findVehicle(plate) {
      for (const ticket of tickets.values()) {
        if (ticket.vehicle.plate === plate) return ticket;
      }
      return null;
    },

    get activeTickets() { return tickets.size; },
  };
}

// --- Usage ---
const lot = createParkingLot(
  "Downtown Parking",
  [
    createParkingFloor(1, [
      { id: "1-S1", type: SpotType.SMALL },
      { id: "1-M1", type: SpotType.MEDIUM },
      { id: "1-M2", type: SpotType.MEDIUM },
      { id: "1-L1", type: SpotType.LARGE },
    ]),
    createParkingFloor(2, [
      { id: "2-M1", type: SpotType.MEDIUM },
      { id: "2-M2", type: SpotType.MEDIUM },
      { id: "2-L1", type: SpotType.LARGE },
    ]),
  ],
  { MOTORCYCLE: 5, CAR: 10, TRUCK: 20 }
);

lot.on("vehicleParked", ({ vehicle, spot }) => {
  console.log(`✅ ${vehicle.plate} parked at ${spot.id} (Floor ${spot.floor})`);
});
lot.on("vehicleExited", ({ ticket, fee }) => {
  console.log(`🚗 ${ticket.vehicle.plate} exited. Fee: $${fee}`);
});

const t1 = lot.parkVehicle(createVehicle("KA-01-AB-1234", VehicleType.CAR));
const t2 = lot.parkVehicle(createVehicle("MH-02-CD-5678", VehicleType.TRUCK));
console.log(lot.getStatus());
lot.exitVehicle(t1.id);
```

---

### 📚 Library Management System

```js
const BookStatus = Object.freeze({ AVAILABLE: "AVAILABLE", BORROWED: "BORROWED", RESERVED: "RESERVED" });

function createBook(isbn, title, author, genre, copies = 1) {
  let availableCopies = copies;
  const waitlist = [];

  return {
    isbn, title, author, genre,
    get totalCopies() { return copies; },
    get availableCopies() { return availableCopies; },
    get status() {
      if (availableCopies > 0) return BookStatus.AVAILABLE;
      if (waitlist.length > 0) return BookStatus.RESERVED;
      return BookStatus.BORROWED;
    },

    borrow() {
      if (availableCopies === 0) throw new Error(`"${title}" not available`);
      availableCopies--;
    },

    return() {
      availableCopies = Math.min(copies, availableCopies + 1);
      return waitlist.shift() ?? null; // notify next in waitlist
    },

    addToWaitlist(memberId) {
      if (!waitlist.includes(memberId)) waitlist.push(memberId);
      return waitlist.length; // position in queue
    },

    toString() { return `"${title}" by ${author} [${this.status}]`; },
  };
}

function createMember(id, name, email, tier = "basic") {
  const limits = { basic: 3, premium: 10, student: 5 };
  const borrowedBooks = new Map(); // isbn → recordId

  return {
    id, name, email, tier,
    get borrowCount() { return borrowedBooks.size; },
    get maxBorrow() { return limits[tier] ?? 3; },
    get canBorrow() { return borrowedBooks.size < this.maxBorrow; },
    get borrowedISBNs() { return [...borrowedBooks.keys()]; },

    recordBorrow(isbn, recordId) { borrowedBooks.set(isbn, recordId); },
    recordReturn(isbn) { borrowedBooks.delete(isbn); },
    hasBorrowed(isbn) { return borrowedBooks.has(isbn); },
  };
}

function createBorrowRecord(member, book) {
  const id = `REC-${Date.now()}`;
  const borrowDate = new Date();
  const dueDate = new Date(Date.now() + 14 * 86_400_000);
  let returnDate = null;

  return {
    id,
    memberId: member.id,
    isbn: book.isbn,
    borrowDate,
    dueDate,
    get returnDate() { return returnDate; },
    get isOverdue() { return !returnDate && Date.now() > dueDate; },
    get daysOverdue() {
      if (!this.isOverdue) return 0;
      return Math.floor((Date.now() - dueDate) / 86_400_000);
    },

    close() { returnDate = new Date(); },

    calculateFine(ratePerDay = 1) {
      return this.daysOverdue * ratePerDay;
    },
  };
}

function createLibrary(name) {
  const books = new Map();
  const members = new Map();
  const records = new Map();
  const emitter = createEventEmitter();

  return {
    name,
    on: emitter.on.bind(emitter),

    addBook(book) { books.set(book.isbn, book); return this; },
    registerMember(member) { members.set(member.id, member); return this; },

    borrow(memberId, isbn) {
      const member = members.get(memberId);
      const book = books.get(isbn);

      if (!member) throw new Error("Member not found");
      if (!book) throw new Error("Book not found");
      if (!member.canBorrow) throw new Error(`${member.name} has reached borrow limit`);
      if (member.hasBorrowed(isbn)) throw new Error("Already borrowed");

      if (book.availableCopies === 0) {
        const position = book.addToWaitlist(memberId);
        emitter.emit("waitlisted", { member, book, position });
        return null;
      }

      book.borrow();
      const record = createBorrowRecord(member, book);
      records.set(record.id, record);
      member.recordBorrow(isbn, record.id);

      emitter.emit("borrowed", { member, book, record });
      return record;
    },

    return(recordId) {
      const record = records.get(recordId);
      if (!record) throw new Error("Record not found");

      const book = books.get(record.isbn);
      const member = members.get(record.memberId);

      record.close();
      const nextMemberId = book.return();
      member.recordReturn(record.isbn);
      records.delete(recordId);

      const fine = record.calculateFine();
      emitter.emit("returned", { member, book, record, fine });

      if (nextMemberId) {
        emitter.emit("available", { book, nextMemberId });
      }

      return { fine };
    },

    search({ title, author, genre, status } = {}) {
      return [...books.values()].filter(b =>
        (!title  || b.title.toLowerCase().includes(title.toLowerCase())) &&
        (!author || b.author.toLowerCase().includes(author.toLowerCase())) &&
        (!genre  || b.genre === genre) &&
        (!status || b.status === status)
      );
    },

    getMemberReport(memberId) {
      const member = members.get(memberId);
      if (!member) throw new Error("Member not found");
      const activeRecords = [...records.values()].filter(r => r.memberId === memberId);
      return {
        member,
        borrowed: activeRecords.map(r => ({ ...r, book: books.get(r.isbn) })),
        totalFine: activeRecords.reduce((sum, r) => sum + r.calculateFine(), 0),
      };
    },
  };
}
```

---

### 🎲 Snake & Ladder Game

```js
function createBoard(size = 100, snakes = {}, ladders = {}) {
  return {
    size,
    move(position, steps) {
      let newPos = position + steps;
      if (newPos > size) return position; // can't go beyond board
      if (snakes[newPos]) {
        console.log(`🐍 Snake! ${newPos} → ${snakes[newPos]}`);
        return snakes[newPos];
      }
      if (ladders[newPos]) {
        console.log(`🪜 Ladder! ${newPos} → ${ladders[newPos]}`);
        return ladders[newPos];
      }
      return newPos;
    },
    isWinPosition(pos) { return pos === size; },
  };
}

function createDice(sides = 6) {
  return {
    roll() { return Math.floor(Math.random() * sides) + 1; },
  };
}

function createPlayer(id, name) {
  let position = 0;
  const moveHistory = [];

  return {
    id, name,
    get position() { return position; },
    get moveCount() { return moveHistory.length; },

    moveTo(newPosition) {
      const prev = position;
      position = newPosition;
      moveHistory.push({ from: prev, to: newPosition, at: new Date() });
    },

    reset() { position = 0; moveHistory.length = 0; },
    getHistory() { return [...moveHistory]; },
  };
}

function createSnakeLadderGame(playerNames) {
  const board = createBoard(100,
    { 16: 6, 47: 26, 49: 11, 56: 53, 62: 19, 64: 60, 87: 24, 93: 73, 95: 75, 99: 78 },
    { 1: 38, 4: 14, 9: 31, 20: 29, 28: 84, 40: 59, 51: 67, 63: 81, 71: 91 }
  );
  const dice = createDice();
  const players = playerNames.map((name, i) => createPlayer(i + 1, name));
  const emitter = createEventEmitter();
  let currentIndex = 0;
  let winner = null;

  return {
    on: emitter.on.bind(emitter),
    get currentPlayer() { return players[currentIndex]; },
    get winner() { return winner; },
    get isOver() { return winner !== null; },

    takeTurn() {
      if (this.isOver) throw new Error("Game is over!");
      const player = players[currentIndex];
      const roll = dice.roll();
      const newPos = board.move(player.position, roll);
      player.moveTo(newPos);

      emitter.emit("turn", { player, roll, position: newPos });

      if (board.isWinPosition(newPos)) {
        winner = player;
        emitter.emit("win", { player });
        return;
      }

      currentIndex = (currentIndex + 1) % players.length;
    },

    getLeaderboard() {
      return [...players].sort((a, b) => b.position - a.position)
        .map((p, i) => ({ rank: i + 1, name: p.name, position: p.position }));
    },

    play() {
      while (!this.isOver) this.takeTurn();
      return winner;
    },
  };
}

// Usage
const game = createSnakeLadderGame(["Alice", "Bob", "Charlie"]);
game.on("turn", ({ player, roll, position }) => {
  console.log(`${player.name} rolled ${roll} → position ${position}`);
});
game.on("win", ({ player }) => {
  console.log(`🏆 ${player.name} wins!`);
});

const winner = game.play();
```

---

### ⏱️ Rate Limiter (Multiple Algorithms)

```js
// 1. Fixed Window
function createFixedWindowLimiter(maxRequests, windowMs) {
  const windows = new Map();

  return {
    isAllowed(clientId) {
      const now = Date.now();
      const windowStart = Math.floor(now / windowMs) * windowMs;
      const key = `${clientId}:${windowStart}`;

      const count = (windows.get(key) ?? 0) + 1;
      windows.set(key, count);

      // cleanup old windows
      for (const [k] of windows) {
        if (!k.endsWith(`:${windowStart}`)) windows.delete(k);
      }

      return count <= maxRequests;
    },
  };
}

// 2. Sliding Window (most accurate)
function createSlidingWindowLimiter(maxRequests, windowMs) {
  const clients = new Map();

  return {
    isAllowed(clientId) {
      const now = Date.now();
      if (!clients.has(clientId)) clients.set(clientId, []);
      const timestamps = clients.get(clientId);

      // remove expired
      while (timestamps.length && timestamps[0] <= now - windowMs) timestamps.shift();

      if (timestamps.length < maxRequests) {
        timestamps.push(now);
        return true;
      }
      return false;
    },

    getRemainingRequests(clientId) {
      const now = Date.now();
      const timestamps = clients.get(clientId) ?? [];
      const active = timestamps.filter(t => t > now - windowMs);
      return Math.max(0, maxRequests - active.length);
    },

    getResetTime(clientId) {
      const timestamps = clients.get(clientId) ?? [];
      if (!timestamps.length) return null;
      return new Date(timestamps[0] + windowMs);
    },
  };
}

// 3. Token Bucket (bursty traffic allowed)
function createTokenBucketLimiter(maxTokens, refillRatePerSec) {
  const buckets = new Map();

  function getBucket(clientId) {
    if (!buckets.has(clientId)) {
      buckets.set(clientId, { tokens: maxTokens, lastRefill: Date.now() });
    }
    return buckets.get(clientId);
  }

  function refill(bucket) {
    const now = Date.now();
    const elapsed = (now - bucket.lastRefill) / 1000;
    bucket.tokens = Math.min(maxTokens, bucket.tokens + elapsed * refillRatePerSec);
    bucket.lastRefill = now;
  }

  return {
    isAllowed(clientId, tokensRequired = 1) {
      const bucket = getBucket(clientId);
      refill(bucket);
      if (bucket.tokens >= tokensRequired) {
        bucket.tokens -= tokensRequired;
        return true;
      }
      return false;
    },

    getTokens(clientId) {
      const bucket = getBucket(clientId);
      refill(bucket);
      return Math.floor(bucket.tokens);
    },
  };
}

// 4. Leaky Bucket (smooth output rate)
function createLeakyBucketLimiter(capacity, leakRatePerSec) {
  const buckets = new Map();

  function getBucket(clientId) {
    if (!buckets.has(clientId)) {
      buckets.set(clientId, { water: 0, lastLeak: Date.now() });
    }
    return buckets.get(clientId);
  }

  function leak(bucket) {
    const now = Date.now();
    const elapsed = (now - bucket.lastLeak) / 1000;
    bucket.water = Math.max(0, bucket.water - elapsed * leakRatePerSec);
    bucket.lastLeak = now;
  }

  return {
    isAllowed(clientId) {
      const bucket = getBucket(clientId);
      leak(bucket);
      if (bucket.water < capacity) {
        bucket.water++;
        return true;
      }
      return false;
    },
  };
}
```

---

### 💾 Cache System (LRU + LFU)

```js
// LRU Cache
function createLRUCache(capacity) {
  const cache = new Map();

  return {
    get(key) {
      if (!cache.has(key)) return -1;
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value); // move to end (most recently used)
      return value;
    },

    put(key, value) {
      if (cache.has(key)) cache.delete(key);
      else if (cache.size >= capacity) {
        cache.delete(cache.keys().next().value); // evict LRU (first = oldest)
      }
      cache.set(key, value);
    },

    get size() { return cache.size; },
    get keys() { return [...cache.keys()]; },
  };
}

// LFU Cache (advanced)
function createLFUCache(capacity) {
  const keyMap = new Map();   // key → { value, freq }
  const freqMap = new Map();  // freq → Set of keys (ordered by insertion)
  let minFreq = 0;

  function incrementFreq(key) {
    const { value, freq } = keyMap.get(key);
    keyMap.set(key, { value, freq: freq + 1 });

    freqMap.get(freq).delete(key);
    if (freqMap.get(freq).size === 0) {
      freqMap.delete(freq);
      if (minFreq === freq) minFreq++;
    }

    if (!freqMap.has(freq + 1)) freqMap.set(freq + 1, new Set());
    freqMap.get(freq + 1).add(key);
  }

  return {
    get(key) {
      if (!keyMap.has(key)) return -1;
      incrementFreq(key);
      return keyMap.get(key).value;
    },

    put(key, value) {
      if (capacity <= 0) return;

      if (keyMap.has(key)) {
        keyMap.get(key).value = value;
        incrementFreq(key);
        return;
      }

      if (keyMap.size >= capacity) {
        // evict least frequently used (and oldest among ties)
        const lfuKeys = freqMap.get(minFreq);
        const evictKey = lfuKeys.values().next().value;
        lfuKeys.delete(evictKey);
        if (lfuKeys.size === 0) freqMap.delete(minFreq);
        keyMap.delete(evictKey);
      }

      keyMap.set(key, { value, freq: 1 });
      if (!freqMap.has(1)) freqMap.set(1, new Set());
      freqMap.get(1).add(key);
      minFreq = 1;
    },

    get size() { return keyMap.size; },
  };
}

// Generic cache with TTL + strategy
function createCache({ capacity = 100, strategy = "lru", defaultTTL = null } = {}) {
  const store = strategy === "lru" ? createLRUCache(capacity) : createLFUCache(capacity);
  const ttls = new Map();

  function isExpired(key) {
    const expiry = ttls.get(key);
    return expiry && Date.now() > expiry;
  }

  return {
    get(key) {
      if (isExpired(key)) {
        store.put(key, undefined);
        ttls.delete(key);
        return null;
      }
      const val = store.get(key);
      return val === -1 ? null : val;
    },

    set(key, value, ttl = defaultTTL) {
      store.put(key, value);
      if (ttl) ttls.set(key, Date.now() + ttl * 1000);
    },

    delete(key) { store.put(key, undefined); ttls.delete(key); },
    has(key) { return !isExpired(key) && store.get(key) !== -1; },
    get size() { return store.size; },
  };
}
```

---

### 📡 Pub/Sub System (Production Grade)

```js
function createPubSubBroker() {
  const topics = new Map();
  const subscribers = new Map();
  const messageStore = new Map();
  const emitter = createEventEmitter();

  function getOrCreateTopic(topicId) {
    if (!topics.has(topicId)) {
      topics.set(topicId, { id: topicId, createdAt: new Date(), messageCount: 0 });
      messageStore.set(topicId, []);
    }
    return topics.get(topicId);
  }

  return {
    on: emitter.on.bind(emitter),

    createTopic(topicId) {
      const topic = getOrCreateTopic(topicId);
      emitter.emit("topicCreated", topic);
      return topic;
    },

    subscribe(topicId, subscriberId, handler, options = {}) {
      getOrCreateTopic(topicId);
      if (!subscribers.has(topicId)) subscribers.set(topicId, new Map());

      const sub = {
        id: subscriberId,
        handler,
        filter: options.filter ?? (() => true),
        maxRetries: options.maxRetries ?? 3,
        offset: messageStore.get(topicId).length, // start from current position
      };

      subscribers.get(topicId).set(subscriberId, sub);
      emitter.emit("subscribed", { topicId, subscriberId });

      return function unsubscribe() {
        subscribers.get(topicId)?.delete(subscriberId);
        emitter.emit("unsubscribed", { topicId, subscriberId });
      };
    },

    async publish(topicId, payload, meta = {}) {
      getOrCreateTopic(topicId);
      const topic = topics.get(topicId);

      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        topicId,
        payload,
        meta,
        timestamp: new Date(),
        offset: topic.messageCount++,
      };

      messageStore.get(topicId).push(message);
      emitter.emit("published", message);

      const subs = subscribers.get(topicId);
      if (!subs) return message;

      const deliveries = [...subs.values()]
        .filter(sub => sub.filter(message))
        .map(sub => this.#deliver(sub, message));

      await Promise.allSettled(deliveries);
      return message;
    },

    async "#deliver"(sub, message) {
      for (let attempt = 0; attempt <= sub.maxRetries; attempt++) {
        try {
          await sub.handler(message);
          sub.offset = message.offset + 1;
          return;
        } catch (err) {
          if (attempt === sub.maxRetries) {
            emitter.emit("deliveryFailed", { sub, message, error: err });
          } else {
            await new Promise(r => setTimeout(r, 100 * 2 ** attempt)); // exponential backoff
          }
        }
      }
    },

    replay(topicId, subscriberId, fromOffset = 0) {
      const messages = messageStore.get(topicId) ?? [];
      const sub = subscribers.get(topicId)?.get(subscriberId);
      if (!sub) throw new Error("Subscriber not found");

      return messages.slice(fromOffset).forEach(msg => sub.handler(msg));
    },

    getTopicStats(topicId) {
      const topic = topics.get(topicId);
      if (!topic) return null;
      return {
        ...topic,
        subscriberCount: subscribers.get(topicId)?.size ?? 0,
        storedMessages: messageStore.get(topicId)?.length ?? 0,
      };
    },
  };
}
```

---

### 🔗 URL Shortener (Production Grade)

```js
function createURLShortener({ baseUrl = "https://sh.rt/", codeLength = 6 } = {}) {
  const urlMap = new Map();
  const reverseMap = new Map();
  const analytics = new Map();
  const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Base62 encoding for sequential IDs
  let counter = 100000;
  function encodeBase62(num) {
    let result = "";
    while (num > 0) {
      result = CHARS[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result.padStart(codeLength, "a");
  }

  function generateCode() { return encodeBase62(counter++); }

  function isValidUrl(url) {
    try { new URL(url); return true; } catch { return false; }
  }

  function isExpired(entry) {
    return entry.expiresAt && Date.now() > entry.expiresAt;
  }

  return {
    shorten(longUrl, options = {}) {
      if (!isValidUrl(longUrl)) throw new Error("Invalid URL");

      if (this.reverseMap?.has(longUrl)) {
        return { shortUrl: baseUrl + reverseMap.get(longUrl), isNew: false };
      }

      const code = options.alias ?? generateCode();
      if (urlMap.has(code)) throw new Error("Alias already taken");

      const entry = {
        longUrl,
        code,
        createdAt: Date.now(),
        expiresAt: options.expiresInDays
          ? Date.now() + options.expiresInDays * 86_400_000
          : null,
        createdBy: options.userId ?? "anonymous",
        maxClicks: options.maxClicks ?? null,
      };

      urlMap.set(code, entry);
      reverseMap.set(longUrl, code);
      analytics.set(code, {
        clicks: 0,
        uniqueVisitors: new Set(),
        byCountry: {},
        byReferrer: {},
        byDevice: {},
        clickHistory: [],
      });

      return { shortUrl: baseUrl + code, code, isNew: true };
    },

    resolve(code, context = {}) {
      const entry = urlMap.get(code);
      if (!entry) throw new Error("404: Short URL not found");

      if (isExpired(entry)) {
        this.delete(code);
        throw new Error("410: URL has expired");
      }

      const stats = analytics.get(code);

      if (entry.maxClicks && stats.clicks >= entry.maxClicks) {
        throw new Error("410: Click limit reached");
      }

      // Record analytics
      stats.clicks++;
      if (context.visitorId) stats.uniqueVisitors.add(context.visitorId);
      if (context.country) stats.byCountry[context.country] = (stats.byCountry[context.country] ?? 0) + 1;
      if (context.referrer) stats.byReferrer[context.referrer] = (stats.byReferrer[context.referrer] ?? 0) + 1;
      if (context.device) stats.byDevice[context.device] = (stats.byDevice[context.device] ?? 0) + 1;
      stats.clickHistory.push({ timestamp: new Date(), ...context });

      return entry.longUrl;
    },

    getAnalytics(code) {
      const stats = analytics.get(code);
      if (!stats) return null;
      return {
        ...stats,
        uniqueVisitors: stats.uniqueVisitors.size,
        clickHistory: stats.clickHistory.slice(-100), // last 100 clicks
      };
    },

    delete(code) {
      const entry = urlMap.get(code);
      if (entry) {
        reverseMap.delete(entry.longUrl);
        urlMap.delete(code);
        analytics.delete(code);
        return true;
      }
      return false;
    },

    getBulkAnalytics(codes) {
      return codes.reduce((acc, code) => {
        acc[code] = this.getAnalytics(code);
        return acc;
      }, {});
    },
  };
}
```

---

### 🛗 Elevator System

```js
function createElevator(id, minFloor = 1, maxFloor = 50) {
  let currentFloor = 1;
  let direction = "IDLE";
  let status = "IDLE";
  const destinations = new Set();
  const emitter = createEventEmitter();

  function getBestNext() {
    if (!destinations.size) return null;
    const sorted = [...destinations].sort((a, b) => a - b);
    if (direction === "UP" || direction === "IDLE") {
      const up = sorted.find(f => f >= currentFloor);
      return up ?? sorted[sorted.length - 1];
    } else {
      const down = [...sorted].reverse().find(f => f <= currentFloor);
      return down ?? sorted[0];
    }
  }

  const elevator = {
    id,
    get currentFloor() { return currentFloor; },
    get direction() { return direction; },
    get status() { return status; },
    get destinations() { return [...destinations]; },
    get isIdle() { return status === "IDLE"; },
    get load() { return destinations.size; }, // proxy for how busy it is
    on: emitter.on.bind(emitter),

    addDestination(floor) {
      if (floor < minFloor || floor > maxFloor)
        throw new Error(`Floor ${floor} out of range`);
      destinations.add(floor);
      if (direction === "IDLE") {
        direction = floor > currentFloor ? "UP" : floor < currentFloor ? "DOWN" : "IDLE";
      }
      status = "MOVING";
    },

    step() {
      const next = getBestNext();
      if (next === null) {
        direction = "IDLE";
        status = "IDLE";
        emitter.emit("idle", { elevatorId: id, floor: currentFloor });
        return;
      }

      if (next > currentFloor) { currentFloor++; direction = "UP"; }
      else if (next < currentFloor) { currentFloor--; direction = "DOWN"; }

      if (currentFloor === next) {
        destinations.delete(next);
        emitter.emit("arrived", { elevatorId: id, floor: currentFloor });
      }
    },
  };

  return elevator;
}

function createElevatorController(numElevators, numFloors) {
  const elevators = Array.from({ length: numElevators }, (_, i) =>
    createElevator(i + 1, 1, numFloors)
  );
  const pendingRequests = [];
  const emitter = createEventEmitter();

  // LOOK Algorithm — pick elevator that minimizes wait
  function selectElevator(floor, direction) {
    return elevators.reduce((best, elevator) => {
      const score = (() => {
        const dist = Math.abs(elevator.currentFloor - floor);
        if (elevator.isIdle) return dist;
        const sameDir = elevator.direction === direction;
        const onTheWay = direction === "UP"
          ? elevator.currentFloor <= floor
          : elevator.currentFloor >= floor;
        if (sameDir && onTheWay) return dist;
        return dist + numFloors; // penalty for wrong direction
      })();

      return score < best.score ? { elevator, score } : best;
    }, { elevator: elevators[0], score: Infinity }).elevator;
  }

  return {
    on: emitter.on.bind(emitter),

    callElevator(floor, direction) {
      const elevator = selectElevator(floor, direction);
      elevator.addDestination(floor);
      emitter.emit("called", { floor, direction, elevatorId: elevator.id });
      return elevator.id;
    },

    pressFloor(elevatorId, floor) {
      const elevator = elevators.find(e => e.id === elevatorId);
      if (!elevator) throw new Error(`Elevator ${elevatorId} not found`);
      elevator.addDestination(floor);
    },

    step() {
      elevators.forEach(e => e.step());
    },

    getStatus() {
      return elevators.map(e => ({
        id: e.id,
        floor: e.currentFloor,
        direction: e.direction,
        status: e.status,
        destinations: e.destinations,
      }));
    },
  };
}
```

---

### 📅 Task Scheduler

```js
function createTaskScheduler({ concurrency = 5, retries = 3 } = {}) {
  const queue = [];
  const running = new Map();
  const completed = [];
  const failed = [];
  let isRunning = false;
  const emitter = createEventEmitter();

  function createTask(id, fn, options = {}) {
    return {
      id,
      fn,
      priority: options.priority ?? 0,
      retries: options.retries ?? retries,
      timeout: options.timeout ?? 30000,
      attempts: 0,
      status: "pending",
      createdAt: Date.now(),
      scheduledAt: options.delay ? Date.now() + options.delay : null,
    };
  }

  async function executeTask(task) {
    task.status = "running";
    task.attempts++;
    running.set(task.id, task);
    emitter.emit("taskStarted", task);

    try {
      const result = await Promise.race([
        task.fn(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Task timeout")), task.timeout)
        ),
      ]);

      task.status = "completed";
      task.result = result;
      task.completedAt = Date.now();
      completed.push(task);
      emitter.emit("taskCompleted", task);
    } catch (err) {
      task.lastError = err.message;

      if (task.attempts < task.retries + 1) {
        task.status = "pending";
        const delay = 1000 * 2 ** (task.attempts - 1); // exponential backoff
        await new Promise(r => setTimeout(r, delay));
        queue.push(task);
        queue.sort((a, b) => b.priority - a.priority);
        emitter.emit("taskRetrying", { task, attempt: task.attempts });
      } else {
        task.status = "failed";
        failed.push(task);
        emitter.emit("taskFailed", { task, error: err });
      }
    } finally {
      running.delete(task.id);
      processNext();
    }
  }

  function processNext() {
    const now = Date.now();
    while (running.size < concurrency) {
      const idx = queue.findIndex(t => !t.scheduledAt || t.scheduledAt <= now);
      if (idx === -1) break;
      const [task] = queue.splice(idx, 1);
      executeTask(task);
    }
  }

  let taskCounter = 0;

  return {
    on: emitter.on.bind(emitter),

    schedule(fn, options = {}) {
      const task = createTask(`task-${++taskCounter}`, fn, options);
      queue.push(task);
      queue.sort((a, b) => b.priority - a.priority);
      if (isRunning) processNext();
      return task.id;
    },

    start() {
      isRunning = true;
      processNext();
    },

    pause() { isRunning = false; },

    cancel(taskId) {
      const idx = queue.findIndex(t => t.id === taskId);
      if (idx !== -1) { queue.splice(idx, 1); return true; }
      return false;
    },

    getStats() {
      return {
        pending: queue.length,
        running: running.size,
        completed: completed.length,
        failed: failed.length,
      };
    },
  };
}
```

---

### 🔔 Notification System

```js
function createNotificationSystem() {
  const channels = new Map();
  const templates = new Map();
  const preferences = new Map();
  const history = [];

  function createNotification(userId, type, data) {
    return {
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      type,
      data,
      createdAt: new Date(),
      status: "pending",
    };
  }

  return {
    registerChannel(name, channel) {
      channels.set(name, channel);
      return this;
    },

    registerTemplate(type, templateFn) {
      templates.set(type, templateFn);
      return this;
    },

    setPreferences(userId, prefs) {
      preferences.set(userId, prefs);
      return this;
    },

    async send(userId, type, data) {
      const template = templates.get(type);
      if (!template) throw new Error(`No template for: ${type}`);

      const userPrefs = preferences.get(userId) ?? { channels: ["email"] };
      const notification = createNotification(userId, type, data);
      const content = template(data);

      const results = await Promise.allSettled(
        userPrefs.channels.map(async (channelName) => {
          const channel = channels.get(channelName);
          if (!channel) return;
          await channel.send(userId, content);
          return channelName;
        })
      );

      notification.status = results.every(r => r.status === "fulfilled")
        ? "delivered" : "partial";
      notification.deliveredTo = results
        .filter(r => r.status === "fulfilled")
        .map(r => r.value);

      history.push(notification);
      return notification;
    },

    async sendBulk(userIds, type, data) {
      return Promise.allSettled(userIds.map(id => this.send(id, type, data)));
    },

    getHistory(userId, limit = 50) {
      return history
        .filter(n => n.userId === userId)
        .slice(-limit);
    },
  };
}

// Channel implementations
function createEmailChannel(emailService) {
  return {
    async send(userId, content) {
      await emailService.sendEmail({
        to: `${userId}@example.com`,
        subject: content.title,
        body: content.body,
      });
    },
  };
}

function createSMSChannel(smsService) {
  return {
    async send(userId, content) {
      await smsService.sendSMS({ to: userId, message: content.shortText });
    },
  };
}

function createPushChannel(pushService) {
  return {
    async send(userId, content) {
      await pushService.sendPush({ userId, title: content.title, body: content.shortText });
    },
  };
}

// Usage
const notifier = createNotificationSystem();
notifier
  .registerChannel("email", createEmailChannel(emailService))
  .registerChannel("sms", createSMSChannel(smsService))
  .registerChannel("push", createPushChannel(pushService))
  .registerTemplate("ORDER_CONFIRMED", (data) => ({
    title: "Order Confirmed! 🎉",
    body: `Your order #${data.orderId} for $${data.total} has been confirmed.`,
    shortText: `Order #${data.orderId} confirmed!`,
  }))
  .setPreferences("user-123", { channels: ["email", "push"] });

notifier.send("user-123", "ORDER_CONFIRMED", { orderId: "ORD-001", total: 99.99 });
```

---

# HLD — High Level Design

## 7. Core HLD Concepts

### Scalability Fundamentals

**Vertical vs Horizontal Scaling:**
```
Vertical (Scale Up):
  Single server: 8 CPU → 32 CPU, 32GB RAM → 256GB RAM
  ✅ Simple, no code changes
  ❌ Limits, single point of failure, expensive

Horizontal (Scale Out):
  1 server → 10 servers behind load balancer
  ✅ Linear cost, high availability, no hard limit
  ❌ Stateless required, distributed system complexity
```

**Stateless Architecture** — required for horizontal scaling:
```
❌ Stateful — session in server memory
  Client → Server A (has session) ← must always route to A

✅ Stateless — session in Redis/DB
  Client → Load Balancer → Any Server → Redis (session)
```

---

### Load Balancing

```
Algorithms:
┌─────────────────────────────────────────────────────┐
│ Round Robin     → Request 1→S1, 2→S2, 3→S3, 4→S1  │
│ Weighted RR     → S1 gets 50%, S2 gets 30%, S3 20% │
│ Least Conn      → Route to server with fewest reqs  │
│ IP Hash         → Same IP always → same server      │
│ Least Response  → Route to fastest responding server │
│ Random          → Random server each time           │
└─────────────────────────────────────────────────────┘

Layer 4 LB: Routes by IP/TCP (faster, no content inspection)
Layer 7 LB: Routes by HTTP headers, URL, cookies (smarter)

Examples:
  AWS ALB (L7), AWS NLB (L4), Nginx, HAProxy, Cloudflare
```

---

### Caching Deep Dive

```
Cache Hierarchy:
  Browser Cache → CDN → Reverse Proxy (Varnish) → App Cache → Redis → DB

Cache Strategies:
┌──────────────────┬─────────────────────────────────────────────────┐
│ Cache-Aside      │ App manages cache. Read: check cache → DB →     │
│ (Lazy Loading)   │ populate cache. Best for read-heavy.            │
├──────────────────┼─────────────────────────────────────────────────┤
│ Write-Through    │ Write to cache + DB simultaneously. Always      │
│                  │ consistent. Extra write latency.                │
├──────────────────┼─────────────────────────────────────────────────┤
│ Write-Behind     │ Write to cache, async write to DB. Fast writes, │
│ (Write-Back)     │ risk of data loss on crash.                     │
├──────────────────┼─────────────────────────────────────────────────┤
│ Read-Through     │ Cache fetches from DB on miss automatically.    │
│                  │ Transparent to app.                             │
└──────────────────┴─────────────────────────────────────────────────┘

Cache Invalidation Strategies:
  TTL (Time-To-Live): Expire after N seconds
  Event-based: Invalidate on write (cache.del on DB update)
  Version tags: Cache-Control: max-age=3600, s-maxage=86400

Cache Eviction Policies:
  LRU — Least Recently Used (most common)
  LFU — Least Frequently Used (better for popular content)
  TTL — Time-based expiry
  FIFO — First in, first out

Cache Problems:
  Cache Stampede: Many requests hit DB simultaneously on cache miss
    → Solution: Mutex lock, probabilistic early expiry
  Cache Penetration: Requests for non-existent keys bypass cache
    → Solution: Cache null values, Bloom filter
  Cache Hotspot: One key gets massive traffic
    → Solution: Local cache, key replication across nodes
```

---

### Database Design at Scale

**SQL vs NoSQL Decision:**
```
Use SQL (PostgreSQL, MySQL) when:
  ✅ Complex queries with JOINs
  ✅ Strong consistency (ACID) needed
  ✅ Structured, known schema
  ✅ Financial transactions, user accounts

Use NoSQL when:
  ✅ Massive scale (100M+ records)
  ✅ Flexible/evolving schema
  ✅ Simple access patterns (key lookups)
  ✅ High write throughput

NoSQL Types:
  Document (MongoDB)    → User profiles, product catalogs
  Key-Value (Redis)     → Sessions, caching, leaderboards
  Wide-Column (Cassandra) → Time-series, event logs, IoT
  Graph (Neo4j)         → Social networks, recommendations
  Search (Elasticsearch) → Full-text search
```

**Database Indexing:**
```
Types:
  B-Tree Index → range queries, ORDER BY, inequality (<, >)
  Hash Index   → exact match only (WHERE id = ?)
  Composite    → multiple columns (order matters: leftmost prefix rule)
  Partial      → index subset of rows (WHERE active = true)
  Covering     → index contains all needed columns (no table lookup)
  Full-text    → text search (PostgreSQL tsvector, Elasticsearch)

Index Design Rules:
  1. Index columns used in WHERE, JOIN ON, ORDER BY
  2. High cardinality columns first in composite index
  3. More indexes = faster reads, slower writes
  4. Use EXPLAIN ANALYZE to verify index usage
```

**Sharding Strategies:**
```
Range-based:  user_id 1-1M → Shard A, 1M-2M → Shard B
  ✅ Range queries efficient   ❌ Hotspots if data not uniform

Hash-based:   shard = hash(user_id) % num_shards
  ✅ Even distribution         ❌ Range queries span all shards

Directory-based: Lookup service maps keys to shards
  ✅ Flexible                  ❌ Lookup service is bottleneck

Consistent Hashing: Shards on a ring, minimal remapping on add/remove
  ✅ Best for dynamic cluster  Used by: DynamoDB, Cassandra, Redis Cluster
```

**Replication:**
```
Single-Leader:
  All writes → Leader → replicate to Followers
  Reads → Followers (eventual consistency) or Leader (strong)
  
Multi-Leader:
  Multiple leaders, each replicates to others
  Good for: multi-region, offline clients
  Problem: conflict resolution needed

Leaderless (Dynamo-style):
  Write to W nodes, read from R nodes
  If W + R > N → strong consistency
  DynamoDB, Cassandra use this
```

---

### CAP Theorem & Consistency Models

```
CAP Theorem: Pick 2 of 3 (Partition Tolerance always required in practice)
  
  CP (Consistent + Partition tolerant):
    → Rejects requests during partition to stay consistent
    → HBase, MongoDB (default), Zookeeper, etcd
    → Use for: banking, inventory systems

  AP (Available + Partition tolerant):
    → Serves potentially stale data during partition
    → Cassandra, CouchDB, DynamoDB (default)
    → Use for: social feeds, shopping carts, DNS

Consistency Levels (weakest → strongest):
  Eventual     → All nodes will eventually agree (DNS, social media likes)
  Monotonic    → Once you read X, never read older than X
  Session      → Consistent within your own session
  Causal       → Cause always before effect
  Linearizable → Strongest — like single machine (most expensive)
```

---

### Message Queues & Event Streaming

```
When to use:
  ✅ Decoupling services
  ✅ Handling traffic spikes (buffer)
  ✅ Async processing (email, image resize)
  ✅ Guaranteed delivery
  ✅ Fan-out (one event → many consumers)

Comparison:
┌───────────────┬──────────────┬─────────────────────────────────┐
│ Tool          │ Throughput   │ Best For                        │
├───────────────┼──────────────┼─────────────────────────────────┤
│ Kafka         │ Very High    │ Event streaming, audit log,     │
│               │              │ replay, high throughput         │
├───────────────┼──────────────┼─────────────────────────────────┤
│ RabbitMQ      │ High         │ Task queues, routing, RPC       │
├───────────────┼──────────────┼─────────────────────────────────┤
│ SQS           │ High         │ Simple queue, AWS ecosystem     │
├───────────────┼──────────────┼─────────────────────────────────┤
│ Redis Streams │ Medium       │ Lightweight streaming, cache+   │
└───────────────┴──────────────┴─────────────────────────────────┘

Delivery Guarantees:
  At-most-once  → Fire and forget. May lose messages.
  At-least-once → Retry on failure. May duplicate. (most common)
  Exactly-once  → No loss, no duplicates. Hardest. (Kafka transactions)

Idempotency: Handle at-least-once by making consumers idempotent
  → Check if message_id already processed before acting
```

---

### Distributed System Concepts

**Consistent Hashing:**
```
Ring with 360 positions. Servers mapped to multiple points (virtual nodes).
Request: hash(key) → find next server clockwise on ring.
Add/remove server: Only adjacent keys reassigned (not full reshuffle).
Virtual nodes: Each server has ~150 virtual nodes for even distribution.
Used by: Cassandra, DynamoDB, Redis Cluster, CDNs
```

**Distributed Transactions (Saga Pattern):**
```
Choreography Saga (event-driven):
  Order Service → emits OrderCreated
                → Inventory Service listens, reserves stock, emits StockReserved
                → Payment Service listens, charges, emits PaymentDone
                → Shipping Service listens, ships
  Rollback: each service emits failure event, others compensate

Orchestration Saga (central coordinator):
  Saga Orchestrator → calls Inventory → calls Payment → calls Shipping
  On failure → calls compensating transactions in reverse
```

**Circuit Breaker:**
```
States: CLOSED → OPEN → HALF-OPEN

CLOSED: Normal operation. Track failure rate.
  If failures > threshold → trip to OPEN

OPEN: All requests fail fast (no calls to downstream).
  After timeout → move to HALF-OPEN

HALF-OPEN: Allow limited requests.
  If success → CLOSED
  If failure → back to OPEN

Used by: Netflix Hystrix, Resilience4j
```

**Distributed Rate Limiting:**
```
Challenge: Rate limiting across multiple API servers

Solutions:
  Centralized Redis: All servers check Redis (atomic INCR + EXPIRE)
  Sliding window in Redis using sorted sets
  Token bucket in Redis using scripts

Redis sliding window:
  ZADD user:123 <timestamp> <request_id>
  ZREMRANGEBYSCORE user:123 0 <window_start>
  ZCARD user:123 → check against limit
```

---

### API Design Best Practices

```
REST Principles:
  Stateless — no server-side session
  Uniform interface — consistent URLs and verbs
  Cacheable — responses should declare if cacheable
  Resource-based — nouns not verbs in URLs

URL Design:
  ✅ GET    /users/:id
  ✅ POST   /users
  ✅ PUT    /users/:id        (full replace)
  ✅ PATCH  /users/:id        (partial update)
  ✅ DELETE /users/:id
  ✅ GET    /users/:id/orders  (nested resource)
  ✅ POST   /orders/:id/cancel (action on resource)

  ❌ GET /getUser
  ❌ POST /createOrder
  ❌ GET /deleteUser?id=123

Versioning:
  URL: /api/v1/users     (most common, most visible)
  Header: Accept: application/vnd.api+json;version=1
  Param: /users?version=1

Rate Limiting Headers:
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 45
  X-RateLimit-Reset: 1609459200
  Retry-After: 30 (when 429 returned)

Pagination:
  Offset: GET /posts?page=2&limit=20         (simple, skip/take)
  Cursor: GET /posts?after=eyJpZCI6MX0=      (consistent, recommended)
  Keyset: GET /posts?after_id=1234&limit=20  (performant)
```

---

## 8. HLD — Classic Interview Problems

### 🐦 Design Twitter/X

**Functional Requirements:** Post tweets, follow users, home timeline, search, likes/retweets

**Non-Functional Requirements:** 100M DAU, tweets posted: 500M/day, reads 100x writes

**Scale Estimation:**
```
Writes: 500M tweets/day = ~6,000 TPS
Reads:  50B reads/day   = ~580,000 TPS  (read-heavy!)
Storage: 500M × 300 bytes = 150GB/day text
         500M × 10% × 2MB media = 100TB/day media
```

**Architecture:**
```
[Client]
   ↓
[API Gateway + Auth] ← JWT validation
   ↓
[Load Balancer]
   ↓         ↓          ↓           ↓
[Tweet    [User     [Feed       [Search
Service]  Service]  Service]    Service]
   ↓         ↓          ↓           ↓
[Tweet DB  [User DB  [Feed Cache [Elastic-
Cassandra] MySQL]    Redis]      search]
   ↓
[Media Service] → [S3 + CDN]
   ↓
[Notification Service] → [Kafka] → [Email/Push/SMS]
```

**Tweet Storage Schema:**
```
Tweets Table (Cassandra - partition by user_id):
  tweet_id    UUID (time-ordered - Twitter Snowflake ID)
  user_id     UUID
  content     TEXT (max 280 chars)
  media_urls  LIST<TEXT>
  created_at  TIMESTAMP
  like_count  COUNTER
  retweet_count COUNTER

Users Table (MySQL):
  user_id     UUID PRIMARY KEY
  username    VARCHAR(50) UNIQUE
  display_name VARCHAR(100)
  followers_count INT
  following_count INT
  created_at  TIMESTAMP

Follows Table (MySQL):
  follower_id UUID
  followee_id UUID
  created_at  TIMESTAMP
  PRIMARY KEY (follower_id, followee_id)
  INDEX (followee_id, follower_id)
```

**Feed Generation — Hybrid Fanout:**
```
On tweet creation:
  1. Save tweet to Cassandra
  2. Publish to Kafka topic "new-tweets"
  3. Feed Service consumes:
     - Get follower list
     - If user has < 10K followers → Push tweet_id to each follower's Redis list
     - If celebrity (> 10K followers) → Mark as celebrity tweet, skip fanout

On feed read:
  1. Fetch pre-computed feed from Redis (regular users' tweets)
  2. Fetch recent tweets from celebrities the user follows (pull)
  3. Merge, deduplicate, sort by timestamp
  4. Paginate with cursor

Redis Feed Structure:
  Key: feed:{user_id}
  Type: Sorted Set (score = tweet timestamp)
  Value: tweet_ids
  Max size: 1000 tweet IDs per feed
```

**Twitter Snowflake ID (64-bit):**
```
| 41 bits timestamp | 10 bits machine id | 12 bits sequence |
→ ~69 years of timestamps
→ 1024 machines
→ 4096 IDs per millisecond per machine
→ Roughly time-sortable without central coordination
```

**Key Design Decisions:**
```
1. Why Cassandra for tweets?
   → Write-heavy, time-series data, horizontal scaling

2. Why Redis for feeds?
   → O(log N) sorted set operations, 100µs reads vs 100ms DB reads

3. Why hybrid fanout?
   → Pure push: Celebs with 10M followers = 10M writes per tweet
   → Pure pull: User follows 1000 people = 1000 DB reads per feed load
   → Hybrid: best of both worlds

4. Why Elasticsearch for search?
   → Full-text search, relevance ranking, faceting
```

---

### 📺 Design YouTube

**Scale:** 2.7B users, 500 hours of video uploaded per minute, 1B hours watched per day

**Architecture:**
```
[Upload Flow]
User → API Gateway → Upload Service
                  ↓
              [Raw S3 Bucket]
                  ↓
              [Transcoding Queue (Kafka)]
                  ↓
          [Worker Pool (FFmpeg)]
           ↓         ↓         ↓
        [360p]    [720p]    [1080p] → [Output S3 Bucket]
                  ↓
              [CDN Distribution]

[Watch Flow]
User → CDN (edge) → [if miss] → Origin S3
User → API Gateway → Metadata Service → MySQL + Redis
```

**Video Transcoding Pipeline:**
```
1. Client uploads via resumable upload (direct to S3 with presigned URL)
2. S3 triggers Lambda/event on upload complete
3. Job pushed to transcoding queue
4. Workers pull job:
   - Split video into GOP-aligned chunks (e.g., every 2 seconds)
   - Transcode each chunk independently (parallelizable!)
   - Stitch chunks back for each quality level
5. Generate HLS/DASH manifest (.m3u8 / .mpd)
6. Store segments + manifest in S3
7. Invalidate CDN cache for manifest
8. Update metadata DB: status = "ready", update URLs

HLS Adaptive Bitrate:
  Master Playlist → 360p Playlist → chunks
                  → 720p Playlist → chunks
                  → 1080p Playlist → chunks
  Player auto-switches quality based on bandwidth
```

**Metadata Schema:**
```
Videos (MySQL):
  video_id     VARCHAR(11)  (YouTube's base64url ID)
  channel_id   UUID
  title        VARCHAR(100)
  description  TEXT
  status       ENUM('processing', 'ready', 'deleted')
  duration_sec INT
  view_count   BIGINT       (updated via Kafka consumer, not direct write)
  like_count   BIGINT
  thumbnail_url VARCHAR(500)
  created_at   TIMESTAMP

Video Files (MySQL):
  video_id     VARCHAR(11)
  quality      ENUM('360p','480p','720p','1080p','4K')
  manifest_url VARCHAR(500)
  size_bytes   BIGINT
```

**View Count Accuracy:**
```
Challenge: 1B views/day = ~11,600 writes/sec just for view counts
Solution:
  1. Client sends view event to API
  2. API writes to Kafka
  3. Stream processor (Flink) aggregates in micro-batches
  4. Batch update DB every 60 seconds
  5. Show approximate count: "1.2M views" not "1,237,456 views"
```

**Recommendation Engine:**
```
Signals used:
  - Watch history (what did you watch + for how long?)
  - Click-through rate (which thumbnails do you click?)
  - Likes, shares, saves
  - Similar viewers behavior

Two-stage approach:
  Candidate Generation: ML model → shortlist 100-200 videos
  Ranking: Heavier ML model → rank and personalize top 10-50
  
  Updated: Offline model retrained daily, served via feature store
```

---

### 💬 Design WhatsApp

**Scale:** 2B users, 100B messages/day, 100M video calls/day

**Architecture:**
```
[Client] ←──WebSocket──→ [Connection Service]
                                 ↓
                         [Message Service] → [Kafka]
                                 ↓
                         [Message Store]    [Notification Service]
                         (Cassandra)              ↓
                                            [FCM / APNS]
                         [User Service] → [MySQL]
                         [Media Service] → [S3 + CDN]
                         [Presence Service] → [Redis]
                         [Group Service] → [MySQL]
```

**Message Flow:**
```
1. Alice sends message to Bob:
   Alice → WebSocket → Connection Server A

2. Message Service receives:
   → Generates message_id (Snowflake)
   → Stores in Cassandra (status: SENT)
   → Sends ACK to Alice with message_id (1 tick ✓)

3. Delivery check:
   → Query Presence Service: Is Bob online?

4a. Bob is online (Bob on Connection Server B):
   → Publish to Kafka: channel = bob's connection server
   → Server B delivers to Bob via WebSocket
   → Bob sends delivery ACK
   → Update status to DELIVERED in Cassandra
   → Notify Alice: 2 ticks ✓✓

4b. Bob is offline:
   → Store in offline message queue (Redis with TTL)
   → Send push notification via FCM/APNS
   → When Bob reconnects: flush queue, deliver, update status

5. Bob opens message:
   → Bob's client sends READ receipt
   → Update status to READ
   → Notify Alice: blue ticks ✓✓ (blue)
```

**Cassandra Schema:**
```
Messages (partitioned by conversation_id):
  conversation_id  UUID    (PARTITION KEY)
  message_id      TIMEUUID (CLUSTERING KEY DESC — newest first)
  sender_id       UUID
  content         TEXT     (encrypted on client side — E2E)
  media_url       TEXT
  message_type    TINYINT  (text=0, image=1, video=2, audio=3)
  status          TINYINT  (sent=1, delivered=2, read=3)
  created_at      TIMESTAMP
```

**End-to-End Encryption:**
```
Protocol: Signal Protocol (Double Ratchet Algorithm)
  - Each user has a public/private key pair
  - Server stores only public keys
  - Messages encrypted by sender using recipient's public key
  - Only recipient can decrypt
  - Server NEVER sees message content

Key exchange: Extended Triple Diffie-Hellman (X3DH)
  → Establishes shared secret without server knowing
```

**Group Messages (up to 1024 members):**
```
Sender's device encrypts message with group key
Group key distributed to all members via Sender Key mechanism
Server stores encrypted message once (not per member — saves storage!)
Each member downloads + decrypts using their copy of group key
```

---

### 🚗 Design Uber

**Scale:** 100M riders, 7M drivers, 25M trips/day

**Key Challenges:** Real-time location tracking, matching riders to drivers, surge pricing

**Architecture:**
```
[Rider App]  [Driver App]
     ↓              ↓
[API Gateway + Auth (JWT)]
     ↓
[Load Balancer]
     ↓
[Trip Service]    [Location Service]    [Matching Service]
     ↓                  ↓                     ↓
[Trip DB          [Redis GeoHash]        [Driver Index
 PostgreSQL]      (live positions)        Redis + Kafka]
     ↓
[Pricing Service] → [Surge Model]
[Payment Service] → [Stripe]
[Notification Service] → [FCM/APNS]
[Maps Service] → [Google Maps / internal]
```

**Real-time Location Tracking:**
```
Driver app → sends GPS every 4 seconds → Location Service
Location Service → updates Redis with GeoHash

Redis GeoAdd command:
  GEOADD drivers:online <longitude> <latitude> <driver_id>
  GEORADIUS drivers:online <lng> <lat> 2 km → nearby drivers
  
Location history → Kafka → consumed by:
  - ETA calculation service
  - Fraud detection
  - Heatmap analytics
```

**Driver Matching Algorithm:**
```
When rider requests:
1. Get rider location
2. Query Redis: drivers within 3km radius
3. Filter by: availability, vehicle type, rating
4. Score each driver:
   score = weight_distance × distance +
           weight_eta × estimated_arrival +
           weight_rating × (5 - rating)
5. Offer trip to highest scored driver
6. Driver has 15 seconds to accept
7. If declined → offer to next driver
8. Repeat up to 3 drivers before expanding radius

Dispatch optimization (like Google Fleet Routing):
  - Match multiple requests simultaneously
  - Minimize total pickup time across all active requests
```

**Surge Pricing:**
```
supply_demand_ratio = available_drivers / active_requests
If ratio < 0.25: surge = 2.0x
If ratio < 0.5:  surge = 1.5x
If ratio < 0.75: surge = 1.25x
else:            surge = 1.0x

Geohash cells used for local supply/demand calculation
```

**Trip State Machine:**
```
REQUESTED → DRIVER_ASSIGNED → DRIVER_EN_ROUTE → 
DRIVER_ARRIVED → TRIP_STARTED → TRIP_COMPLETED → PAYMENT_DONE
                   ↓ (any stage)
               CANCELLED
```

---

### 🛒 Design Amazon

**Scale:** 300M customers, 1.5M sellers, $500B+ GMV/year

**Architecture:**
```
[Client] → [API Gateway] → [Auth Service]
                        → [Product Service]   → [Product DB + Elasticsearch]
                        → [Cart Service]      → [Redis (TTL = 30 days)]
                        → [Order Service]     → [Order DB PostgreSQL]
                        → [Inventory Service] → [Inventory DB + Redis]
                        → [Payment Service]   → [Stripe / Internal]
                        → [Fulfillment]       → [Warehouse System]
                        → [Recommendation]    → [ML Platform]
                        → [Review Service]    → [Review DB + Elasticsearch]
                        → [Notification]      → [SES + SNS]
```

**Inventory Management (preventing overselling):**
```
Challenge: Flash sale with 1000 units and 100,000 simultaneous buyers

Solution:
1. Inventory count stored in Redis (fast atomic operations)
2. Redis DECR command is atomic — prevents race conditions
3. Two-phase approach:
   Phase 1 - Reserve (add to cart): 
     DECR inventory:product_id
     If result >= 0: reserved! Set TTL on reservation (15 min)
     If result < 0: INCR back (return to pool), show "out of stock"
   
   Phase 2 - Commit (checkout/payment):
     Confirmed payment → reservation becomes final sale
     If user abandons cart → TTL expires → inventory auto-released

4. MySQL DB is source of truth
   Redis synced from DB on startup
   DB updated asynchronously after Redis reservation
```

**Order Processing (Saga Pattern):**
```
OrderService.placeOrder():
  → Step 1: Create order (status: PENDING)
  → Step 2: Reserve inventory  [compensate: release inventory]
  → Step 3: Process payment    [compensate: refund payment]
  → Step 4: Schedule fulfillment
  → Step 5: Update order status: CONFIRMED
  → Step 6: Send confirmation email (Kafka event)

On any failure → run compensating transactions in reverse
```

**Product Search:**
```
Search pipeline:
  Query → Elasticsearch:
    text search on title, description, brand
    filter by price range, category, rating, shipping speed
    boost by: relevance score × conversion rate × sponsored bid
  
  Autocomplete:
    Redis prefix sorted set or Elasticsearch completion suggester
    Updated by analytics pipeline hourly
    
  Personalization layer:
    Re-rank results based on user's purchase history, browsing
    A/B tested continuously
```

---

### 🏠 Design Airbnb

**Scale:** 150M guests, 7M listings, 500K stays/night

**Architecture:**
```
[Client] → [API Gateway]
         → [Search Service]    → [Elasticsearch + Spatial index]
         → [Listing Service]   → [Listing DB MySQL]
         → [Booking Service]   → [Booking DB PostgreSQL]
         → [Calendar Service]  → [Availability DB]
         → [Pricing Service]   → [Dynamic pricing ML]
         → [Review Service]    → [Review DB]
         → [Payment Service]   → [Stripe Connect]
         → [Messaging Service] → [WebSocket + Cassandra]
         → [Image Service]     → [S3 + CDN + ML moderation]
```

**Search with Geo-filtering:**
```
User query: "NYC, 2 guests, Nov 10-15, $100-200/night"

Step 1: Geo search (Elasticsearch geo_distance query)
  → All listings within radius of NYC

Step 2: Availability filter
  → Query Availability Service for each listing
  → Bitset approach: each listing has bitmask of booked days
  → AND operation with requested dates

Step 3: Capacity + price filter

Step 4: Rank by:
  - Relevance (text match on amenities, description)
  - Quality score (reviews, response rate, photos)
  - Price attractiveness (vs similar listings)
  - Host superhost status
  - Personalization (based on user history)

Step 5: Return paginated results with cursor
```

**Calendar / Availability System:**
```
Challenge: High read traffic during search, blocking on booking

Design:
  Availability stored as date ranges in MySQL:
    listing_id, start_date, end_date, status (available/blocked/booked)

  Denormalized into Redis as bitset:
    Key: avail:{listing_id}:{year_month}
    Value: bitset (1 bit per day, 1=available, 0=unavailable)
    
  Search queries Redis (fast bit AND operations)
  Booking updates MySQL + invalidates Redis cache

Booking conflicts prevention:
  Optimistic locking with version field on availability records
  Database-level unique constraint on (listing_id, date)
```

**Double-booking prevention:**
```
Booking flow:
  1. User selects dates → Check availability (Redis)
  2. User confirms → Attempt booking:
     BEGIN TRANSACTION
       SELECT * FROM bookings WHERE listing_id = ? 
         AND dates OVERLAP (start, end) FOR UPDATE
       IF no conflicts:
         INSERT booking
         UPDATE availability
       COMMIT
     ON CONFLICT → return "dates no longer available"
```

---

### 🔍 Design Google Search

**Scale:** 8.5B searches/day, index of 100B+ web pages, <500ms response

**Architecture:**
```
Web Crawler:
  URL Frontier → Distributed Crawlers → Raw Content Store (HDFS)
              ← Link Extractor ← URL Deduplicator

Indexing Pipeline:
  Raw HTML → Content Extractor → Text Normalizer
           → Link Extractor → PageRank Calculator
           → Forward Index → Inverted Index Builder
           → Ranking Feature Store

Query Serving:
  User Query → Query Parser → Query Rewriter (synonyms, spell-correct)
             → Index Lookup → Candidate Retrieval (millions → thousands)
             → Ranking (ML model) → Top 10
             → Result Assembly → Snippets + Rich results
             → Response
```

**Inverted Index:**
```
"apple iphone review" →
  Index["apple"]  = [(doc1, tf=0.3, pos=[5,23]), (doc5, tf=0.1, pos=[2])]
  Index["iphone"] = [(doc1, tf=0.5, pos=[6,24]), (doc3, tf=0.4, pos=[1])]
  Index["review"] = [(doc1, tf=0.2, pos=[7]),    (doc7, tf=0.3, pos=[5])]

Stored as: compressed sorted lists of (doc_id, TF-IDF score, positions)

For multi-word query: intersect posting lists for AND, union for OR
```

**PageRank:**
```
PageRank(page) = (1-d) + d × Σ(PageRank(linking_page) / outlinks(linking_page))

d = damping factor (0.85)
Iterated until convergence (typically 50-100 iterations on full web)

Modern Google: PageRank is one of 200+ ranking signals
Other signals: freshness, click-through rate, user engagement,
               E-E-A-T (Experience, Expertise, Authoritativeness, Trust)
               Core Web Vitals (load time, interactivity, layout shift)
```

**Ranking System:**
```
Stage 1 — Retrieval: BM25 / TF-IDF → thousands of candidates
Stage 2 — Pre-ranking: Lightweight ML model → top 500
Stage 3 — Ranking: Heavy ML model (LambdaMART, Neural Ranking)
           Features: query-doc relevance, PageRank, freshness,
                     CTR, user signals, E-E-A-T, Core Web Vitals
Stage 4 — Diversity: Ensure variety (not 10 results from same site)
Stage 5 — Personalization: Subtle adjustment based on user history
```

---

### 📦 Design Dropbox

**Scale:** 500M users, 1.8B files stored, 1.2B file syncs/day

**Architecture:**
```
[Desktop/Mobile Client]
  ↓
[API Gateway]
  ↓                  ↓               ↓
[Metadata Service] [Upload Service] [Download Service]
  ↓                  ↓               ↓
[Metadata DB       [S3 Chunked     [S3 + CDN]
 MySQL + Redis]     Storage]
  ↓
[Notification Service] → WebSocket → [Clients]
[Sync Engine] → [Kafka] → [Event Log]
```

**File Chunking & Deduplication:**
```
Problem: Syncing 10GB file — any change requires re-uploading entire file?

Solution: Chunk files into 4MB blocks
  1. Client splits file into 4MB chunks
  2. SHA-256 hash of each chunk
  3. Upload only changed/new chunks (delta sync)
  4. Global dedup: if chunk hash exists in store → skip upload!
  5. Metadata records chunk list for each file version

Example:
  user edits slide 3 of 50-slide deck
  → Only 1-2 chunks change
  → Only those chunks uploaded
  → 98% bandwidth saved!

Block Storage:
  block_{sha256_hash} → S3 object
  Immutable (content-addressed)
  Garbage collected when no file references block
```

**Metadata Schema:**
```
Files:
  file_id       UUID
  owner_id      UUID
  name          VARCHAR(255)
  is_folder     BOOLEAN
  parent_id     UUID
  size_bytes    BIGINT
  current_version_id UUID

Versions:
  version_id    UUID
  file_id       UUID
  created_at    TIMESTAMP
  block_ids     JSON (ordered list of block hashes)
  size_bytes    BIGINT
  created_by    UUID

Blocks:
  block_hash    CHAR(64)  (SHA-256)
  size_bytes    INT
  s3_key        VARCHAR(255)
  reference_count INT
```

**Real-time Sync:**
```
When user changes a file:
  1. Client detects change (file watcher)
  2. Compute diff (new chunks)
  3. Upload new chunks to S3
  4. Update metadata via API
  5. Metadata service publishes event to Kafka
  6. Notification service fans out to all connected devices of user
  7. Other devices receive notification via long-polling or WebSocket
  8. They download only new/changed chunks
```

---

## 9. Interview Frameworks & Cheat Sheets

### LLD Interview Framework (30 minutes)

```
Minute 0-5: Clarify Requirements
  ✅ "What are the core features in scope?"
  ✅ "Any scale requirements? Single machine?"
  ✅ "Any specific constraints or non-goals?"
  ✅ "Should I focus on a specific component?"

Minute 5-10: Identify Entities
  → List all nouns → become classes/objects
  → List all verbs → become methods
  → Identify relationships: HAS-A, IS-A, USES

Minute 10-20: Design Class Structure
  → Draw relationships
  → Apply design patterns where appropriate
  → Consider SOLID principles
  → Think about extensibility

Minute 20-30: Write Code
  → Start with core entities
  → Add relationships and interactions
  → Handle edge cases
  → Add error handling
```

### HLD Interview Framework (45 minutes)

```
Minute 0-5: Requirements
  Functional:     "Users can post tweets, follow users, view feed"
  Non-functional: "99.9% uptime, <200ms P99 latency, 100M DAU"
  Out of scope:   "No monetization, no DMs in v1"

Minute 5-10: Scale Estimation
  Users: DAU, MAU
  Traffic: reads/sec, writes/sec
  Storage: data per item × volume × retention
  Bandwidth: data transfer per request × RPS

Minute 10-15: API Design
  Define 3-5 key endpoints
  Include request/response shape
  Mention auth (JWT/session)

Minute 15-25: High-Level Design
  Draw main components
  Show data flow for key operations
  Identify databases needed

Minute 25-40: Deep Dive
  Pick 1-2 hardest problems and go deep
  Database schema (key tables + indexes)
  Algorithm choice and trade-offs
  Bottlenecks and solutions

Minute 40-45: Trade-offs & Scale
  What breaks at 10x scale?
  What are the failure modes?
  How do you monitor this system?
```

### Back-of-Envelope Estimation

```
Traffic:
  1M users × 10 actions/day = 10M actions/day = ~120 actions/sec
  
  Peak = 3x average = 360 req/sec

Storage:
  1 tweet = 300 bytes
  100M tweets/day × 300 bytes = 30GB/day
  30GB/day × 365 days = ~10TB/year (text only)
  
  With media: 100M/day × 10% with media × 500KB = 5TB/day

Servers:
  1 server handles ~10,000 req/sec
  1M req/sec → 100 servers
  
  + 30% headroom → 130 servers

Bandwidth:
  1M req/sec × 10KB average response = 10GB/sec = 80Gbps
  CDN handles most of this for static content
```

### Key Numbers to Memorize

```
Latency:
  L1 cache:          0.5 ns
  L2 cache:          7 ns
  Main memory (RAM): 100 ns
  SSD read:          150 µs (0.15 ms)
  HDD seek:          10 ms
  Network (same DC): 0.5 ms
  Network (cross-region): 50-150 ms

Throughput (approximate):
  Redis:             100,000+ ops/sec
  PostgreSQL:        10,000-50,000 TPS
  MySQL:             10,000-30,000 TPS
  Kafka:             1M+ messages/sec
  Single HTTP server:10,000 req/sec
  CDN edge:          100,000+ req/sec

Storage:
  1 char = 1 byte
  1 tweet (300 chars) = 300 bytes
  1 photo = 200KB-5MB
  1 minute video = 50-100MB
  Emoji = 4 bytes (UTF-8)
```

### Design Pattern Quick Reference

```
CREATIONAL (how to create objects):
  Singleton     → One instance (config, logger, thread pool)
  Factory       → Create without specifying exact class
  Abstract Factory → Families of related objects (UI themes)
  Builder       → Complex object step by step (SQL, HTTP request)
  Prototype     → Clone rather than create from scratch

STRUCTURAL (how to compose objects):
  Adapter       → Make incompatible interfaces work together
  Decorator     → Add behaviors dynamically (middleware, coffee toppings)
  Facade        → Simple interface to complex subsystem
  Proxy         → Control access (caching, auth, logging)
  Composite     → Treat groups and individuals uniformly (file system)
  Flyweight     → Share to support large numbers of fine-grained objects

BEHAVIORAL (how objects communicate):
  Observer      → Notify many on state change (events, pub/sub)
  Strategy      → Swap algorithms at runtime (sort, auth, payment)
  Command       → Encapsulate requests (undo/redo, job queues)
  Chain of Resp → Pass through handlers (middleware pipeline)
  State         → Change behavior when state changes (order lifecycle)
  Iterator      → Traverse without knowing structure
  Template Method→ Skeleton algorithm, steps overridden by subclass
```

### Common Interview Anti-Patterns to Avoid

```
❌ Jumping to solution without clarifying requirements
❌ Designing for 10B users when asked about MVP
❌ Using only one DB for everything
❌ Forgetting about failure modes / single points of failure
❌ No consideration for data consistency
❌ Over-engineering with microservices for a simple system
❌ Not explaining trade-offs of your choices
❌ In LLD: Making everything a class without reason
❌ In LLD: Ignoring design patterns when they'd clearly help
❌ In HLD: No back-of-envelope calculation

✅ Always clarify before designing
✅ Start simple, then scale
✅ Explain trade-offs as you go
✅ Know when SQL vs NoSQL
✅ Know when cache is and isn't appropriate
✅ Mention monitoring, alerting, observability
✅ Discuss failure scenarios
```

---

*Happy designing! 🚀 Remember: there's no single right answer — communicate your reasoning.*
