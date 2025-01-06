const p1 = new Promise((resolve, reject) => {
  if (1) {
    resolve("Promise Resolved");
  } else {
    reject("Promise Reject");
  }
});

p1.then((i) => console.log(i)).catch((err) => console.log(err));

const resolveBtn = document.querySelector('#resolve-btn')
const rejectBtn = document.querySelector('#reject-btn')

const p = new Promise((resolve, reject) => {
  resolveBtn.addEventListener('click', () => {
    resolve('Promise Resolveddd')
  })

  rejectBtn.addEventListener('click', () => {
    reject('Promise Rejected')
  })
})

p.then((data) => {
  console.log(data);
  return 155
}).then((data) => {
  console.log(data);
  return 'Anurag'
}).then((data) => {
  console.log(data);
}).catch(err => {
  console.log(err);
})

// Async/await

async function makeAsyncRequest() {
  const url =
    "https://6wrlmkp9u2.execute-api.us-east-1.amazonaws.com/?sleep=2000";
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

makeAsyncRequest().then((data) => {
  console.log(data);
});
