import {Buffer, contants}  from 'buffer'

// Constants => this method is buffer provides to function max_byte_length and max-string_length, which means we can create the buffer of that size;
// 1. max_byte_length  = 4gb;
// 2. max_string_length  = 512kb;

// change in poolsize
// Buffer.poolsize(10000)

// Buffer uses (8192) bytes so, we can use as many as buffer between these size, if the size excide then it automatically creates the new buffer.



const a = Buffer.alloc(4) // create the buffer of same bytes we mention.
const b = Buffer.allocUnsafe(4) // behind the scene it works on arraypool (poolsize) and create the buffer of 8192 size.
const c = Buffer.form("abc") // behind the scene it works on allocUnsafe.

console.log(a.byteLength)
console.log(b.byteLength)

console.log(a.buffer.byteLength)
console.log(b.buffer.byteLength)