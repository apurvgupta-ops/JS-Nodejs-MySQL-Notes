// The Singleton Pattern ensures that a class (or object) has only one instance and provides a global access point to that instance.

// In simple words:
// No matter how many times you try to create it, you always get the same object.

let count = 0;
const counter = {
  increment() {
    return ++count;
  },
  decrement() {
    return --count;
  },
};

Object.freeze(counter);
export { counter }; //  Now if we use this counter anywhere in the  system, it share the same value all over the system, The "New" keyword always create the new instance.

// one more example
const counterSingleton = (function () {
  let instance;

  let counter = 0;

  function createInstance() {
    return {
      getCount() {
        return counter;
      },
      increment() {
        return ++counter;
      },
      decrement() {
        return --counter;
      },
    };
  }

  return function () {
    if (!instance) {
      instance = createInstance();
    }
    return instance;
  };
})();

const counter1 = counterSingleton();
counter1.increment();

const counter2 = counterSingleton();
console.log(counter2.getCount());
