## 🛠️ What is instrumentation?

**Instrumentation** means adding code in your app so it can **emit telemetry data** about what it’s doing while it runs 📡

Through instrumentation, an application generates:

* 📊 **metrics** to measure behavior over time
* 🪵 **logs** to record what happens inside the system
* 🧵 **traces** to follow how requests flow through the application

Instrumentation for metrics means:

* measuring runtime behavior (CPU, memory, event loop, GC, etc.) ⏱️
* tracking request counts, durations, errors, and custom business numbers 📊
* exposing these measurements via an endpoint (usually `/metrics`) so a TSDB like **Prometheus** can collect them 🔄

Think of it like adding “sensors” to your backend so it can report health and behavior, not just return API responses 🧠