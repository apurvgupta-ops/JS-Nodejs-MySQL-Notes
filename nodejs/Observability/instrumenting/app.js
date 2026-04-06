import express from "express";
import fs from "fs";
import promClient from "prom-client";

const app = express();
const PORT = 4000;

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the demo Express app 👋",
  });
});

app.get("/unstable", async (req, res) => {
  const delays = [500, 1000, 2000];
  const delay = delays[Math.floor(Math.random() * delays.length)];

  const shouldFail = Math.random() < 0.4;

  await new Promise((resolve) => setTimeout(resolve, delay));

  if (shouldFail) {
    const errorTypes = [
      { status: 500, message: "Internal Server Error" },
      { status: 503, message: "Service Unavailable" },
      { status: 504, message: "Gateway Timeout" },
      { status: 400, message: "Bad Request" },
    ];

    const error = errorTypes[Math.floor(Math.random() * errorTypes.length)];

    return res.status(error.status).json({
      error: error.message,
      delay,
      timestamp: new Date().toISOString(),
    });
  }

  res.json({
    message: "Unstable endpoint succeeded 🚀",
    delay,
    timestamp: new Date().toISOString(),
  });
});

app.get("/user-cpu", (req, res) => {
  const start = performance.now();

  while (performance.now() - start < 5000) {
    Math.sqrt(Math.random());
  }

  res.json({ ok: true });
});

app.get("/system-cpu", (req, res) => {
  for (let i = 0; i < 15; i++) {
    // use this command to generate the bigfile
    // dd if=/dev/urandom of=bigfile.dat bs=1M count=500
    fs.readFileSync("./bigfile.dat");
  }

  res.json({
    message: "Heavy sync file IO done",
  });
});

app.get("/cpu-usage", (req, res) => {
  const { user, system } = process.cpuUsage();
  res.json({
    user: user / 1000,
    system: system / 1000,
    total: (user + system) / 1000,
    uptime: performance.now(),
  });
});

// Prom Client
promClient.collectDefaultMetrics();
app.get("/metrics", async (req, res) => {
  const metrics = await promClient.register.metrics();
  res.set("Content-type", promClient.register.contentType);

  res.end(metrics);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
