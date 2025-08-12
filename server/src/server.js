import express from "express";
import globalErrorHandler from "./controllers/globalErrorHandler.js";
// import mongoose from "mongoose";
// import cors from "cors";
import dotEnv from "dotenv";
import noteRouter from "./routes/noteRoutes.js";
import customError from "./utils/customError.js";
import connectToDb from "./config/db.js";
import authRouter from "./routes/userRoute.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";
import { protect } from "./controllers/authControllers.js";
import cors from "cors";

// Start Express App;
const app = express();

app.use(helmet());

const limiter = rateLimit({
  limit: 1000,
  windowMs: 60 * 60 * 1000,
  message: "You Can't Make More Request , Please Try After 1 Hour",
  keyGenerator: (req) => req.user?.id || ipKeyGenerator(req.ip),
});

// app.use("/api", limiter);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://192.168.1.111:3000"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.use(sanitize()); // for MongoDB Injection ______
//                                                  | ===> deal with the body
app.use(xss()); // for Cross-Site Scripting (XSS)___|

app.use(hpp());

app.use(cookieParser());

dotEnv.config({ path: "../config.env" }); // => To Use The Config File ./ because it is depends on the root folder

//Define the Port
const port = +process.env.PORT || 3000;

// Connect to the dataBase
connectToDb();

// Use The Note Route
app.use("/api/v1/notes", protect, limiter, noteRouter);
// Use The auth Route
app.use("/api/v1/users", limiter, authRouter);

// handle not Found Error
app.use("*", (req, res, next) => {
  const error = new customError("This Page Is Not Found", 404);
  next(error);
});

// Global Error Handler That Will Handle All Errors
app.use(globalErrorHandler);

process.on("unhandledRejection", (error) => {
  console.log(error.name + ":", error.message);
  // the exit here is optional
  server.close((error) => process.exit(1));
});

// Start The Server
app.listen(port, () => console.log(`Server Start On Port ${port}`));
