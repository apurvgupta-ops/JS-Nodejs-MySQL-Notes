//                 Parameter
function introduction(name) {
  console.log("hello", name);
}

//           Argument
introduction("apurv");

// Methods
// If any functions used in the objects then they called methods.

const obj = {
  name: "APurb",
  add: function () {
    console.log("hii"); // one way
  },
  addd() {
    console.log("hiii"); // second way
  },
};

const a = obj.addd();
console.log(a);

function hi(a, b, c) {
  console.log(a, b, c); // Now in this case we are not passing value for b, c value argument from the function call, so js put undefined values. 
}

hi(1);
