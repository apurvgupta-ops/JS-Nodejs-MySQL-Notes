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


// for of loop
for(const alpha of arr){
  console.log(alpha)
}

// for in loop
const d = {
  // address :@123
  name: "Apurv",
  age: "24",
  ph: "123456",
  contact: {
    // address :@456
    "last-name": "Gupta",
    address: {
      // address :@789
      a: "Balaji tower",
    },
  },
};

for(const de in d){
  console.log(d[de])
}



// MAP
const returnValue = arr.map((item) =>{
  return arr

})


// filter
const filterValue = arr.filter((item) =>{
  return item.includes("A")
})


// Reduce
const reducedValue = arr.reduce((accmulator, currentValue, index) =>{
  return accmulator + currentValue
} ,0) // initial value


// some => RETURN  boolean value if one get true.
const booleanValue = arr.some((item) =>{
  return item >3;
})

// every => RETURN boolean value if one get false.
const booleanValues = arr.every((item) =>{
  return item >3;
})


