# 🧠 Practical LLD + Design Patterns in JavaScript
### The "WHY, WHEN, PROS/CONS" Guide — Not Just Code

---

## The Big Question: Why Do We Even Need All This?

Before diving in, here's the real answer:

> You write code once, but it gets **read, changed, and debugged** 100 times by different people (including future you).

Design patterns and principles exist to solve ONE problem:
**"How do I write code that doesn't become a nightmare to change later?"**

Every pattern below solves a specific pain point you've already felt.

---

## PART 1 — SOLID Principles

---

### S — Single Responsibility Principle

**Plain English:** One function/module = one job. If you're describing what your function does and you use the word "AND" — it's doing too much.

**The Pain It Solves:**
```
You have a UserService that creates users, validates data,
sends emails, writes to DB, and logs activity.

→ Product says: "Change email template"
→ You open UserService.js — 800 lines
→ You change the template
→ You accidentally break user creation
→ Bug goes to production
```

**Without SRP — The God Function:**
```js
// ❌ This function does FIVE different jobs
function registerUser(userData) {
  // Job 1: Validate
  if (!userData.email.includes("@")) throw new Error("Bad email");
  if (userData.password.length < 8) throw new Error("Weak password");

  // Job 2: Hash password
  const hashed = crypto.createHash("sha256").update(userData.password).digest("hex");

  // Job 3: Save to database
  const user = db.query(`INSERT INTO users VALUES (?, ?)`, [userData.email, hashed]);

  // Job 4: Send email
  nodemailer.sendMail({ to: userData.email, subject: "Welcome!", body: "Hello!" });

  // Job 5: Log it
  fs.appendFileSync("app.log", `User created: ${userData.email}`);

  return user;
}
// Change email template? Touch this function.
// Change DB? Touch this function.
// Change validation rules? Touch this function.
// One bug in logging BREAKS registration for everyone.
```

**With SRP — Each Thing Has Its Own Place:**
```js
// ✅ Each factory does ONE thing

// Job 1: Validation only
function createUserValidator() {
  return {
    validate(data) {
      const errors = [];
      if (!data.email?.includes("@")) errors.push("Invalid email");
      if (!data.password || data.password.length < 8) errors.push("Password min 8 chars");
      if (!data.name?.trim()) errors.push("Name required");
      if (errors.length) throw new Error(errors.join(", "));
      return true;
    },
  };
}

// Job 2: Password only
function createPasswordService() {
  return {
    hash(plain) {
      return crypto.createHash("sha256").update(plain).digest("hex");
    },
    verify(plain, hashed) {
      return this.hash(plain) === hashed;
    },
  };
}

// Job 3: Database only
function createUserRepository(db) {
  return {
    save(user) { return db.query("INSERT INTO users SET ?", user); },
    findByEmail(email) { return db.query("SELECT * FROM users WHERE email=?", [email]); },
    findById(id) { return db.query("SELECT * FROM users WHERE id=?", [id]); },
  };
}

// Job 4: Email only
function createEmailService(mailer) {
  return {
    sendWelcome(email, name) {
      return mailer.send({ to: email, subject: "Welcome!", body: `Hi ${name}!` });
    },
    sendPasswordReset(email, token) {
      return mailer.send({ to: email, subject: "Reset password", body: `Token: ${token}` });
    },
  };
}

// Job 5: Orchestration — ties it all together
function createUserService({ validator, passwordSvc, repo, emailSvc }) {
  return {
    async register(userData) {
      validator.validate(userData);                          // delegate
      const hashed = passwordSvc.hash(userData.password);   // delegate
      const user = await repo.save({ ...userData, password: hashed }); // delegate
      await emailSvc.sendWelcome(user.email, user.name);    // delegate
      return user;
    },
  };
}

// Now change email template? Touch EmailService only.
// Change DB? Touch UserRepository only.
// Change validation? Touch UserValidator only.
// Each is independently testable with a mock.
```

**Pros:**
- Easy to test each piece in isolation
- Change one thing without breaking others
- Easy to find bugs — you know exactly where to look
- Multiple devs can work on different pieces simultaneously

**Cons:**
- More files/modules to navigate
- Can feel like over-engineering for tiny scripts
- Need good folder structure or it gets confusing

**When to Apply:**
- When a function is > 30-40 lines — usually doing too much
- When you find yourself saying "this function validates AND saves AND sends"
- When you can't test a function without setting up 5 different things

---

### O — Open/Closed Principle

**Plain English:** You should be able to add new features by **adding new code**, not by editing existing working code.

**The Pain It Solves:**
```
Your app supports PayPal. Boss says: "Add Stripe, also add crypto."
You open PaymentService.js and add if/else blocks.
You break PayPal while adding Stripe.
QA has to retest EVERYTHING every time you add a payment method.
```

**Without OCP:**
```js
// ❌ Every new payment method = modify this function = risk breaking existing ones
function processPayment(method, amount, details) {
  if (method === "paypal") {
    // PayPal logic
    return paypalSDK.charge(details.email, amount);
  } else if (method === "stripe") {
    // Stripe logic — added later, broke PayPal twice during testing
    return stripeSDK.charges.create({ amount: amount * 100, source: details.token });
  } else if (method === "crypto") {
    // Crypto — added later, everyone nervous about touching this file now
    return cryptoGateway.send(details.walletAddress, amount);
  }
  // add razorpay? UPI? Apple Pay? Keep adding elseifs forever
}
```

**With OCP:**
```js
// ✅ Add new payment = add new file, never touch existing code

// The "contract" every payment method must follow
// (This never changes)
function createPaymentProcessor() {
  const processors = new Map();

  return {
    // Register any payment method
    register(name, processor) {
      processors.set(name, processor);
      return this; // fluent API
    },

    async charge(name, amount, details) {
      const processor = processors.get(name);
      if (!processor) throw new Error(`Payment method "${name}" not supported`);
      return processor.charge(amount, details);
    },

    async refund(name, transactionId, amount) {
      const processor = processors.get(name);
      if (!processor) throw new Error(`Payment method "${name}" not supported`);
      return processor.refund(transactionId, amount);
    },

    getSupportedMethods() { return [...processors.keys()]; },
  };
}

// Each payment method is its own isolated module
// NEVER need to touch payment processor above when adding new method

function createPayPalProcessor() {
  return {
    async charge(amount, { email }) {
      console.log(`PayPal: charging $${amount} to ${email}`);
      return { id: "pp_123", status: "success" };
    },
    async refund(transactionId, amount) {
      console.log(`PayPal: refunding $${amount} for ${transactionId}`);
      return { status: "refunded" };
    },
  };
}

function createStripeProcessor(apiKey) {
  return {
    async charge(amount, { token }) {
      console.log(`Stripe: charging $${amount * 100} cents, token: ${token}`);
      return { id: "ch_abc", status: "success" };
    },
    async refund(transactionId, amount) {
      console.log(`Stripe: refunding transaction ${transactionId}`);
      return { status: "refunded" };
    },
  };
}

function createRazorpayProcessor() {
  // New processor — zero changes to existing code above
  return {
    async charge(amount, { orderId }) {
      console.log(`Razorpay: charging ₹${amount}, order: ${orderId}`);
      return { id: "rp_xyz", status: "success" };
    },
    async refund(transactionId, amount) {
      return { status: "refunded" };
    },
  };
}

// Wire it up
const payment = createPaymentProcessor()
  .register("paypal", createPayPalProcessor())
  .register("stripe", createStripeProcessor("sk_test_xxx"))
  .register("razorpay", createRazorpayProcessor()); // added without touching existing

payment.charge("stripe", 99.99, { token: "tok_visa" });
payment.charge("razorpay", 5000, { orderId: "ord_001" });
```

