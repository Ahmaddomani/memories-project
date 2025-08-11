import mongoose from "mongoose";
import dotEnv from "dotenv";

dotEnv.config();

const connectToDb = async () => {
  try {
    await mongoose.connect(process.env.CONN_STRING);
    console.log("Connected Successfully to db ");
  } catch (err) {
    console.error("There is A Error With MongoDb");
    process.exit(1);
  }
};

export default connectToDb;
