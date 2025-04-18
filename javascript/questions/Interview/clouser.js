function makeCounter() {
    let count = 0;
    return function () {
      count++;
      return count;
    };
  }
  const counter = makeCounter();
  console.log(counter());
  console.log(counter());

//   ==================

const obj = {
    name: "JS",
    regular() {
      console.log(this.name);
    },
    arrow: () => {
      console.log(this.name);
    }
  };
  obj.regular();
  obj.arrow();

  // ===================