**Pros:**
- Adding features is safe — you can't break what you don't touch
- Old code gets tested once and trusted forever
- Much easier to add features with confidence

**Cons:**
- Requires upfront thought about what "varies" vs what stays fixed
- Can be hard to predict what needs to be extensible early on
- Slight indirection — need to know which processor does what

**When to Apply:**
- When you find yourself adding `if/else` or `switch` cases repeatedly to the same function
- Notification types, payment methods, export formats, auth strategies — all perfect OCP candidates
- When adding a new "type" of something shouldn't scare you about breaking existing types

---

### L — Liskov Substitution Principle

**Plain English:** If your code works with a Bird, it should work with any specific bird (Parrot, Eagle) without knowing which one it is. A subtype must be a proper substitute for its parent.

**The Pain It Solves:**
```
You have a Bird class with a fly() method.
You make Penguin extend Bird.
Somewhere code does: birds.forEach(b => b.fly())
Penguin.fly() throws "Penguins can't fly!"
Runtime crashes. Production down.
```

**Without LSP:**
```js
// ❌ Rectangle assumption: setWidth doesn't affect height
function createRectangle(w, h) {
  let width = w, height = h;
  return {
    setWidth(w) { width = w; },
    setHeight(h) { height = h; },
    area() { return width * height; },
  };
}

// ❌ Square breaks Rectangle's contract silently
function createSquare(side) {
  let s = side;
  return {
    setWidth(w) { s = w; },   // forces height to change too!
    setHeight(h) { s = h; },  // forces width to change too!
    area() { return s * s; },
  };
}

// This code works fine with Rectangle
function testRectangle(shape) {
  shape.setWidth(5);
  shape.setHeight(10);
  console.log(shape.area()); // Expected 50
}

testRectangle(createRectangle(0, 0)); // ✅ 50
testRectangle(createSquare(0));       // ❌ 100 — LSP violated!
// Square pretends to be Rectangle but behaves differently
// Bugs like this are EXTREMELY hard to find in production
```

**With LSP:**
```js
// ✅ Proper hierarchy — don't force Square to be a Rectangle
function createShape(type, computeArea, computePerimeter) {
  return {
    type,
    area: computeArea,
    perimeter: computePerimeter,
    toString() { return `${type} (area=${this.area().toFixed(2)})`; },
  };
}

function createRectangle(w, h) {
  return createShape(
    "rectangle",
    () => w * h,
    () => 2 * (w + h)
  );
}

function createSquare(side) {
  return createShape(
    "square",
    () => side ** 2,
    () => 4 * side
  );
}

function createCircle(radius) {
  return createShape(
    "circle",
    () => Math.PI * radius ** 2,
    () => 2 * Math.PI * radius
  );
}

// This works with ALL shapes — LSP satisfied
function printShapeInfo(shape) {
  console.log(`${shape.toString()}, perimeter=${shape.perimeter().toFixed(2)}`);
}

[createRectangle(5, 10), createSquare(5), createCircle(7)].forEach(printShapeInfo);
// Works perfectly for all — no surprises
```

**Pros:**
- Code that works with a type works with all its subtypes — no surprises
- Enables true polymorphism
- Reduces runtime errors from type mismatches

**Cons:**
- Requires careful design of hierarchies upfront
- Sometimes you want subtypes to *intentionally* behave differently — LSP can feel restrictive
- Can lead to overly flat hierarchies

**When to Apply:**
- Whenever you're doing inheritance or "this is a type of that"
- Ask yourself: "If I swap this object for another object of the same type, will the code still work correctly?"
- If answer is NO — you have an LSP violation

---

### I — Interface Segregation Principle

**Plain English:** Don't force a module to depend on things it doesn't use. Keep interfaces small and focused.

**The Pain It Solves:**
```
You create a "Worker" interface: work(), eat(), sleep()
Robot implements Worker — but robots don't eat or sleep!
Robot.eat() throws NotImplemented
Every time you add a method to Worker, ALL implementors must update
```

**Without ISP:**
```js
// ❌ One huge interface — every implementor gets forced to handle things they don't need
function createAnimalService(animal) {
  return {
    makeSound() { return animal.sound(); },
    move() { return animal.move(); },
    fly() { return animal.fly(); },    // what about dogs? cats?
    swim() { return animal.swim(); },  // what about eagles? 
    breatheUnderwater() { return animal.breatheUnderwater(); }, // what about everything else?
  };
}

// Now every animal MUST implement ALL methods
function createDog() {
  return {
    sound() { return "Woof"; },
    move() { return "runs"; },
    fly() { throw new Error("Dogs can't fly!"); },           // forced to implement
    swim() { return "doggy paddles"; },
    breatheUnderwater() { throw new Error("Dogs drown!"); }, // forced to implement
  };
}
// This will crash at runtime when someone calls dog.fly()
```

**With ISP:**
```js
// ✅ Small focused capabilities — mix and match what makes sense

function withSound(animal, soundFn) {
  return { ...animal, sound: soundFn };
}
function withFlying(animal, flyFn) {
  return { ...animal, fly: flyFn };
}
function withSwimming(animal, swimFn) {
  return { ...animal, swim: swimFn };
}
function withRunning(animal, runFn) {
  return { ...animal, run: runFn };
}

// Build animals with ONLY what they can do
function createDog(name) {
  return withSound(
    withSwimming(
      withRunning({ name }, () => `${name} sprints!`),
      () => `${name} doggy paddles`
    ),
    () => "Woof"
  );
}

function createEagle(name) {
  return withSound(
    withFlying({ name }, () => `${name} soars at 150 km/h`),
    () => "Screech"
  );
}

function createDuck(name) {
  // Ducks can do all three!
  return withSound(
    withFlying(
      withSwimming({ name }, () => `${name} glides on water`),
      () => `${name} flies low`
    ),
    () => "Quack"
  );
}

const dog = createDog("Rex");
console.log(dog.sound()); // Woof
console.log(dog.swim());  // Rex doggy paddles
// dog.fly doesn't exist — no crash, no "NotImplemented"

const duck = createDuck("Donald");
console.log(duck.fly());  // Donald flies low
console.log(duck.swim()); // Donald glides on water
console.log(duck.sound()); // Quack
```

