const green = document.querySelector(".green");
const red = document.querySelector(".red");
const blue = document.querySelector(".blue");

window.addEventListener("click", (e) => {
  console.log("Window clicked");
});

document.addEventListener("click", (e) => {
  console.log("Document clicked");
});

document.body.addEventListener("click", (e) => {
  console.log("Body clicked");
});

green.addEventListener("click", (e) => {
  console.log("Green clicked");
});

red.addEventListener("click", (e) => {
  console.log("red clicked");
});

blue.addEventListener("click", (e) => {
  // Used for to stop event bubbling, only give values upto when we do stop.propogation().
  e.stopPropagation();
  console.log("blue clicked");
});

blue.addEventListener(
  "click",
  (e) => {
    // Used for to stop event bubbling, only give values upto when we do stop.propogation().
    e.stopPropagation();
    console.log("blue clicked");
  },
  { capture: true, once: true }
);
 
// capture true is used to do event capturing, we can use stopProgation here also.
// once true is used to call event Listner only one time.