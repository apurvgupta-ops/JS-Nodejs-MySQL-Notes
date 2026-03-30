## 📊 What Are Metrics?

**Metrics** are **numerical measurements emitted by a running system over time**.

Every metric always has **time attached to it** ⏱️  
That’s what makes metrics special.

So in practice, metrics produce **time-series data** 📈  
Which simply means:

> **values measured again and again at different points in time**

Because of this, metrics are extremely good at showing:

* trends over time 📉📈
* gradual changes
* sudden spikes or drops
* comparisons between “before” and “after”

---

## ⏱️ Why Time Matters in Metrics

A single number tells you almost nothing.
The **same number over time** tells you a story.

For example:

* CPU at 60% once → not very useful
* CPU rising from 20% → 40% → 60% over time → important signal 🔥

This time dimension is why metrics are the **primary source for understanding system behavior at scale**.

---

## 🗄️ Where Metrics Are Stored

Since metrics are time-based, they are stored in a **Time Series Database (TSDB)**.

A TSDB is optimized for:

* time-stamped data ⏱️
* fast aggregation
* querying behavior over time

In this course, we will use **Prometheus** as our TSDB for metrics.

Prometheus:

* collects metrics
* stores them as time-series data
* allows querying system behavior over time

---

## 👀 Metrics and Monitoring

The **act of collecting, measuring, and watching metrics** is called **monitoring**

So conceptually:

* **Metrics** → the data being produced 📊
* **Monitoring** → the process of collecting and watching that data

When you:

* measure values continuously
* observe how they change
* detect known abnormal conditions

You are doing **monitoring**, and it is **metrics-driven**.

---

## 🚨 Alerts

**Alerts** are notifications sent to humans when **metrics cross conditions that matter**.

In simple terms 👇

> **Alerts are how monitoring asks for human attention.**

Metrics show behavior 📊  
Monitoring watches those metrics 👀  
Alerts decide **when a human should be involved** 🚨  

---

## 🧠 What Alerts Are Meant to Do (Very Important)

Alerts are **not for information** ❌  
Alerts are **for action** ✅

A good alert answers:

* Is something wrong *right now*?
* Does it need a human?
* Can someone do something about it?

If the answer is “no”, it should not be an alert.

---

## 🎯 What Should Alerts Be Based On?

Alerts should be tied to **user impact and system health**, not random numbers.

Good alert signals usually come from:

* ⏱️ latency becoming unacceptable
* ❌ error rate crossing a safe limit
* 🔥 CPU or RAM usage reaching dangerous levels

---

## ⚠️ Thresholds: Be Careful

A **threshold** is a condition like:

* latency > 1 second
* error rate > 2%
* CPU > 90%

Thresholds are necessary, but dangerous if chosen blindly.

Bad thresholds cause:

* alert noise 🔔🔔🔔
* alert fatigue 😵
* ignored alerts 🙈

Good thresholds are:

* meaningful
* stable
* tied to real impact
---

## 🚫 What NOT to Alert On

Do not alert on:

* every small spike 📈
* normal fluctuations
* metrics with no action
* things that fix themselves

Dashboards are for watching.  
Alerts are for waking people up 😴➡️🚨

---

## 🎯 Summary

> **Metrics are time-based numerical measurements stored in a time series database, and monitoring is the practice of collecting and watching those metrics.**

> **Alerts are signals to humans, triggered by metrics, and should exist only when action is required.**
