const a = {};
const b = {};

// Both have different address, thats why a and b is not equal.
// If we create the object with some another object inside every object has there own address.
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

// behind the scene key is string.
const data = {
  name: "Apurv",
  age: "24",
  ph: "123456",
  "last-name": "Gupta",
};

// we can access the value by :
console.log(data.name);
console.log(data["last-name"]); // this is used when there is a key with some - etc.

// To add the value in the object.
const demo = {};

demo.age = 23;
demo.name = "Apurv";
demo["last-name"] = "gupta";

// Object.seal() vs Object.freeze()
const demo1 = {
  name: "Apurv",
  age: 24,
  address: {
    street: "Balaji Tower",
    landmark: "Vivacity",
    personal: {
      ph: "1234567890",
    },
  },
};

// It basically used for not to add or delete any value from the object.
Object.seal(demo1);

// It basically used to not add, delete or change any value in the object.
Object.freeze(demo1);

// This is used to check mentioned property is in that object or not , return boolean.
"name" in demo1;

// Shallow copy (we only copy the parent object) vs deep copy

const demo2 = {
  name: "Apurv",
  age: 24,
  address: {
    street: "Balaji Tower",
    landmark: "Vivacity",
    personal: {
      ph: "1234567890",
    },
  },
};
console.log({ demo2 });
// shallow copy
const newObj = {};
Object.assign(newObj, demo2);
newObj.name = "Appu";
newObj.address.street = "balaji tower 55";
console.log({ newObj });

const newObj2 = { ...demo2 };
newObj2.name = "Apppppu";
newObj2.address.street = "balaji tower";
console.log({ newObj2 });

// deep Copy
const newObj3 = JSON.parse(JSON.stringify(demo2));
newObj3.address.street = "Balaji tower 5";
console.log({ newObj3 });
