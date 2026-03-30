## 🧩 The LGTM Stack

LGTM is just an **acronym for a group of tools** that work well together to make a system observable.

The letters are **not in learning order**, just like MERN is not learned in order either.

So don’t read LGTM left to right.
Read it as: “Which tool solves which observability need?”

---

## 📊 M → Metrics

### Mimir (Prometheus)

The **M** in LGTM officially stands for **Mimir**, which is a large-scale metrics storage system.

But in this course, we will use **Prometheus** instead ✅

Why?

* simpler to understand
* perfect for single backend systems
* widely used in industry
* excellent for learning fundamentals

Prometheus is used to:

* collect numerical data from a running backend
* store how values change over time
* help us see trends, spikes, and degradation

This is the part of observability where:  
👉 **monitoring naturally fits**

When you hear things like:

* watching request rate
* tracking latency
* checking error percentage
* alerting when something crosses a limit

You are talking about **metrics**.

So mentally lock this in 🧠

> Metrics are the foundation of monitoring, and Prometheus is what we’ll use to do that.

---

## 🪵 L → Logs

### Loki

The **L** stands for **Loki**, which deals with logs.

Logs answer a very different question.

Metrics tell you:

* something changed
* something looks wrong

Logs help you understand:

* what exactly happened
* what decision the system made
* what error occurred
* what context existed at that moment

Loki is designed to:

* collect logs from your backend
* store them efficiently
* make them easy to search and correlate

So when something feels off and you want to know:
“Okay, but what actually went wrong?”

This is where logs come in.

---

## 🧵 T → Traces

### Tempo

The **T** stands for **Tempo**, which handles traces.

Traces are about **one request at a time**.

A single request in a backend system:

* enters the server
* passes through multiple layers
* interacts with other components
* and then returns a response

Tempo helps you see:

* the full journey of that request
* where time was spent
* where delays or failures started

This is extremely useful when:

* the system is slow but not broken
* only some requests are affected
* behavior looks inconsistent

Traces help you answer:
“Where exactly did this request spend its time?”

---

## 📈 G → Grafana

### The common window into everything

The **G** stands for **Grafana**.

Grafana is not a pillar itself.
It is the **window** through which you see everything.

Grafana allows you to:

* visualize metrics
* explore logs
* inspect traces
* correlate all of them together

Instead of jumping between tools, Grafana gives you:

* graphs for trends
* timelines for behavior
* context for investigation

So Grafana ties the whole stack together visually 👀

---

## 🧠 How This All Fits Together (Conceptually)

* Prometheus answers: “How is the system behaving overall?”
* Loki answers: “What exactly happened?”
* Tempo answers: “How did this request flow through the system?”
* Grafana lets you see and connect all of that clearly

Each tool corresponds to **one way the system explains itself**.