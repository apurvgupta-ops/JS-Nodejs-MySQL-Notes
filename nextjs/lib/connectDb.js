import mongoose from "mongoose";

const URL = "mongodb://localhost:27017/TodoApp";
export const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log("Already Connected");
            return;
        }

        await mongoose.connect(URL);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};
