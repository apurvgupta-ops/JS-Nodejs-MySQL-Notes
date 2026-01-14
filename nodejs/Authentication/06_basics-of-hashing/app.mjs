const encodedText = new TextEncoder().encode("Hello World");
console.log({encodedText})
const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);
console.log({hashBuffer})
const hashArray = [...new Uint8Array(hashBuffer)];
console.log({hashArray})
const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, "0")).join("");
console.log(hashHex);