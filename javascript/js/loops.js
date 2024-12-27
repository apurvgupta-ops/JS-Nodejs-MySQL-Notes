const arr = ["A", "B", "C", "D", "E"];

console.log(arr.length);

// WHILE LOOP
console.log("While Loop");
let i = 0;
while (i < arr.length) {
  console.log(`${i + 1}.${arr[i]}`);
  i++;
}

// FOR LOOP
console.log("For Loop");
for (let i = 0; i <= 100; i++) {
  if (i % 2 == 0) {
    console.log(i);
  }
  // console.log(`${i + 1}.${arr[i]}`);
}

// DO WHILE LOOP
let j = 0;
do {
  console.log(j);
  j++;
} while (i < 5);
