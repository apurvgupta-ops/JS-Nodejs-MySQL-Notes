// setTimeout allows us to run a function once after the interval of time.
setTimeout(a, 1000);

function a() {
  console.log("hiii");
}

// Canceling with clearTimeout
let timerId = setTimeout(() => alert("never happens"), 1000);
alert(timerId); // timer identifier

clearTimeout(timerId);
alert(timerId);

// setInterval allows us to run a function repeatedly, starting after the interval of time, then repeating continuously at that interval
// repeat with the interval of 2 seconds
let timerIds = setInterval(() => alert("tick"), 2000);

// after 5 seconds stop
setTimeout(() => {
  clearInterval(timerIds);
  alert("stop");
}, 5000);

// Nested setTimeout
// There are two ways of running something regularly

let timer = setTimeout(function tick() {
  alert("tick");
  timerId = setTimeout(tick, 2000); // (*)
}, 2000);

// The setTimeout above schedules the next call right at the end of the current one (*).
// The nested setTimeout is a more flexible method than setInterval. This way the next call may be scheduled differently, depending on the results of the current one.
// For instance, we need to write a service that sends a request to the server every 5 seconds asking for data, but in case the server is overloaded, it should increase the interval to 10, 20, 40 seconds…

// Here’s the pseudocode:

let delay = 5000;

let timerIdss = setTimeout(function request() {
  //   ...send request...
  if ("request failed due to server overload") {
    // increase the interval to the next run
    delay *= 2;
  }

  timerIdss = setTimeout(request, delay);
}, delay);
