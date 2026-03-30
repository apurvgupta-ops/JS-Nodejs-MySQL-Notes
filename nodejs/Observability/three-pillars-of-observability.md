## 🏛️ The Three Pillars of Observability

### How a production system explains itself

Observability exists because production systems need a **structured way to speak**.
They do that using **three kinds of signals**, often called the **three pillars of observability**.

Each pillar answers a **different kind of question**.

---

## 🏛️ Pillar 1: Metrics (Monitoring) 📊

### Understanding overall system behavior

Metrics are **numbers measured over time**.

They help you understand:

* how busy the system is
* how fast or slow it is
* whether things are improving or degrading
* whether something abnormal is happening

Metrics answer questions like:

* Is traffic increasing?
* Is latency rising?
* Are errors becoming more frequent?
* Is the system slowly degrading?

Metrics give you:

* trends 📈
* patterns 📉
* early signals 🚨

> **This pillar is where monitoring fits. Monitoring is essentially about measuring and watching metrics to detect known problems early.**

Metrics tell you **that something is happening**, not why.

---

## 🏛️ Pillar 2: Logs (Logging) 🪵

### Understanding what exactly happened

Logs are **detailed records of events inside the system**.

They capture:

* actions taken by the system
* decisions made by the code
* errors and unusual situations
* important contextual information

Logs answer questions like:

* What went wrong?
* What was the system doing at that moment?
* What data was involved?
* Why did this operation fail?

Logs give **context** 🧠  
They turn symptoms into explanations.

Think of logs as:

> **The system’s written record of its thoughts and actions**

---

## 🏛️ Pillar 3: Traces (Tracing) 🧵

### Understanding how a single request moved through the system

A single user request usually:

* enters the backend
* passes through multiple layers
* interacts with databases or services
* then returns a response

Traces show the **entire journey** of one request.

They answer questions like:

* Where did time get spent?
* Which step caused the delay?
* Where did the failure start?
* How did this request flow end to end?

Traces are about:

* flow
* cause and effect
* timing relationships

Think of traces as:

> **A timeline of one request’s life**

---

## 🧠 Why All Three Pillars Are Needed

Each pillar alone is incomplete.

* Metrics show patterns, not details
* Logs show details, not flow
* Traces show flow, not long-term trends

Together, they allow:

* early detection 👀
* clear explanation 🧠
* confident debugging 🎯

That combination is what makes a system observable.

---

## 📦 Events (Not a Pillar)

### Where do events really fit?

**Events are not a pillar of observability.**
They are also **not unique or independent signals**.

Events are **point-in-time signals that are usually created from metrics, logs, or traces**.

In practice, events almost always come from one of these sources.

---

### 📊 Events from Metrics

Many events are **generated from metrics crossing a condition**.

Examples:

* CPU usage crosses 80% 🔥
* error rate crosses a defined threshold ❌
* latency suddenly spikes 🐌

When this happens:

* we create an event
* we notify people
* we annotate timelines or graphs

So here, the **metric is primary**, and the **event is derived**.

---

### 🪵 Logs as Events

Logs themselves are **events by nature**.

Examples:

* “Service restarted”
* “Config reloaded”
* “A request came”
* “An error occurred”

In this case:

* the log entry **is the event**
* no separate event system is needed

So you can safely think of:

> **Many events are simply structured log entries.**

---

### 🧵 Events and Traces

Traces usually represent **continuous request flow**, not events.

However:

* important moments inside a trace can be marked
* failures, retries, or unusual behavior can be highlighted

These are still **annotations or markers**, not standalone signals.

So even here:

* the trace remains the primary signal
* the event adds meaning or focus


> **Metrics, logs, and traces describe system behavior.
> Events highlight important moments within that behavior.**

---

## 🔠 MELT (A Commonly Used Acronym)

You may see **MELT** used online and in talks as:

* **M** → Metrics
* **E** → Events (Not a pillar)
* **L** → Logs
* **T** → Traces

This is a popular **memory aid**, but conceptually the **core pillars remain Metrics, Logs, and Traces**.
Events do not form a separate pillar. They are usually **derived from metrics, represented as logs, or used as annotations alongside traces**.

So MELT is useful for recall, but observability is still built on **three foundational pillars**, with events providing context across them.