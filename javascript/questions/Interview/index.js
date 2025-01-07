const resolveBtn = document.querySelector(".resolveBtn");
const rejectBtn = document.querySelector(".rejectBtn");

const myPromise = new Promise((res, rej) => {
  resolveBtn.addEventListener("click", () => {
    res("Promise Resolved");
  }),
    rejectBtn.addEventListener("click", () => {
      rej("Promise Reject");
    });
});
myPromise.then((i) => console.log(i)).catch((err) => console.log(err));
