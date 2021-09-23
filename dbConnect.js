import mongoose from "mongoose";

export default async function dbConnect() {
    if (mongoose.connection.readyState === 1) return mongoose.connection.readyState
    return mongoose.connect(process.env.MONGODB_URI, {
        useFindAndModify: false,
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
}