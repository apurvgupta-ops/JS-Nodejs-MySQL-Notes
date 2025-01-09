// const resolveBtn = document.querySelector(".resolveBtn");
// const rejectBtn = document.querySelector(".rejectBtn");

// const myPromise = new Promise((res, rej) => {
//   resolveBtn.addEventListener("click", () => {
//     res("Promise Resolved");
//   }),
//     rejectBtn.addEventListener("click", () => {
//       rej("Promise Reject");
//     });
// });
// myPromise.then((i) => console.log(i)).catch((err) => console.log(err));



// Intersecting Two circles
let cirCoord = [];

function cicleIntersection(x, y, r, x1, y1, r1) {
  return Math.hypot(x - x1, y - y1) <= r + r1;
}

function logIfIntersect() {
  let x1 = cirCoord[0].x;
  let x2 = cirCoord[1].x;
  let y1 = cirCoord[0].y;
  let y2 = cirCoord[1].y;
  let r1 = cirCoord[0].radius;
  let r2 = cirCoord[1].radius;

  console.log({ x1, x2, y1, y2 });

  return cicleIntersection(x1, y1, r1, x2, y2, r2);
}

document.addEventListener("click", (event) => {
  let totalCircle = document.querySelectorAll(".circle");
  console.log(totalCircle);
  if (totalCircle.length == 2) {
    totalCircle.forEach((circ) => {
      document.body.removeChild(circ);
      cirCoord.shift();
    });
  }

  const x = event.clientX;
  const y = event.clientY;

  const radius = Math.random() * (200 - 50) + 50;
  const circle = document.createElement("div");
  circle.classList.add("circle");
  let divStyle = circle.style;
  cirCoord.push({ x, y, radius });
  console.log({ cirCoord });

  divStyle.top = y - radius + "px";
  divStyle.left = x - radius + "px";
  divStyle.width = radius * 2 + "px";
  divStyle.height = radius * 2 + "px";

  document.body.appendChild(circle);
  if (cirCoord.length === 2) {
    const res = logIfIntersect();
    console.log("intersect", res);
  }
});
