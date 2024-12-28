//                 Parameter
function introduction(name) {
  console.log("hello", name);
}

//           Argument
introduction("apurv");



// Methods
// If any functions used in the objects then they called methods.

const obj ={
  name  :"APurb",
  add : function(){
    console.log("hii") // one way
  } ,
  addd(){
    console.log("hiii") // second way
  }
}


const a = obj.addd()
console.log(a);