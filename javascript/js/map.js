const map1 = new Map();

map1.set("a", 1);
map1.set("b", 2);
map1.set("c", 3);
map1.set("d", 4);

console.log(map1); // This is Object

// for only values (we have to convert this into array 9using (Array.from) and so on))
const val = map1.values();
console.log(Array.from(val)); // return an array (means convert into array)
console.log(map1.entries(val))
// we can use for of loop also
for (let val of map1.values()) {
  console.log(val);
}   

// If want key value pair
for (let [key, value] of map1.entries()) {
  console.log(key, value);
}

// Example
const contacts = new Map();
contacts.set("Jessie", { phone: "213-555-1234", address: "123 N 1st Ave" });
contacts.has("Jessie"); // true
contacts.get("Hilary"); // undefined
contacts.set("Hilary", { phone: "617-555-4321", address: "321 S 2nd St" });
contacts.get("Jessie"); // {phone: "213-555-1234", address: "123 N 1st Ave"}
contacts.delete("Raymond"); // false
// contacts.delete("Jessie"); // true
console.log(contacts.get("Hilary").phone); // 1
console.log(Object.fromEntries(contacts).Jessie);
