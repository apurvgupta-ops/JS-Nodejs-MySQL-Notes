// The Prototype Pattern lets you create new objects by cloning an existing object, instead of creating them from scratch.

// In JavaScript, this fits perfectly because JS is prototype-based, not class-based.

// Key idea:
// Create an object → use it as a prototype → make new objects that inherit from it.

const details = {
  init(name, role) {
    this.name = name;
    this.role = role;
  },
  getInfo() {
    return `My name is ${this.name} and his role ${this.role}`;
  },
};

const user1 = Object.create(details);
user1.init("Apurv", "Reactjs");
const user2 = Object.create(details);
user2.init("Appu", "Nodes");

console.log(user1.getInfo());
console.log(user2.getInfo());
11;
