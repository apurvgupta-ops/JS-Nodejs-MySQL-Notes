// import mongoose from "mongoose";

// const URL = "mongodb://localhost:27017/TodoApp";
// export const connectDB = async () => {
//     try {
//         if (mongoose.connection.readyState === 1) {
//             console.log("Already Connected");
//             return;
//         }

//         await mongoose.connect(URL);
//         console.log("MongoDB connected successfully");
//     } catch (error) {
//         console.log(error);
//         process.exit(1);
//     }
// };

import mongoose from "mongoose";

let cached = global.mongoose;
const URL = "mongodb://localhost:27017/TodoApp";

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(URL, {
        family: 4, // Prevents the ::1 error
      })
      .then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