**Pros:**
- No "does not apply" methods on objects
- Smaller interfaces = easier to understand and implement
- Changing one capability doesn't affect unrelated ones

**Cons:**
- More factories/mixins to manage
- Can lead to many tiny pieces that are hard to discover
- Need good naming conventions

**When to Apply:**
- When you see objects implementing methods with `throw new Error("Not supported")`
- When adding a new method to a shared interface forces updates in 20 places
- Repository interfaces: `readOnly` vs `readWrite` interfaces for different use cases

---

### D — Dependency Inversion Principle

**Plain English:** High-level business logic shouldn't depend on low-level implementation details. Both should depend on abstractions (contracts/interfaces).

**The Pain It Solves:**
```
Your OrderService directly uses MySQLDatabase.
Boss says: "We're migrating to MongoDB next month."
You have to rewrite OrderService completely.
Every service that uses MySQL directly must be rewritten.
Can't test OrderService without a real MySQL connection.
```

**Without DIP:**
```js
// ❌ OrderService knows too much about how storage works
function createOrderService() {
  // Hard dependency — can't swap without changing this code
  const db = mysql.createConnection({ host: "localhost", user: "root" });
  const emailer = new SendGrid("API_KEY_123"); // hard dependency

  return {
    async placeOrder(orderData) {
      // Tightly coupled to MySQL syntax
      const result = await db.query(
        "INSERT INTO orders (user_id, total) VALUES (?, ?)",
        [orderData.userId, orderData.total]
      );

      // Tightly coupled to SendGrid API
      await emailer.send({
        personalizations: [{ to: [{ email: orderData.email }] }],
        subject: "Order placed",
      });

      return result.insertId;
    },
  };
}

// Can't test without real MySQL + real SendGrid
// Can't switch to MongoDB without rewriting OrderService
// Can't switch to Mailgun without rewriting OrderService
```

**With DIP:**
```js
// ✅ OrderService depends on abstractions — inject whatever you want

// The "contracts" (abstractions)
// Any object with these methods works

// createOrderService expects:
//   repo: { save(order), findById(id) }
//   mailer: { sendOrderConfirmation(email, order) }
//   logger: { info(msg), error(msg) }

function createOrderService(repo, mailer, logger) {
  return {
    async placeOrder(orderData) {
      try {
        logger.info(`Placing order for user ${orderData.userId}`);
        const order = await repo.save(orderData);           // uses abstraction
        await mailer.sendOrderConfirmation(orderData.email, order); // uses abstraction
        logger.info(`Order ${order.id} placed successfully`);
        return order;
      } catch (err) {
        logger.error(`Order failed: ${err.message}`);
        throw err;
      }
    },
  };
}

// Implementation 1: MySQL
function createMySQLOrderRepo(connection) {
  return {
    async save(order) {
      const [result] = await connection.execute(
        "INSERT INTO orders SET ?", [order]
      );
      return { ...order, id: result.insertId };
    },
    async findById(id) {
      const [rows] = await connection.execute("SELECT * FROM orders WHERE id=?", [id]);
      return rows[0];
    },
  };
}

// Implementation 2: MongoDB (swap without touching OrderService)
function createMongoOrderRepo(collection) {
  return {
    async save(order) {
      const result = await collection.insertOne(order);
      return { ...order, id: result.insertedId };
    },
    async findById(id) {
      return collection.findOne({ _id: id });
    },
  };
}

// Implementation 3: In-memory (for tests — NO real DB needed!)
function createInMemoryOrderRepo() {
  const orders = new Map();
  let nextId = 1;
  return {
    async save(order) {
      const saved = { ...order, id: nextId++ };
      orders.set(saved.id, saved);
      return saved;
    },
    async findById(id) { return orders.get(id); },
    _getAll() { return [...orders.values()]; }, // test helper
  };
}

// Mailer implementations
function createSendGridMailer(apiKey) {
  return {
    async sendOrderConfirmation(email, order) {
      console.log(`SendGrid: sending to ${email} for order ${order.id}`);
    },
  };
}

function createConsoleMailer() {
  // For local dev — no real emails sent
  return {
    async sendOrderConfirmation(email, order) {
      console.log(`[DEV] Would send email to ${email}: Order ${order.id} confirmed`);
    },
  };
}

// Production
const prodService = createOrderService(
  createMySQLOrderRepo(mysqlConnection),
  createSendGridMailer("SG_API_KEY"),
  console
);

// Testing — no real DB, no real emails
const testService = createOrderService(
  createInMemoryOrderRepo(),
  createConsoleMailer(),
  { info: () => {}, error: () => {} } // silent logger for tests
);
```

**Pros:**
- Swap implementations without touching business logic
- Test business logic with fast in-memory fakes (no real DB needed)
- Each layer is independently changeable
- Makes code dramatically easier to unit test

**Cons:**
- More setup code (wiring/injection)
- Can feel complex for simple scripts
- Need a good way to wire dependencies (manual DI, DI container, etc.)

**When to Apply:**
- Literally every service that talks to a DB, API, email service, file system
- If you can't test a function without a running database — DIP needed
- When you want to swap from MySQL to Postgres or SendGrid to Mailgun

---

## PART 2 — Design Patterns

### Why Do Design Patterns Exist?

**The honest answer:**
Patterns are just *named solutions to recurring problems*. They exist because thousands of developers kept hitting the same problems and discovered the same solutions independently. Patterns are just giving those solutions a shared vocabulary.

When a senior dev says "use Observer here" — they mean "I've seen this problem 20 times, here's the battle-tested solution."

---

### CREATIONAL PATTERNS
*"How do I create objects in a smart way?"*

---

### Singleton — "There Can Only Be One"

**What:** Ensures only one instance of something exists across your entire application.

