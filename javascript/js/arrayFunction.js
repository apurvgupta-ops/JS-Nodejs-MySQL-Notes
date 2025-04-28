// we can create an array with any type of values.
const arr = [1, 2, 3, 4, 5, "Apurv", "", null, undefined, [], {}];

arr.push(10);
arr.pop();

// for of loop
for (const alpha of arr) {
  console.log(alpha);
}

// MAP
const returnValue = arr.map((item) => {
  return arr;
});

// filter
const filterValue = arr.filter((item) => {
  return item.includes("A");
});

// Reduce
const reducedValue = arr.reduce((accmulator, currentValue, index) => {
  return accmulator + currentValue;
}, 0); // initial value

// some => RETURN  boolean value if one get true.
const booleanValue = arr.some((item) => {
  return item > 3;
});

// every => RETURN boolean value if one get false.
const booleanValues = arr.every((item) => {
  return item > 3;
});
