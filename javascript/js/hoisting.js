console.log(name); // undefined, because in memory creation phase js put value as undefined.

var name = "Apurv";

// Function Defination

// Function Delarations

abc() // hii
function abc() {
  console.log("hii");
}

// Function Expression (because there is = sign)

ab() // can't access before initization.
const ab = function () {
  console.log("hii");
};

// Anonomouse Function
// function(){
//     console.log("hiii")
// }