**Real Problems It Solves:**
- Configuration that should be consistent everywhere
- Database connection pool (you don't want 500 open connections)
- Logger that writes to one file
- Feature flag service

**When You DON'T Need It:**
- Most of the time, just export a plain object from a module — that's naturally a singleton in Node.js
- When you need multiple instances in tests

```js
// ❌ Without Singleton — inconsistent state
const config1 = createConfig(); // these are DIFFERENT objects
const config2 = createConfig(); // with DIFFERENT state
config1.set("debug", true);
console.log(config2.get("debug")); // undefined — different instance!
// Your app has two different "configs" — bugs everywhere

// ✅ The problem scenario where Singleton actually helps
function createConfigManager() {
  // Private state
  const settings = new Map();
  const validators = new Map();
  let locked = false; // prevent changes after app starts

  return {
    set(key, value) {
      if (locked) throw new Error("Config is locked after app start");
      const validator = validators.get(key);
      if (validator && !validator(value)) {
        throw new Error(`Invalid value for config key: ${key}`);
      }
      settings.set(key, value);
      return this;
    },

    get(key, defaultValue = undefined) {
      if (!settings.has(key)) {
        if (defaultValue !== undefined) return defaultValue;
        throw new Error(`Config key "${key}" not found`);
      }
      return settings.get(key);
    },

    require(key) {
      if (!settings.has(key)) throw new Error(`Required config "${key}" missing`);
      return settings.get(key);
    },

    addValidator(key, fn) {
      validators.set(key, fn);
      return this;
    },

    lock() {
      locked = true;
      console.log("Config locked.");
      return this;
    },

    getAll() { return Object.fromEntries(settings); },
  };
}

// The singleton pattern — ONE instance for the whole app
const AppConfig = (() => {
  let instance = null;
  return {
    getInstance() {
      if (!instance) instance = createConfigManager();
      return instance;
    },
  };
})();

// Anywhere in your app:
AppConfig.getInstance().set("db_host", "localhost").set("port", 3000).lock();
// Later, anywhere else:
const host = AppConfig.getInstance().get("db_host"); // "localhost" — same instance!
```

**Pros:**
- Guaranteed single source of truth
- Saves resources (one DB pool not 100)
- Consistent state across the app

**Cons:**
- Hard to test — global state leaks between tests
- Hidden dependencies — code secretly relies on global state
- Tight coupling to the specific implementation

**Use When:** Config, Logger, DB Connection Pool, Feature Flags, App-wide Cache
**Avoid When:** Anything that needs multiple instances, or when testing matters (mock it instead)

---

### Factory — "Let Someone Else Decide Which Object to Make"

**What:** A function that creates objects. The caller says *what* they want, the factory decides *how* to create it.

**Real Problems It Solves:**
- Creating different DB clients based on environment
- Creating different logger types (console/file/remote)
- Creating notification handlers based on event type
- Hiding complex creation logic

```js
// ❌ Without Factory — object creation logic scattered everywhere
// In UserService.js:
const logger = process.env.NODE_ENV === "prod"
  ? new WinstonLogger({ level: "warn" })
  : new ConsoleLogger({ level: "debug" });

// In OrderService.js: (SAME code duplicated)
const logger = process.env.NODE_ENV === "prod"
  ? new WinstonLogger({ level: "warn" })
  : new ConsoleLogger({ level: "debug" });

// Change logger? Update EVERY service file.

// ✅ With Factory — creation in one place
function createLogger(env = process.env.NODE_ENV) {
  // All the "which logger to use" logic lives HERE, nowhere else
  const configs = {
    production: () => createWinstonLogger({ level: "warn", file: "app.log" }),
    staging:    () => createWinstonLogger({ level: "info", file: "staging.log" }),
    test:       () => createSilentLogger(),
    development: () => createPrettyConsoleLogger({ level: "debug", colors: true }),
  };

  const factory = configs[env] ?? configs.development;
  return factory();
}

function createWinstonLogger({ level, file }) {
  return {
    info(msg) { /* write to file */ console.log(`[${level}] INFO: ${msg}`); },
    warn(msg) { console.warn(`WARN: ${msg}`); },
    error(msg) { console.error(`ERROR: ${msg}`); },
  };
}

function createPrettyConsoleLogger({ level, colors }) {
  const color = colors ? "\x1b[36m%s\x1b[0m" : "%s";
  return {
    info(msg) { console.log(color, `🔵 INFO: ${msg}`); },
    warn(msg) { console.warn(`🟡 WARN: ${msg}`); },
    error(msg) { console.error(`🔴 ERROR: ${msg}`); },
  };
}

function createSilentLogger() {
  return { info() {}, warn() {}, error() {} }; // does nothing — for tests
}

// Every service just does:
const logger = createLogger(); // environment handled automatically
// Change all loggers? Change createLogger() only.
```

**Pros:**
- Centralizes creation logic
- Easy to add new types without touching callers
- Can swap implementations based on env/config
- Great for testing (return mock from factory in tests)

**Cons:**
- Adds indirection — you don't see exactly what's being created
- Can become complex if factory has too many conditions

**Use When:** Creating objects where the exact type depends on config/environment/input, where creation is complex, or where you want easy swapping

---

### Builder — "Build Complex Objects Step by Step"

**What:** When an object needs many optional configuration options, Builder lets you set them one by one in a readable chain instead of passing 10 arguments.

**The Pain It Solves:**
```js
// ❌ Without Builder — the "telescoping constructor" problem
// Which argument is which? What's that 3rd boolean mean?
const req = new HTTPRequest("POST", "/api/users", headers, body, 5000, true, false, "gzip", 3, 1000);
//                                                                       ^ timeout? retries? what??

// Or worse — optional args with undefined:
createUser(name, email, undefined, undefined, undefined, true, undefined, "admin");
//                                                            ^ what is this?
```

```js
// ✅ With Builder — self-documenting, easy to use
function createHTTPRequest() {
  // These are all the config options with sensible defaults
  let method = "GET";
  let url = "";
  const headers = {};
  let body = null;
  let timeout = 5000;
  let retries = 0;
  let retryDelay = 1000;
  let encoding = null;
  let auth = null;
  let cachePolicy = "no-cache";

  const builder = {
    // Each method sets one thing and returns builder for chaining
    get(u) { method = "GET"; url = u; return builder; },
    post(u) { method = "POST"; url = u; return builder; },
    put(u) { method = "PUT"; url = u; return builder; },
    delete(u) { method = "DELETE"; url = u; return builder; },

    withHeader(key, value) { headers[key] = value; return builder; },
    withBody(b) { body = b; return builder; },
    withTimeout(ms) { timeout = ms; return builder; },
    withRetries(n, delay = 1000) { retries = n; retryDelay = delay; return builder; },
    withAuth(token) { auth = `Bearer ${token}`; return builder; },
    withCache(policy) { cachePolicy = policy; return builder; },

    // Final step — actually build the request object
    build() {
      if (!url) throw new Error("URL is required");
      return {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          ...(auth ? { Authorization: auth } : {}),
          "Cache-Control": cachePolicy,
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
        timeout,
        retries,
        retryDelay,
      };
    },

    // Shortcut: build + execute
    async send() {
      const config = this.build();
      // execute the request...
      console.log("Sending:", config);
      return fetch(config.url, config);
    },
  };

  return builder;
}

// Now usage is crystal clear:
const request = createHTTPRequest()
  .post("/api/users")
  .withAuth("my_token_here")
  .withBody({ name: "Alice", role: "admin" })
  .withTimeout(3000)
  .withRetries(3, 500)
  .build();

// Compare to: new HTTPRequest("POST", "/api/users", {"Authorization":"Bearer ..."}, ...)
```

**Pros:**
- Readable — each option is named
- Optional params are clean (just don't call that method)
- Validates at `.build()` time — catches missing required fields
- Prevents invalid states (can't call `.build()` with no URL)

**Cons:**
- More code than just a plain object `{ method: "POST", url: "..." }`
- Overkill for simple objects with 2-3 fields

**Use When:** 5+ configuration options, many optional fields, complex validation needed during construction. Great for: SQL query builders, HTTP clients, email builders, notification configs.

---

### STRUCTURAL PATTERNS
*"How do I compose objects and connect things that don't naturally fit together?"*

---

### Adapter — "Make Incompatible Things Work Together"

**What:** Wraps one interface to look like another. Like a phone charger adapter — your plug is one shape, the socket is another, adapter bridges them.

**Real Problem It Solves:**
```
You use library A. You switch to library B. 
Library B has completely different API.
Do you rewrite all your code that used library A?
Or do you write a thin adapter that makes B look like A?
```

```js
// You built your app using this interface everywhere:
// storageService.save(key, data)
// storageService.load(key)
// storageService.delete(key)

// You used localStorage originally:
function createLocalStorageAdapter() {
  return {
    save(key, data) { localStorage.setItem(key, JSON.stringify(data)); },
    load(key) {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    },
    delete(key) { localStorage.removeItem(key); },
  };
}

// Now you want to use IndexedDB (totally different API!)
// Instead of changing ALL your code — write an adapter

function createIndexedDBAdapter(dbName, storeName) {
  // IndexedDB is async and uses a completely different API
  // But we adapt it to look EXACTLY like our simple interface

  async function openDB() {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onupgradeneeded = e => e.target.result.createObjectStore(storeName);
      req.onsuccess = e => resolve(e.target.result);
      req.onerror = e => reject(e.target.error);
    });
  }

  // Expose the SAME interface as localStorage adapter
  return {
    async save(key, data) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName).put(data, key);
        tx.oncomplete = resolve;
        tx.onerror = e => reject(e.target.error);
      });
    },

    async load(key) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readonly");
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = e => resolve(e.target.result ?? null);
        req.onerror = e => reject(e.target.error);
      });
    },

    async delete(key) {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(storeName, "readwrite");
        tx.objectStore(storeName).delete(key);
        tx.oncomplete = resolve;
        tx.onerror = e => reject(e.target.error);
      });
    },
  };
}

// Your app code NEVER changes — just swap the adapter
const storage = createIndexedDBAdapter("myApp", "keyValueStore");
// All existing save/load/delete calls work identically
```

**Pros:**
- Migrate third-party libraries without rewriting your whole app
- Wrap messy/complex APIs with a clean interface
- Enables easy A/B testing of two different implementations

**Cons:**
- Adds a layer of indirection
- Can hide performance characteristics of the underlying library
- Easy to let adapters accumulate without cleanup

**Use When:** Switching third-party libraries, wrapping legacy APIs, making two systems talk to each other

---

### Decorator — "Add Features Without Modifying the Original"

**What:** Wraps an object and adds behavior before/after its methods. Stack multiple decorators to compose behaviors.

**Real Problem It Solves:**
```
You have a fetch() function. You want to add:
- Automatic retry on failure
- Request logging  
- Response caching
- Auth token injection
- Rate limiting

Do you add all of this into one massive function? 
Or do you layer them on as needed?
```

```js
// ✅ Base fetch function — clean, does ONE thing
function createBaseFetcher() {
  return {
    async fetch(url, options = {}) {
      const response = await globalThis.fetch(url, options);
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      return response.json();
    },
  };
}

// Decorator 1: Add logging (wraps fetch, adds logs before/after)
function withLogging(fetcher) {
  return {
    async fetch(url, options) {
      console.log(`→ ${options.method || "GET"} ${url}`);
      const start = Date.now();
      try {
        const result = await fetcher.fetch(url, options);
        console.log(`← 200 ${url} (${Date.now() - start}ms)`);
        return result;
      } catch (err) {
        console.error(`← ERR ${url} (${Date.now() - start}ms): ${err.message}`);
        throw err;
      }
    },
  };
}

// Decorator 2: Add retry logic
function withRetry(fetcher, maxRetries = 3, delay = 1000) {
  return {
    async fetch(url, options) {
      let lastError;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await fetcher.fetch(url, options);
        } catch (err) {
          lastError = err;
          if (attempt < maxRetries) {
            const wait = delay * 2 ** (attempt - 1); // exponential backoff
            console.log(`Retry ${attempt}/${maxRetries} in ${wait}ms...`);
            await new Promise(r => setTimeout(r, wait));
          }
        }
      }
      throw lastError;
    },
  };
}

// Decorator 3: Add caching
function withCache(fetcher, ttlMs = 60000) {
  const cache = new Map();
  return {
    async fetch(url, options) {
      // Only cache GET requests
      if (options.method && options.method !== "GET") {
        return fetcher.fetch(url, options);
      }
      const cacheKey = url + JSON.stringify(options);
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < ttlMs) {
        console.log(`[CACHE] ${url}`);
        return cached.data;
      }
      const data = await fetcher.fetch(url, options);
      cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    },
  };
}

// Decorator 4: Add auth token
function withAuth(fetcher, getToken) {
  return {
    async fetch(url, options = {}) {
      const token = await getToken();
      return fetcher.fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
    },
  };
}

// Compose decorators — stack them like layers of an onion
// Each layer adds one behavior
const httpClient = withLogging(
  withRetry(
    withCache(
      withAuth(
        createBaseFetcher(),
        () => localStorage.getItem("token")
      ),
      30000 // 30 second cache
    ),
    3 // 3 retries
  )
);

// Usage is IDENTICAL to the base fetcher
// But now has: auth, caching, retry, logging
httpClient.fetch("/api/users");

// Need a version WITHOUT cache for a specific call?
const noCacheClient = withLogging(withRetry(withAuth(createBaseFetcher(), getToken)));
```

**Pros:**
- Add/remove behaviors independently
- Mix and match features for different scenarios
- Each decorator does one thing — easy to test individually
- The base object stays clean

**Cons:**
- Wrapping many layers can be confusing to debug
- Order of decorators matters — easy to get wrong
- Can add performance overhead with deep stacks

**Use When:** Logging, caching, retry, auth, rate limiting, validation — any "cross-cutting concern" you want to apply selectively

---

### Proxy — "Control Access to Something"

**What:** Same interface as the real object, but intercepts calls to add: access control, caching, lazy loading, validation, logging.

**Difference from Decorator:**
- Decorator adds NEW behavior (logging that didn't exist before)
- Proxy controls ACCESS to existing behavior (auth check before existing method)

```js
// Real use case: Lazy-loading expensive resources

function createDatabaseProxy(getConnection) {
  let connection = null; // not connected until first use

  async function getConn() {
    if (!connection) {
      console.log("Creating DB connection (lazy)...");
      connection = await getConnection(); // expensive — only happens once, on first use
    }
    return connection;
  }

  const accessLog = [];

  return {
    // Same interface as real DB connection
    async query(sql, params) {
      // Access control
      if (sql.trim().toUpperCase().startsWith("DROP")) {
        throw new Error("DROP statements not allowed through proxy");
      }

      // Logging
      const start = Date.now();
      accessLog.push({ sql, timestamp: new Date(), params });

      const conn = await getConn(); // lazy connection
      const result = await conn.query(sql, params);

      console.log(`Query took ${Date.now() - start}ms`);
      return result;
    },

    getAccessLog() { return [...accessLog]; },
    disconnect() { connection?.end(); connection = null; },
  };
}

// Real use case: Virtual proxy for large images
function createImageProxy(imagePath) {
  let realImage = null; // not loaded until displayed

  return {
    display() {
      if (!realImage) {
        console.log(`Loading image: ${imagePath}...`); // loads only when first displayed
        realImage = loadHighResImage(imagePath);        // expensive operation
      }
      realImage.display();
    },

    // Can show thumbnail without loading full image
    showThumbnail() {
      console.log(`Showing thumbnail for: ${imagePath}`);
    },
  };
}
```

**Pros:**
- Add security checks transparently
- Defer expensive initialization until needed
- Add logging/monitoring without changing core objects

**Cons:**
- Adds complexity and indirection
- Can hide performance issues
- Debugging can be harder since calls are intercepted

**Use When:** Lazy loading, access control, rate limiting on specific objects, logging/monitoring specific APIs

---

### BEHAVIORAL PATTERNS
*"How do objects communicate and collaborate?"*

---

### Observer — "Notify Many When Something Changes"

**What:** When one thing changes, automatically notify everything that cares about it. The notifier doesn't know WHO is listening — it just broadcasts.

**Real Problems It Solves:**
```
User places an order. Now you need to:
1. Send confirmation email
2. Update inventory
3. Notify shipping department
4. Add to analytics
5. Push notification to user

Without Observer: OrderService calls all 5 directly
→ OrderService is coupled to Email, Inventory, Shipping, Analytics, Notifications
→ Add a 6th thing? Modify OrderService.

With Observer: OrderService emits "ORDER_PLACED" and forgets
→ Each service listens independently
→ Add a 6th thing? Just add a new listener — OrderService unchanged
```

```js
function createEventBus() {
  const listeners = new Map();

  return {
    // Subscribe to events — returns unsubscribe function
    on(event, handler) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(handler);

      // Return cleanup function — important to prevent memory leaks!
      return () => listeners.get(event)?.delete(handler);
    },

    // Subscribe to just the FIRST occurrence
    once(event, handler) {
      const unsubscribe = this.on(event, (...args) => {
        handler(...args);
        unsubscribe();
      });
      return unsubscribe;
    },

    // Emit — publisher doesn't know who's listening
    emit(event, data) {
      listeners.get(event)?.forEach(handler => {
        try { handler(data); }
        // ONE bad handler shouldn't break all others
        catch (err) { console.error(`[EventBus] Handler error on "${event}":`, err.message); }
      });
    },

    off(event, handler) { listeners.get(event)?.delete(handler); },
    listenerCount(event) { return listeners.get(event)?.size ?? 0; },
  };
}

// Usage: Order processing system
const bus = createEventBus();

// Each service registers independently — OrderService knows NONE of these
const unsubEmail = bus.on("ORDER_PLACED", async ({ order, user }) => {
  console.log(`📧 Sending confirmation to ${user.email}`);
  // await emailService.send(...)
});

const unsubInventory = bus.on("ORDER_PLACED", async ({ order }) => {
  console.log(`📦 Reducing inventory for items in order ${order.id}`);
  // await inventoryService.reduce(order.items)
});

bus.on("ORDER_PLACED", ({ order }) => {
  console.log(`📊 Analytics: order value $${order.total}`);
  // analytics.track("purchase", order)
});

bus.on("ORDER_SHIPPED", ({ order, trackingId }) => {
  console.log(`🚚 Sending tracking email: ${trackingId}`);
});

// OrderService — clean, knows nothing about email/inventory/analytics
function createOrderService(db, eventBus) {
  return {
    async placeOrder(orderData) {
      const order = await db.save(orderData);
      // Just emit — let listeners handle their own responsibilities
      eventBus.emit("ORDER_PLACED", { order, user: orderData.user });
      return order;
    },
  };
}

// Later, unsubscribe if needed (e.g., user logs out)
unsubEmail();
```

**Pros:**
- Decouples event producers from consumers completely
- Add new reactions to events without modifying the emitter
- Services don't know about each other

**Cons:**
- Hard to trace: "Why did X happen?" — must find all listeners
- Memory leaks if you forget to unsubscribe
- Order of handler execution isn't guaranteed
- Error in one handler shouldn't break others (need try-catch)

**Use When:** Anything where one action triggers multiple reactions, UI updates, notification systems, audit logging, real-time features

---

### Strategy — "Swap Algorithms at Runtime"

**What:** Define a family of algorithms, put each in its own function, make them interchangeable. The context uses whichever strategy is configured.

**Real Problem It Solves:**
```
You need to sort users by: name, age, date, relevance, popularity
You need auth via: JWT, OAuth, API key, session
You need to export data as: CSV, JSON, Excel, PDF
You need to calculate shipping as: standard, express, overnight

Without Strategy: Giant if/else in one function
With Strategy: Each algorithm is its own function, hot-swappable
```

```js
// E-commerce: Dynamic pricing strategies
function createFixedPricingStrategy() {
  return {
    name: "fixed",
    // Returns price as-is — no modification
    calculate(basePrice, context) {
      return { finalPrice: basePrice, discount: 0, reason: "Fixed pricing" };
    },
  };
}

function createVolumeDiscountStrategy(tiers) {
  // tiers: [{ minQty: 10, discount: 0.05 }, { minQty: 50, discount: 0.1 }]
  return {
    name: "volume_discount",
    calculate(basePrice, { quantity }) {
      const applicableTier = [...tiers]
        .sort((a, b) => b.minQty - a.minQty)
        .find(t => quantity >= t.minQty);

      const discount = applicableTier?.discount ?? 0;
      return {
        finalPrice: basePrice * (1 - discount),
        discount,
        reason: applicableTier ? `Volume discount: ${discount * 100}% off` : "No discount",
      };
    },
  };
}

function createSeasonalPricingStrategy(schedule) {
  // schedule: [{ name: "Black Friday", start: "2024-11-29", end: "2024-12-01", discount: 0.3 }]
  return {
    name: "seasonal",
    calculate(basePrice, { date = new Date() } = {}) {
      const active = schedule.find(s => date >= new Date(s.start) && date <= new Date(s.end));
      const discount = active?.discount ?? 0;
      return {
        finalPrice: basePrice * (1 - discount),
        discount,
        reason: active ? `${active.name}: ${discount * 100}% off!` : "Regular price",
      };
    },
  };
}

function createMembershipPricingStrategy(memberTiers) {
  // memberTiers: { gold: 0.15, silver: 0.10, bronze: 0.05 }
  return {
    name: "membership",
    calculate(basePrice, { membershipLevel }) {
      const discount = memberTiers[membershipLevel] ?? 0;
      return {
        finalPrice: basePrice * (1 - discount),
        discount,
        reason: `${membershipLevel} member discount: ${discount * 100}% off`,
      };
    },
  };
}

// PricingEngine uses whatever strategy is configured — no if/else here
function createPricingEngine(defaultStrategy) {
  let strategy = defaultStrategy;

  return {
    setStrategy(newStrategy) { strategy = newStrategy; },

    getPrice(product, context = {}) {
      const result = strategy.calculate(product.basePrice, context);
      return {
        productId: product.id,
        basePrice: product.basePrice,
        ...result,
        strategyUsed: strategy.name,
      };
    },

    // Compare prices across strategies — useful for testing
    compareStrategies(product, context, strategies) {
      return strategies.map(s => ({
        strategy: s.name,
        ...s.calculate(product.basePrice, context),
      }));
    },
  };
}

// Usage
const engine = createPricingEngine(createFixedPricingStrategy());
console.log(engine.getPrice({ id: 1, basePrice: 100 }, { quantity: 1 }));
// { finalPrice: 100, discount: 0, reason: "Fixed pricing" }

engine.setStrategy(createVolumeDiscountStrategy([
  { minQty: 10, discount: 0.05 },
  { minQty: 50, discount: 0.10 },
  { minQty: 100, discount: 0.20 },
]));
console.log(engine.getPrice({ id: 1, basePrice: 100 }, { quantity: 60 }));
// { finalPrice: 90, discount: 0.1, reason: "Volume discount: 10% off" }
```

**Pros:**
- Swap algorithms without changing the context
- Easy to add new strategies (just add a new function)
- Each strategy independently testable
- No more if/else chains that grow forever

**Cons:**
- Client must know which strategies exist to pick one
- Overkill if you have only 2 simple variations

**Use When:** Multiple algorithms for the same task, sorting/filtering/pricing logic, auth methods, export formats, notification channels

---

### Command — "Turn Actions into Objects (Enables Undo)"

**What:** Wrap each action as an object with `execute()` and `undo()`. Store these objects to enable undo/redo history.

**Real Problems It Solves:**
- Text editors (Ctrl+Z)
- Design tools (Photoshop history)
- Database transactions (rollback)
- Job queues (retry failed jobs)
- Spreadsheets (formula recalculation)

```js
// WHY you need Command: Without it, undo is nearly impossible
// ❌ Without Command:
function applyDiscount(cart, percentage) {
  cart.items.forEach(item => {
    item.price = item.price * (1 - percentage); // how do you undo this?
  });
}
// You can't undo this without storing the original prices somewhere
// The more actions, the more complex the "undo" state management gets

// ✅ With Command: Undo is built-in to each action
function createApplyDiscountCommand(cart, percentage) {
  const originalPrices = new Map(); // capture state BEFORE change

  return {
    execute() {
      cart.items.forEach(item => {
        originalPrices.set(item.id, item.price); // save original
        item.price = item.price * (1 - percentage);
      });
      console.log(`Applied ${percentage * 100}% discount`);
    },
    undo() {
      cart.items.forEach(item => {
        item.price = originalPrices.get(item.id); // restore original
      });
      console.log(`Undid ${percentage * 100}% discount`);
    },
    description: `Apply ${percentage * 100}% discount`,
  };
}

function createAddItemCommand(cart, item) {
  return {
    execute() { cart.items.push(item); },
    undo() { cart.items = cart.items.filter(i => i.id !== item.id); },
    description: `Add ${item.name} to cart`,
  };
}

// The history manager — generic, works with ANY command
function createHistoryManager(maxSize = 50) {
  const undoStack = [];
  const redoStack = [];

  return {
    execute(command) {
      command.execute();
      undoStack.push(command);
      if (undoStack.length > maxSize) undoStack.shift(); // limit history size
      redoStack.length = 0; // new action clears redo history
    },

    undo() {
      const cmd = undoStack.pop();
      if (!cmd) { console.log("Nothing to undo"); return false; }
      cmd.undo();
      redoStack.push(cmd);
      return true;
    },

    redo() {
      const cmd = redoStack.pop();
      if (!cmd) { console.log("Nothing to redo"); return false; }
      cmd.execute();
      undoStack.push(cmd);
      return true;
    },

    getHistory() {
      return undoStack.map(c => c.description);
    },

    get canUndo() { return undoStack.length > 0; },
    get canRedo() { return redoStack.length > 0; },
  };
}

// Usage
const cart = { items: [] };
const history = createHistoryManager();

history.execute(createAddItemCommand(cart, { id: 1, name: "Laptop", price: 999 }));
history.execute(createAddItemCommand(cart, { id: 2, name: "Mouse", price: 29 }));
history.execute(createApplyDiscountCommand(cart, 0.1));

console.log(cart.items); // laptop: 899.1, mouse: 26.1

history.undo(); // undo discount
console.log(cart.items); // laptop: 999, mouse: 29

history.undo(); // undo adding mouse
console.log(cart.items); // only laptop

history.redo(); // re-add mouse
```

**Pros:**
- Undo/redo becomes trivially easy to implement
- Commands are objects — can be serialized, queued, logged
- History is self-documenting

**Cons:**
- Every action needs a Command wrapper — more code
- State capture for undo can be complex/expensive
- Not worth it if you don't need undo/redo or history

**Use When:** Text/code editors, design tools, transaction systems, job queues, anything needing undo/redo

---

### Chain of Responsibility — "Pass It Down the Line"

**What:** A request passes through a chain of handlers. Each handler either processes it or passes it to the next. You don't know which handler will handle it.

**Real Problems It Solves:**
- Express.js middleware (EXACTLY this pattern)
- Support ticket escalation (L1 → L2 → L3)
- Request validation pipeline
- Access control checks

```js
// This IS the Chain of Responsibility pattern — you already use it!
// Express middleware is Chain of Responsibility
app.use(corsMiddleware);     // Handler 1
app.use(authMiddleware);     // Handler 2 — only if cors passes
app.use(rateLimitMiddleware); // Handler 3 — only if auth passes
app.use(validateBodyMiddleware); // Handler 4
app.post("/orders", createOrderHandler); // Final handler

// Let's build it from scratch to understand it
function createMiddlewarePipeline() {
  const middlewares = [];

  return {
    // Add a handler to the chain
    use(fn) { middlewares.push(fn); return this; },

    // Execute the chain
    async run(context) {
      let index = 0;

      async function next(err) {
        if (err) {
          // Find error handler (4-arg function)
          const errHandler = middlewares.slice(index).find(m => m.length === 4);
          if (errHandler) return errHandler(err, context, next);
          throw err;
        }

        const middleware = middlewares[index++];
        if (!middleware) return; // end of chain
        return middleware(context, next);
      }

      return next();
    },
  };
}

// Reusable middleware functions
function createAuthMiddleware(getUser) {
  return async (ctx, next) => {
    const token = ctx.headers?.authorization?.replace("Bearer ", "");
    if (!token) {
      ctx.status = 401;
      ctx.body = { error: "No token provided" };
      return; // STOP the chain — don't call next()
    }
    ctx.user = await getUser(token); // attach user to context
    return next(); // CONTINUE to next handler
  };
}

function createRateLimitMiddleware(limiter) {
  return async (ctx, next) => {
    const clientId = ctx.user?.id ?? ctx.ip;
    if (!limiter.isAllowed(clientId)) {
      ctx.status = 429;
      ctx.body = { error: "Too Many Requests", retryAfter: 60 };
      return; // STOP the chain
    }
    return next(); // CONTINUE
  };
}

function createValidationMiddleware(schema) {
  return async (ctx, next) => {
    const errors = schema.validate(ctx.body);
    if (errors.length) {
      ctx.status = 400;
      ctx.body = { error: "Validation failed", errors };
      return; // STOP
    }
    return next(); // CONTINUE
  };
}

// Usage
const pipeline = createMiddlewarePipeline()
  .use(createAuthMiddleware(getUserFromToken))
  .use(createRateLimitMiddleware(rateLimiter))
  .use(createValidationMiddleware(orderSchema))
  .use(async (ctx) => {
    // Final handler — only reached if all above pass
    ctx.body = await createOrder(ctx.body, ctx.user);
  });

await pipeline.run({ headers: req.headers, body: req.body, ip: req.ip });
```

**Pros:**
- Add/remove/reorder handlers without touching others
- Single responsibility — each handler does ONE check
- Easy to test each middleware independently
- You already know this from Express!

**Cons:**
- Request might pass through many handlers before reaching the right one
- Hard to see the full flow at a glance
- A handler forgetting to call `next()` silently stops the chain

**Use When:** Any pipeline-style processing: HTTP middleware, validation chains, approval workflows, multi-step data transformation

---

## PART 3 — Quick Reference: When to Use What

```
PROBLEM → PATTERN

"I need exactly ONE instance globally"
  → Singleton (config, logger, connection pool)

"I need to create different objects based on a condition"
  → Factory Method

"I need to create families of related objects"  
  → Abstract Factory (Light theme UI vs Dark theme UI)

"This object has 10+ optional config parameters"
  → Builder

"I need to copy an object quickly"
  → Prototype

"These two interfaces don't match"
  → Adapter

"I want to add features to an object without subclassing"
  → Decorator (logging, caching, retry, auth)

"I need to control access to this object"
  → Proxy (lazy load, auth, rate limit)

"I need a simple interface to a complex system"
  → Facade (startup sequence, home theater)

"I need tree-structured data treated uniformly"
  → Composite (file system, UI components, org chart)

"One change should notify many others"
  → Observer (events, pub/sub, reactive state)

"I need to swap algorithms at runtime"
  → Strategy (auth methods, pricing, sorting)

"I need undo/redo"
  → Command

"I need a validation/processing pipeline"
  → Chain of Responsibility (middleware)

"Object behavior changes based on its state"
  → State (order lifecycle, traffic light, ATM)

"I need to iterate without knowing the structure"
  → Iterator (paginated results, tree traversal)
```

---

## PART 4 — The 3 Biggest Mistakes Junior Devs Make

### Mistake 1: Using Patterns for Their Own Sake

```js
// ❌ This is RIDICULOUS
const greeter = createGreeterFactory()
  .withGreetingBuilder()
  .buildName("Alice")
  .buildGreeting("Hello")
  .constructGreetingObject();

// ✅ This is fine
function greet(name) { return `Hello, ${name}!`; }
greet("Alice");
```

**Rule:** Don't use a pattern just to use a pattern. 
Use it when you've felt the pain the pattern solves.

### Mistake 2: Making Everything a Class/Factory

```js
// ❌ Overkill
function createAdditionService() {
  return { add: (a, b) => a + b };
}

// ✅ Just a function
const add = (a, b) => a + b;
```

**Rule:** If you don't need encapsulation (private state) or multiple instances — just use a function.

### Mistake 3: Designing for a Future That Never Comes

```js
// ❌ "What if we need 15 more payment types?"
// Building for 15 payment types when you have 1

// ✅ Start simple, refactor to pattern when you feel the pain
// Make PayPal work → add Stripe → NOW extract the pattern
```

**Rule:** Don't over-engineer upfront. Write the simplest thing that works. Extract patterns when you see the same structure repeated 2-3 times.

---

*The goal of all of this: write code that's easy to change. That's it.*
